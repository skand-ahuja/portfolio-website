/**
 * db.js
 *
 * PostgreSQL connection pool.
 *
 * Uses DATABASE_URL so the same code works for:
 * - Local PostgreSQL
 * - Neon PostgreSQL
 * - Railway PostgreSQL
 * - Other PostgreSQL providers
 */

import pg from "pg";

const { Pool } = pg;

/*
 * DATABASE_URL is the single source of truth.
 *
 * Local example:
 * postgresql://postgres:password@localhost:5432/portfolio_db
 *
 * Production example:
 * postgresql://user:password@host/database
 */

console.log(
  "DATABASE_URL exists:",
  Boolean(process.env.DATABASE_URL)
);

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not configured.");
}


/*
 * PostgreSQL connection pool.
 *
 * A pool reuses database connections instead of creating
 * a new connection for every API request.
 */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,

  /*
   * Production PostgreSQL providers generally require SSL.
   *
   * Local PostgreSQL does not need SSL.
   */
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,

  max: 10,

  idleTimeoutMillis: 30_000,

  connectionTimeoutMillis: 5_000,
});

/**
 * Test PostgreSQL connectivity.
 */
export async function testConnection() {
  try {
    const result = await pool.query("SELECT NOW() AS current_time");

    console.log("✅ PostgreSQL connected successfully");
    console.log(
      `   Database time: ${result.rows[0].current_time}`
    );

    return true;
  } catch (error) {
    console.error(
      "❌ PostgreSQL connection failed:",
      error.message
    );

    return false;
  }
}

/**
 * Export the pool for controllers/services.
 */
export default pool;