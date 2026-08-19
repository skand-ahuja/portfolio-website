/**
 * rateLimiter.js
 *
 * Centralized API rate limiting.
 *
 * Protection provided:
 *
 * 1. General API limiter
 *    - Protects public API endpoints from excessive requests.
 *
 * 2. Contact form limiter
 *    - Stronger protection because every successful request can
 *      trigger database writes and email delivery.
 *
 * Security notes:
 * - express-rate-limit uses the client's IP address by default.
 * - Express "trust proxy" must be configured correctly in server.js
 *   when deployed behind Railway/Vercel/reverse proxies.
 * - Health checks are excluded from the general limiter so monitoring
 *   services such as UptimeRobot don't consume API quota.
 */

import rateLimit from "express-rate-limit";

/* ============================================================
   COMMON RATE LIMIT RESPONSE
   ============================================================ */

/**
 * Keeps rate-limit responses consistent across the API.
 */
function rateLimitResponse(req, res) {
  return res.status(429).json({
    success: false,
    message: "Too many requests. Please try again later.",
  });
}

/* ============================================================
   CONTACT FORM LIMITER
   ============================================================ */

/**
 * Protects the contact endpoint from:
 *
 * - Spam submissions
 * - Automated bots
 * - Email flooding
 * - Database abuse
 *
 * Limit:
 * 5 requests per IP per hour.
 *
 * This is intentionally stricter than the general API limiter
 * because every contact request can result in:
 *
 *    Request
 *       ↓
 *    Validation
 *       ↓
 *    PostgreSQL INSERT
 *       ↓
 *    Email notification
 *       ↓
 *    Auto-reply
 */
export const contactFormLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,

  max: 5,

  standardHeaders: true,

  legacyHeaders: false,

  handler: rateLimitResponse,
});

/* ============================================================
   GENERAL API LIMITER
   ============================================================ */

/**
 * Protects normal public API endpoints.
 *
 * Example:
 *
 * GET /api/projects
 *
 * Limit:
 * 100 requests per IP every 15 minutes.
 *
 * This is generous enough for normal portfolio usage while
 * providing basic protection against scraping and accidental
 * request loops.
 */
export const generalApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  max: 100,

  standardHeaders: true,

  legacyHeaders: false,

  /**
   * Do not rate-limit the health endpoint.
   *
   * UptimeRobot and other monitoring services may request this
   * endpoint repeatedly. It should remain available even when
   * other API traffic reaches its limit.
   *
   * Because this limiter is mounted at:
   *
   *    app.use("/api", generalApiLimiter)
   *
   * req.path for:
   *
   *    /api/health
   *
   * will be:
   *
   *    /health
   */
  skip: (req) => req.path === "/health",

  handler: rateLimitResponse,
});


/**
 * adminLoginLimiter
 *
 * Protects the administrator login endpoint from
 * brute-force password attempts.
 *
 * Limit:
 * 5 login attempts per 15 minutes per IP.
 */
export const adminLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  max: 5,

  standardHeaders: true,

  legacyHeaders: false,

  handler: rateLimitResponse,
});