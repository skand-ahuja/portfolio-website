/**
 * adminRoutes.js
 *
 * Protected administration routes.
 *
 * Responsibilities:
 * - Admin login
 * - Project management
 * - Authentication protection
 */

import express from "express";

/* Admin project operations */
import {
  getAdminProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../controllers/adminProjectController.js";

/* Admin authentication */
import {
  loginAdmin,
  logoutAdmin,
} from "../controllers/adminController.js";

/* JWT authentication middleware */
import {
  requireAdmin,
} from "../middleware/authMiddleware.js";

/* Rate limiter */
import {
  adminLoginLimiter,
} from "../middleware/rateLimiter.js";


const router = express.Router();

/* ============================================================
   ADMIN LOGIN
   ============================================================ */

/**
 * POST /api/admin/login
 *
 * Public endpoint.
 *
 * Flow:
 * Client
 *   ↓
 * Rate limiter
 *   ↓
 * loginAdmin
 *   ↓
 * bcrypt
 *   ↓
 * JWT
 */
router.post(
  "/login",
  adminLoginLimiter,
  loginAdmin
);

/* ============================================================
   ADMIN LOGOUT
   ============================================================ */

/**
 * POST /api/admin/logout
 *
 * Clears the HttpOnly authentication cookie.
 *
 * This endpoint requires a valid admin session.
 */
router.post(
  "/logout",
  requireAdmin,
  logoutAdmin
);


/* ============================================================
   ADMIN PROJECTS
   ============================================================ */

/**
 * GET /api/admin/projects
 *
 * Protected endpoint.
 *
 * Returns all projects for the admin panel.
 *
 * Flow:
 * Client
 *   ↓
 * JWT
 *   ↓
 * requireAdmin
 *   ↓
 * getAdminProjects
 */
router.get(
  "/projects",
  requireAdmin,
  getAdminProjects
);

/**
 * POST /api/admin/projects
 *
 * Protected endpoint.
 *
 * Creates a new project.
 */
router.post(
  "/projects",
  requireAdmin,
  createProject
);

/**
 * PUT /api/admin/projects/:id
 *
 * Protected endpoint.
 *
 * Updates an existing project.
 */
router.put(
  "/projects/:id",
  requireAdmin,
  updateProject
);

/**
 * DELETE /api/admin/projects/:id
 *
 * Protected endpoint.
 *
 * Permanently deletes a project.
 */
router.delete(
  "/projects/:id",
  requireAdmin,
  deleteProject
);

/* ============================================================
   EXPORT
   ============================================================ */

export default router;