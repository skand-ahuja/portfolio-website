/**
 * authMiddleware.js
 * Protects admin-only API routes by verifying the JWT stored in the HttpOnly cookie.
 * Ensures the token signature, expiration, issuer, audience, and admin role are valid.
 */
import jwt from "jsonwebtoken";

export function requireAdmin(req, res, next) {
  try {
    if (typeof process.env.JWT_SECRET !== "string" || process.env.JWT_SECRET.trim() === "") {
      console.error("❌ JWT_SECRET is not configured.");
      return res.status(500).json({ success: false, message: "Authentication service unavailable." });
    }

    const token = req.cookies?.admin_token;
    if (typeof token !== "string" || token.trim() === "") {
      return res.status(401).json({ success: false, message: "Authentication required." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      issuer: "skand-portfolio-api",
      audience: "skand-portfolio-admin",
    });

    if (typeof decoded !== "object" || decoded === null || decoded.role !== "admin" || typeof decoded.username !== "string" || decoded.username.trim() === "") {
      return res.status(403).json({ success: false, message: "Access denied or invalid token." });
    }

    req.admin = { username: decoded.username, role: decoded.role };
    next();
  } catch (error) {
    if (error?.name === "TokenExpiredError") console.warn("⚠️ Admin authentication token expired.");
    else console.warn("⚠️ Admin authentication failed.");
    return res.status(401).json({ success: false, message: "Invalid or expired authentication token." });
  }
}