import express from "express";
import { getAllProjects } from "../controllers/projectsController.js";

const router = express.Router();

/**
 * GET /api/projects
 * Public endpoint — returns all projects for the Projects section.
 * No authentication needed since this is just public portfolio data.
 */
router.get("/", getAllProjects);

export default router;
