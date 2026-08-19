/**
 * errorHandler.js
 * Centralized Express error handler.
 * Responsibilities:
 * - Catch unexpected application errors
 * - Log detailed errors on the server for debugging
 * - Return safe, generic error messages to clients
 * IMPORTANT: Internal error details are never exposed to users.
 */
export function errorHandler(err, req, res, next) {
  console.error("❌ Unhandled server error:", err);
  
  return res.status(500).json({
    success: false,
    message: "An unexpected server error occurred.",
  });
}