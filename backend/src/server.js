// Load environment variables first & logs
import "dotenv/config";
import morgan from "morgan"

// Core Express and security libraries
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

// Database and external service verifications
import { testConnection } from "./config/db.js";
import { verifyEmailConnection } from "./services/emailService.js";

// Middleware and routes
import { generalApiLimiter } from "./middleware/rateLimiter.js";
import contactRoutes from "./routes/contactRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

// Initialize Express app
const app = express();
const PORT = Number(process.env.PORT) || 5000;

// Trust proxy (e.g., Railway/Nginx) for accurate client IPs in rate limiting
app.set("trust proxy", process.env.TRUST_PROXY === "1");

// Apply basic security headers but allow cross-origin images for portfolio
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

// Parse frontend URLs from .env (supports single or comma-separated multiple domains)
const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5173").split(",").map(url => url.trim());

// Configure CORS to strictly allow recognized frontends with cookie credentials
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) callback(null, true);
    else callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Frontend Logs
app.use(morgan("dev"));

// Restrict JSON payload size to 10kb to prevent memory overload from large requests
app.use(express.json({ limit: "10kb" }));

// Parse incoming cookies (required for reading the secure admin HttpOnly JWT)
app.use(cookieParser());

// Apply global rate limiting to all /api routes (Health check is skipped internally)
app.use("/api", generalApiLimiter);

// Register application routes
app.use("/api/contact", contactRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/admin", adminRoutes);

// Health check endpoint for uptime monitoring (e.g., UptimeRobot) and DB status
app.get("/api/health", async (req, res) => {
  const databaseOk = await testConnection();
  if (!databaseOk) return res.status(503).json({ status: "error", database: "disconnected" });
  return res.status(200).json({ status: "ok", database: "connected", timestamp: new Date().toISOString() });
});

// Catch-all handler for undefined API routes (Returns simple 404 JSON)
app.use("/api", (req, res) => res.status(404).json({ success: false, message: "API endpoint not found." }));

// Global error handler to catch unexpected Express crashes without leaking server details
app.use(errorHandler);

// Main function to verify dependencies and start the HTTP server safely
async function startServer() {
  // Prevent backend from starting if the database is unreachable
  if (!(await testConnection())) {
    console.error("❌ Server startup aborted because PostgreSQL is unavailable.");
    process.exit(1);
  }

  // Verify SMTP settings, but don't stop the server if email fails to connect
  await verifyEmailConnection();

  // Boot up the server
  const server = app.listen(PORT, () => {
    console.log(`🚀 Portfolio backend running on port ${PORT} in ${process.env.NODE_ENV || "development"} mode`);
  });

  // Handle graceful shutdown to finish active requests and close DB connections safely on server stop
  const shutdown = async (signal) => {
    console.log(`\n🛑 ${signal} received. Shutting down gracefully...`);
    server.close(async () => {
      console.log("⏸️  HTTP server closed.");
      // Dynamically import pool to close it
      const { default: pool } = await import("./config/db.js");
      await pool.end();
      console.log("🔌 PostgreSQL connections closed.");
      process.exit(0);
    });

    // Force kill the process if graceful shutdown hangs for more than 10 seconds
    setTimeout(() => {
      console.error("⚠️  Could not close connections in time, forcefully shutting down.");
      process.exit(1);
    }, 10000);
  };

  // Listen for termination signals (Ctrl+C in terminal or kill commands from hosting platforms)
  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

// Start the application
startServer();