/**
 * db.js
 * PostgreSQL connection pool configuration.
 * Uses DATABASE_URL to support Local, Neon, Railway, or other cloud providers.
 */
import pg from "pg";

const { Pool } = pg;

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not configured.");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

/**
 * testConnection()
 * Tests PostgreSQL connectivity and logs the current database time.
 */
export async function testConnection() {
  try {
    const result = await pool.query("SELECT NOW() AS current_time");
    console.log(`✅ PostgreSQL connected successfully (Time: ${result.rows[0].current_time})`);
    return true;
  } catch (error) {
    console.error("❌ PostgreSQL connection failed:", error.message);
    return false;
  }
}

export default pool;