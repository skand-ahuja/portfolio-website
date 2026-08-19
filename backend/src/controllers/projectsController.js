/**
 * projectsController.js
 * Handles retrieval of public projects for the frontend portfolio.
 */
import pool from "../config/db.js";

/**
 * GET /api/projects
 * Fetches all active projects sorted by featured status and display order.
 */
export async function getAllProjects(req, res) {
  try {
    const result = await pool.query(`
      SELECT id, title, description, github_url, live_url, tech_stack, image_url, category, featured, display_order, created_at, updated_at
      FROM projects ORDER BY featured DESC, display_order ASC, created_at DESC
    `);
    return res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    console.error("Error fetching projects:", error.message);
    return res.status(500).json({ success: false, message: "Could not load projects right now." });
  }
}