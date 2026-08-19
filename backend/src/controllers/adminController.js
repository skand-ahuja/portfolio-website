/**
 * adminController.js
 *
 * Handles administrator authentication.
 *
 * Responsibilities:
 * - Validate admin login input
 * - Verify configured admin username
 * - Compare password using bcrypt
 * - Generate a signed JWT
 * - Store JWT in a secure HttpOnly cookie
 * - Return safe administrator information
 *
 * Security:
 * - Plain-text passwords are never stored
 * - Password hashes are never returned
 * - JWT secret is never returned
 * - JWT is NOT exposed to frontend JavaScript
 * - Authentication errors use generic messages
 * - Internal errors are not exposed to the client
 */

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/* ============================================================
   ENVIRONMENT VARIABLE HELPER
   ============================================================ */

/**
 * Returns a required environment variable.
 *
 * Throws an error if the variable is missing.
 *
 * This prevents the application from silently operating with
 * incomplete authentication configuration.
 */
function getRequiredEnvironmentVariable(name) {
  const value = process.env[name];

  if (
    typeof value !== "string" ||
    value.trim() === ""
  ) {
    throw new Error(
      `${name} is not configured.`
    );
  }

  return value;
}

/* ============================================================
   ADMIN LOGIN
   ============================================================ */

/**
 * POST /api/admin/login
 *
 * Expected request body:
 *
 * {
 *   "username": "skand_admin",
 *   "password": "your-password"
 * }
 *
 * Successful response:
 *
 * {
 *   "success": true,
 *   "message": "Admin login successful.",
 *   "admin": {
 *     "username": "skand_admin",
 *     "role": "admin"
 *   }
 * }
 *
 * IMPORTANT:
 *
 * The JWT is NOT returned in the response.
 *
 * It is stored inside an HttpOnly cookie called:
 *
 * admin_token
 */
export async function loginAdmin(req, res) {
  try {
    /* ========================================================
       READ REQUEST BODY
       ======================================================== */

    /*
     * Protect against req.body being undefined.
     *
     * This also prevents destructuring errors if a malformed
     * request reaches this controller.
     */
    const {
      username,
      password,
    } = req.body || {};

    /* ========================================================
       BASIC INPUT VALIDATION
       ======================================================== */

    /*
     * Validate both type and content.
     *
     * This prevents unexpected objects/arrays from reaching
     * the authentication logic.
     */
    if (
      typeof username !== "string" ||
      typeof password !== "string" ||
      username.trim() === "" ||
      password.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Username and password are required.",
      });
    }

    /* ========================================================
       LOAD AUTHENTICATION CONFIGURATION
       ======================================================== */

    const adminUsername =
      getRequiredEnvironmentVariable(
        "ADMIN_USERNAME"
      );

    const passwordHash =
      getRequiredEnvironmentVariable(
        "ADMIN_PASSWORD_HASH"
      );

    const jwtSecret =
      getRequiredEnvironmentVariable(
        "JWT_SECRET"
      );

    /* ========================================================
       USERNAME VERIFICATION
       ======================================================== */

    /*
     * Use the same generic authentication response for
     * username and password failures.
     *
     * This prevents attackers from discovering whether
     * a particular admin username exists.
     */
    const usernameMatches =
      username.trim() === adminUsername;

    if (!usernameMatches) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid credentials.",
      });
    }

    /* ========================================================
       PASSWORD VERIFICATION
       ======================================================== */

    /*
     * bcrypt.compare() compares the submitted plain-text
     * password against the stored bcrypt hash.
     *
     * The plain-text password is NEVER stored.
     */
    const passwordMatches =
      await bcrypt.compare(
        password,
        passwordHash
      );

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid credentials.",
      });
    }

    /* ========================================================
       GENERATE JWT
       ======================================================== */

    /*
     * Only non-sensitive information goes inside the JWT.
     *
     * NEVER put:
     * - Password
     * - Password hash
     * - Database credentials
     * - SMTP credentials
     * - JWT secret
     */
    const token = jwt.sign(
      {
        username: adminUsername,
        role: "admin",
      },

      jwtSecret,

      {
        /*
         * Admin session expires after 2 hours.
         */
        expiresIn: "2h",

        /*
         * Prevent this JWT from being accidentally accepted
         * by another application using the same secret.
         */
        issuer:
          "skand-portfolio-api",

        audience:
          "skand-portfolio-admin",
      }
    );

    /* ========================================================
       SECURE AUTHENTICATION COOKIE
       ======================================================== */

    /*
     * Determine whether the backend is running in production.
     */
    const isProduction =
      process.env.NODE_ENV ===
      "production";

    /*
     * Store the JWT inside an HttpOnly cookie.
     *
     * httpOnly:
     * JavaScript running in the browser cannot access
     * document.cookie for this cookie.
     *
     * This helps protect the JWT from being stolen through
     * client-side JavaScript/XSS.
     *
     * secure:
     * In production the cookie is sent only over HTTPS.
     *
     * sameSite:
     * - Local development: lax
     * - Production: none
     *
     * "none" is required when the frontend and backend are
     * deployed on different sites and the browser must send
     * the cookie cross-site.
     *
     * maxAge:
     * Matches the JWT's 2-hour lifetime.
     */
    res.cookie(
      "admin_token",
      token,
      {
        httpOnly: true,

        secure:
          isProduction,

        sameSite:
          isProduction
            ? "none"
            : "lax",

        maxAge:
          2 * 60 * 60 * 1000,

        path: "/",
      }
    );

    /* ========================================================
       SUCCESS RESPONSE
       ======================================================== */

    /*
     * IMPORTANT:
     *
     * The JWT is deliberately NOT included here.
     *
     * The browser receives the JWT through the HttpOnly
     * cookie instead.
     */
    return res.status(200).json({
      success: true,

      message:
        "Admin login successful.",

      /*
       * Only safe administrator information is returned.
       */
      admin: {
        username:
          adminUsername,

        role: "admin",
      },
    });
  } catch (error) {
    /* ========================================================
       INTERNAL ERROR HANDLING
       ======================================================== */

    /*
     * Detailed error is logged server-side for debugging.
     *
     * Never expose error.message, stack traces, environment
     * variables, JWT secrets, or database details to the client.
     */
    console.error(
      "❌ Admin login error:",
      error.message
    );

    return res.status(500).json({
      success: false,

      message:
        "Unable to process login request.",
    });
  }
}

/* ============================================================
   ADMIN LOGOUT
   ============================================================ */

/**
 * POST /api/admin/logout
 *
 * Clears the administrator authentication cookie.
 *
 * The JWT itself does not need to be manually deleted
 * from the browser because it is stored inside an
 * HttpOnly cookie controlled by the backend.
 */
export function logoutAdmin(req, res) {
  try {
    const isProduction =
      process.env.NODE_ENV === "production";

    res.clearCookie(
      "admin_token",
      {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction
          ? "none"
          : "lax",
        path: "/",
      }
    );

    return res.status(200).json({
      success: true,
      message:
        "Admin logged out successfully.",
    });
  } catch (error) {
    console.error(
      "❌ Admin logout error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to log out. Please try again.",
    });
  }
}