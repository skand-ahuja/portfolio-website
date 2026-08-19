/**
 * server.js
 *
 * Main entry point for the portfolio backend.
 *
 * Responsibilities:
 * - Load environment variables
 * - Configure security middleware
 * - Configure CORS
 * - Configure request body limits
 * - Configure API rate limiting
 * - Register API routes
 * - Provide health check
 * - Handle unknown API routes
 * - Handle unexpected server errors
 * - Start the HTTP server
 */

import "dotenv/config";

import express from "express";
import cors from "cors";
import helmet from "helmet";

import { testConnection } from "./config/db.js";
import { verifyEmailConnection } from "./services/emailService.js";

import { generalApiLimiter } from "./middleware/rateLimiter.js";

import contactRoutes from "./routes/contactRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

import cookieParser from "cookie-parser";

/* ============================================================
   APPLICATION
   ============================================================ */

const app = express();

const PORT = Number(process.env.PORT) || 5000;

/* ============================================================
   TRUST PROXY
   ============================================================ */

/*
 * Production hosting platforms such as Railway sit behind
 * a reverse proxy.
 *
 * Enabling this only when explicitly configured prevents
 * blindly trusting proxy headers during local development.
 */
app.set(
  "trust proxy",
  process.env.TRUST_PROXY === "1"
);

/* ============================================================
   SECURITY HEADERS
   ============================================================ */

app.use(
  helmet({
    /*
     * Portfolio project images and other resources may come
     * from external origins.
     */
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  })
);

/* ============================================================
   CORS
   ============================================================ */

/*
 * Only the configured frontend origin is allowed to call
 * the backend from a browser.
 *
 * Example:
 *
 * Local:
 * FRONTEND_URL=http://localhost:5173
 *
 * Production:
 * FRONTEND_URL=https://your-domain.com
 */
const allowedOrigin =
  process.env.FRONTEND_URL ||
  "http://localhost:5173";

  
app.use(
  cors({
    origin: allowedOrigin,

    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

/* ============================================================
   REQUEST BODY LIMIT
   ============================================================ */

/*
 * Prevent unnecessarily large JSON payloads from reaching
 * the application.
 *
 * Contact messages are small, so 10 KB is more than enough.
 */
app.use(
  express.json({
    limit: "10kb",
  })
);


/* ============================================================
   COOKIE PARSER
   ============================================================ */

/*
 * Allows Express to securely read authentication cookies.
 *
 * The actual authentication cookie will be configured as
 * HttpOnly + Secure in the next step.
 */
app.use(cookieParser());


/* ============================================================
   GENERAL API RATE LIMITING
   ============================================================ */

/*
 * Applies the general API limiter to all /api routes.
 *
 * More sensitive endpoints such as admin login have their own
 * stricter limiter inside their route definition.
 */
app.use(
  "/api",
  generalApiLimiter
);

/* ============================================================
   API ROUTES
   ============================================================ */

/*
 * PUBLIC CONTACT API
 *
 * POST /api/contact
 */
app.use(
  "/api/contact",
  contactRoutes
);

/*
 * PUBLIC PROJECT API
 *
 * GET /api/projects
 */
app.use(
  "/api/projects",
  projectRoutes
);

/*
 * ADMIN API
 *
 * POST /api/admin/login
 *
 * IMPORTANT:
 * This MUST be registered before the /api 404 fallback.
 */
app.use(
  "/api/admin",
  adminRoutes
);

/* ============================================================
   HEALTH CHECK
   ============================================================ */

/*
 * GET /api/health
 *
 * Used by:
 * - Local development
 * - Deployment health checks
 * - UptimeRobot
 *
 * The endpoint also verifies PostgreSQL connectivity.
 */
app.get(
  "/api/health",
  async (req, res) => {
    const databaseOk =
      await testConnection();

    if (!databaseOk) {
      return res.status(503).json({
        status: "error",
        database: "disconnected",
      });
    }

    return res.status(200).json({
      status: "ok",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  }
);

/* ============================================================
   UNKNOWN API ROUTES
   ============================================================ */

/*
 * This is intentionally placed AFTER all valid API routes.
 *
 * Example:
 *
 * GET /api/something-that-does-not-exist
 *
 * → 404
 */
app.use(
  "/api",
  (req, res) => {
    return res.status(404).json({
      success: false,
      message: "API endpoint not found.",
    });
  }
);

/* ============================================================
   GLOBAL ERROR HANDLER
   ============================================================ */

/*
 * Final safety net for unexpected Express errors.
 *
 * IMPORTANT:
 * Internal error details are logged on the server but are
 * NOT exposed to the client.
 */
app.use(
  (err, req, res, next) => {
    console.error(
      "Unhandled server error:",
      err
    );

    return res.status(500).json({
      success: false,
      message:
        "An unexpected server error occurred.",
    });
  }
);

/* ============================================================
   START SERVER
   ============================================================ */

async function startServer() {
  /*
   * PostgreSQL is required by this application.
   *
   * If the database cannot be reached, don't start a server
   * that will immediately fail API requests.
   */
  const databaseConnected =
    await testConnection();

  if (!databaseConnected) {
    console.error(
      "❌ Server startup aborted because PostgreSQL is unavailable."
    );

    process.exit(1);
  }

  /*
   * Verify email connectivity.
   *
   * Email is useful but should not prevent the entire API
   * from starting if SMTP is temporarily unavailable.
   */
  await verifyEmailConnection();

  app.listen(PORT, () => {
    console.log(
      `🚀 Portfolio backend running on port ${PORT}`
    );

    console.log(
      `   Environment: ${
        process.env.NODE_ENV || "development"
      }`
    );

    console.log(
      `   Health: http://localhost:${PORT}/api/health`
    );

    console.log(
      `   Admin: http://localhost:${PORT}/api/admin/login`
    );
  });
}

/* ============================================================
   START APPLICATION
   ============================================================ */

startServer();