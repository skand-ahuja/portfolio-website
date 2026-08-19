/**
 * authMiddleware.js
 *
 * Protects administrator-only API routes.
 *
 * Authentication flow:
 *
 * Frontend
 *    ↓
 * Login
 *    ↓
 * Backend generates JWT
 *    ↓
 * HttpOnly cookie: admin_token
 *    ↓
 * Browser automatically sends cookie
 *    ↓
 * authMiddleware
 *    ↓
 * Verify JWT
 *    ↓
 * Protected controller
 *
 * Security:
 * - JWT is stored in an HttpOnly cookie
 * - Frontend JavaScript cannot directly read the JWT
 * - JWT signature is verified
 * - Issuer is verified
 * - Audience is verified
 * - Admin role is verified
 */

import jwt from "jsonwebtoken";

/* ============================================================
   AUTHENTICATION MIDDLEWARE
   ============================================================ */

/**
 * Protects administrator-only routes.
 *
 * Expected authentication cookie:
 *
 * admin_token=<JWT>
 */
export function requireAdmin(
  req,
  res,
  next
) {
  try {
    /* ========================================================
       CHECK JWT SECRET
       ======================================================== */

    /*
     * The JWT secret is required to verify the token.
     *
     * Never expose the secret to the frontend.
     */
    if (
      typeof process.env.JWT_SECRET !==
        "string" ||
      process.env.JWT_SECRET.trim() ===
        ""
    ) {
      console.error(
        "❌ JWT_SECRET is not configured."
      );

      return res.status(500).json({
        success: false,
        message:
          "Authentication service unavailable.",
      });
    }

    /* ========================================================
       READ AUTHENTICATION COOKIE
       ======================================================== */

    /*
     * cookie-parser parses the Cookie header and makes
     * cookies available through req.cookies.
     *
     * Example:
     *
     * req.cookies = {
     *   admin_token: "eyJhbGciOi..."
     * }
     */
    const token =
      req.cookies?.admin_token;

    /* ========================================================
       CHECK TOKEN
       ======================================================== */

    if (
      typeof token !== "string" ||
      token.trim() === ""
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required.",
      });
    }

    /* ========================================================
       VERIFY JWT
       ======================================================== */

    /*
     * jwt.verify() checks:
     *
     * 1. Signature
     * 2. Expiration
     * 3. Issuer
     * 4. Audience
     *
     * If any of these fail, an exception is thrown.
     */
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET,
      {
        issuer:
          "skand-portfolio-api",

        audience:
          "skand-portfolio-admin",
      }
    );

    /* ========================================================
       VALIDATE DECODED TOKEN
       ======================================================== */

    /*
     * jwt.verify() returns a string or JwtPayload.
     *
     * We only accept an object containing the expected
     * administrator information.
     */
    if (
      typeof decoded !== "object" ||
      decoded === null
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid or expired authentication token.",
      });
    }

    /* ========================================================
       VERIFY ADMIN ROLE
       ======================================================== */

    /*
     * A valid JWT alone is not enough.
     *
     * The token must explicitly belong to an administrator.
     */
    if (
      decoded.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Access denied.",
      });
    }

    /* ========================================================
       VERIFY USERNAME
       ======================================================== */

    /*
     * Make sure the JWT contains a valid username.
     *
     * This prevents malformed tokens from being treated
     * as authenticated administrator sessions.
     */
    if (
      typeof decoded.username !==
        "string" ||
      decoded.username.trim() ===
        ""
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid authentication token.",
      });
    }

    /* ========================================================
       ATTACH ADMIN TO REQUEST
       ======================================================== */

    /*
     * Controllers can now access the authenticated admin
     * through req.admin.
     *
     * Example:
     *
     * req.admin.username
     * req.admin.role
     */
    req.admin = {
      username:
        decoded.username,

      role:
        decoded.role,
    };

    /* ========================================================
       CONTINUE REQUEST
       ======================================================== */

    next();
  } catch (error) {
    /* ========================================================
       JWT ERROR HANDLING
       ======================================================== */

    /*
     * Possible reasons:
     *
     * - Token expired
     * - Token modified
     * - Wrong JWT secret
     * - Invalid token format
     * - Wrong issuer
     * - Wrong audience
     *
     * We intentionally do NOT expose the exact reason.
     */

    /*
     * Log only a controlled server-side message.
     *
     * Avoid logging the actual JWT token.
     */
    if (
      error?.name ===
      "TokenExpiredError"
    ) {
      console.warn(
        "⚠️ Admin authentication token expired."
      );
    } else {
      console.warn(
        "⚠️ Admin authentication failed."
      );
    }

    return res.status(401).json({
      success: false,
      message:
        "Invalid or expired authentication token.",
    });
  }
}