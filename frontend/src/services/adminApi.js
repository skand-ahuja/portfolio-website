// adminApi.js - Secure Admin API Client
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Core request handler ensuring cookies (JWT) are sent with every request
async function adminRequest(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      credentials: "include", // Crucial for HttpOnly admin_token cookie
      headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    });

    const contentType = response.headers.get("content-type");
    const data = contentType?.includes("application/json") ? await response.json() : {};

    if (response.status === 401) throw new Error(data.message || "Authentication required.");
    if (!response.ok) throw new Error(data.message || "Admin API request failed.");

    return data;
  } catch (error) {
    throw error;
  }
}

export const getAdminProjects = () => adminRequest("/api/admin/projects");
export const createProject = (project) => adminRequest("/api/admin/projects", { method: "POST", body: JSON.stringify(project) });
export const updateProject = (id, project) => adminRequest(`/api/admin/projects/${id}`, { method: "PUT", body: JSON.stringify(project) });
export const deleteProject = (id) => adminRequest(`/api/admin/projects/${id}`, { method: "DELETE" });
export const logoutAdmin = () => adminRequest("/api/admin/logout", { method: "POST" });