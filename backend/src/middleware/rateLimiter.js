/**
 * rateLimiter.js
 * Centralized API rate limiting using express-rate-limit.
 * Protects endpoints from DDoS, bot spam, and brute-force attacks.
 */
import rateLimit from "express-rate-limit";

function rateLimitResponse(req, res) {
  return res.status(429).json({ success: false, message: "Too many requests. Please try again later." });
}

/**
 * Contact Form Limiter: Max 5 requests per hour per IP.
 * Stricter limit because it triggers DB writes and email delivery.
 */
export const contactFormLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitResponse,
});

/**
 * General API Limiter: Max 100 requests per 15 minutes per IP.
 * Protects public endpoints (like /api/projects). Skips /health route for Uptime monitors.
 */
export const generalApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.path === "/health",
  handler: rateLimitResponse,
});

/**
 * Admin Login Limiter: Max 5 attempts per 15 minutes per IP.
 * Protects administrator login from brute-force password guessing.
 */
export const adminLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitResponse,
});