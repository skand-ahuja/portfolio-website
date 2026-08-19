/**
 * adminRoutes.js
 * Defines routes for the protected administrator dashboard.
 */
import express from "express";
import { getAdminProjects, createProject, updateProject, deleteProject } from "../controllers/adminProjectController.js";
import { loginAdmin, logoutAdmin } from "../controllers/adminController.js";
import { requireAdmin } from "../middleware/authMiddleware.js";
import { adminLoginLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.post("/login", adminLoginLimiter, loginAdmin);
router.post("/logout", requireAdmin, logoutAdmin);

router.get("/projects", requireAdmin, getAdminProjects);
router.post("/projects", requireAdmin, createProject);
router.put("/projects/:id", requireAdmin, updateProject);
router.delete("/projects/:id", requireAdmin, deleteProject);

export default router;