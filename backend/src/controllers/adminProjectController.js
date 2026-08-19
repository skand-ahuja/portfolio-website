/**
 * adminProjectController.js
 * Handles CRUD operations for projects via the admin dashboard.
 * Endpoints are protected by authMiddleware.
 */
import pool from "../config/db.js";

/**
 * GET /api/admin/projects
 * Returns all projects for the admin panel, sorted by featured and display order.
 */
export async function getAdminProjects(req, res) {
  try {
    const result = await pool.query(`
      SELECT id, title, description, github_url, live_url, tech_stack, image_url, category, featured, display_order, created_at, updated_at
      FROM projects ORDER BY featured DESC, display_order ASC, created_at DESC
    `);
    return res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    console.error("❌ Error fetching admin projects:", error.message);
    return res.status(500).json({ success: false, message: "Could not load projects." });
  }
}

/**
 * POST /api/admin/projects
 * Creates a new project in the database.
 */
export async function createProject(req, res) {
  try {
    const { title, description, github_url, live_url, tech_stack, image_url, category, featured, display_order } = req.body ?? {};

    if (typeof title !== "string" || title.trim() === "") return res.status(400).json({ success: false, message: "Project title is required." });
    if (typeof description !== "string" || description.trim() === "") return res.status(400).json({ success: false, message: "Project description is required." });
    if (typeof tech_stack !== "string" || tech_stack.trim() === "") return res.status(400).json({ success: false, message: "Technology stack is required." });

    const validCategories = ["web_app", "automation", "data_dashboard", "other"];
    const projectCategory = validCategories.includes(category) ? category : "web_app";

    const result = await pool.query(`
      INSERT INTO projects (title, description, github_url, live_url, tech_stack, image_url, category, featured, display_order)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *
    `, [
      title.trim(), description.trim(), github_url?.trim() || null, live_url?.trim() || null, tech_stack.trim(),
      image_url?.trim() || null, projectCategory, Boolean(featured), Number.isInteger(display_order) ? display_order : 0
    ]);

    console.log(`✅ Admin created project: ${title.trim()}`);
    return res.status(201).json({ success: true, message: "Project created successfully.", data: result.rows[0] });
  } catch (error) {
    console.error("❌ Error creating project:", error.message);
    return res.status(500).json({ success: false, message: "Could not create project." });
  }
}

/**
 * PUT /api/admin/projects/:id
 * Updates an existing project in the database.
 */
export async function updateProject(req, res) {
  try {
    const projectId = Number(req.params.id);
    if (!Number.isInteger(projectId) || projectId <= 0) return res.status(400).json({ success: false, message: "Invalid project ID." });

    const { title, description, github_url, live_url, tech_stack, image_url, category, featured, display_order } = req.body ?? {};

    if (typeof title !== "string" || title.trim() === "") return res.status(400).json({ success: false, message: "Project title is required." });
    if (typeof description !== "string" || description.trim() === "") return res.status(400).json({ success: false, message: "Project description is required." });
    if (typeof tech_stack !== "string" || tech_stack.trim() === "") return res.status(400).json({ success: false, message: "Technology stack is required." });

    const validCategories = ["web_app", "automation", "data_dashboard", "other"];
    const projectCategory = validCategories.includes(category) ? category : "web_app";

    const result = await pool.query(`
      UPDATE projects SET title = $1, description = $2, github_url = $3, live_url = $4, tech_stack = $5, image_url = $6, category = $7, featured = $8, display_order = $9, updated_at = CURRENT_TIMESTAMP
      WHERE id = $10 RETURNING *
    `, [
      title.trim(), description.trim(), github_url?.trim() || null, live_url?.trim() || null, tech_stack.trim(),
      image_url?.trim() || null, projectCategory, Boolean(featured), Number.isInteger(display_order) ? display_order : 0, projectId
    ]);

    if (result.rowCount === 0) return res.status(404).json({ success: false, message: "Project not found." });

    console.log(`✅ Admin updated project ID: ${projectId}`);
    return res.status(200).json({ success: true, message: "Project updated successfully.", data: result.rows[0] });
  } catch (error) {
    console.error("❌ Error updating project:", error.message);
    return res.status(500).json({ success: false, message: "Could not update project." });
  }
}

/**
 * DELETE /api/admin/projects/:id
 * Permanently deletes a project from the database.
 */
export async function deleteProject(req, res) {
  try {
    const projectId = Number(req.params.id);
    if (!Number.isInteger(projectId) || projectId <= 0) return res.status(400).json({ success: false, message: "Invalid project ID." });

    const result = await pool.query("DELETE FROM projects WHERE id = $1 RETURNING id, title", [projectId]);
    if (result.rowCount === 0) return res.status(404).json({ success: false, message: "Project not found." });

    console.log(`🗑️ Admin deleted project ID: ${projectId}`);
    return res.status(200).json({ success: true, message: "Project deleted successfully.", data: result.rows[0] });
  } catch (error) {
    console.error("❌ Error deleting project:", error.message);
    return res.status(500).json({ success: false, message: "Could not delete project." });
  }
}