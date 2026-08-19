/**
 * adminController.js
 * Handles administrator authentication (Login and Logout).
 * Generates secure JWT tokens and stores them in HttpOnly cookies.
 */
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

function getRequiredEnvironmentVariable(name) {
  const value = process.env[name];
  if (typeof value !== "string" || value.trim() === "") throw new Error(`${name} is not configured.`);
  return value;
}

/**
 * POST /api/admin/login
 * Validates credentials against environment variables and issues a JWT.
 */
export async function loginAdmin(req, res) {
  try {
    const { username, password } = req.body || {};
    if (typeof username !== "string" || typeof password !== "string" || username.trim() === "" || password.length === 0) {
      return res.status(400).json({ success: false, message: "Username and password are required." });
    }

    const adminUsername = getRequiredEnvironmentVariable("ADMIN_USERNAME");
    const passwordHash = getRequiredEnvironmentVariable("ADMIN_PASSWORD_HASH");
    const jwtSecret = getRequiredEnvironmentVariable("JWT_SECRET");

    if (username.trim() !== adminUsername || !(await bcrypt.compare(password, passwordHash))) {
      return res.status(401).json({ success: false, message: "Invalid credentials." });
    }

    const token = jwt.sign({ username: adminUsername, role: "admin" }, jwtSecret, {
      expiresIn: "2h",
      issuer: "skand-portfolio-api",
      audience: "skand-portfolio-admin",
    });

    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("admin_token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 2 * 60 * 60 * 1000,
      path: "/",
    });

    return res.status(200).json({ success: true, message: "Admin login successful.", admin: { username: adminUsername, role: "admin" } });
  } catch (error) {
    console.error("❌ Admin login error:", error.message);
    return res.status(500).json({ success: false, message: "Unable to process login request." });
  }
}

/**
 * POST /api/admin/logout
 * Clears the HttpOnly authentication cookie from the browser.
 */
export function logoutAdmin(req, res) {
  try {
    const isProduction = process.env.NODE_ENV === "production";
    res.clearCookie("admin_token", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      path: "/",
    });
    return res.status(200).json({ success: true, message: "Admin logged out successfully." });
  } catch (error) {
    console.error("❌ Admin logout error:", error.message);
    return res.status(500).json({ success: false, message: "Unable to log out. Please try again." });
  }
}