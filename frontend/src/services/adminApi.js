/**
 * adminApi.js
 *
 * API client for authenticated administrator operations.
 *
 * Authentication:
 * - JWT is stored in an HttpOnly cookie by the backend.
 * - JavaScript cannot read the JWT.
 * - The browser automatically sends the cookie.
 *
 * IMPORTANT:
 * We intentionally do NOT use localStorage for the JWT.
 */

/* ============================================================
   API BASE URL
   ============================================================ */

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

/* ============================================================
   COMMON ADMIN REQUEST
   ============================================================ */

/**
 * Sends an authenticated request to the admin API.
 *
 * Authentication is handled through the HttpOnly
 * "admin_token" cookie.
 *
 * credentials: "include" is REQUIRED so the browser
 * sends the authentication cookie with the request.
 */
async function adminRequest(
  endpoint,
  options = {}
) {
  try {
    const response = await fetch(
      `${API_BASE_URL}${endpoint}`,
      {
        ...options,

        /*
         * IMPORTANT:
         *
         * This tells the browser to include cookies
         * when communicating with the backend.
         */
        credentials: "include",

        headers: {
          /*
           * JSON content type is required for requests
           * containing a JSON body.
           */
          "Content-Type":
            "application/json",

          /*
           * Do NOT manually send:
           *
           * Authorization: Bearer JWT
           *
           * The JWT is now inside the HttpOnly cookie.
           */

          ...(options.headers || {}),
        },
      }
    );

    /* ========================================================
       PARSE RESPONSE
       ======================================================== */

    /*
     * Some endpoints may theoretically return an empty
     * response, so don't blindly assume JSON exists.
     */
    const contentType =
      response.headers.get(
        "content-type"
      );

    const data =
      contentType?.includes(
        "application/json"
      )
        ? await response.json()
        : {};

    /* ========================================================
       HANDLE AUTHENTICATION FAILURE
       ======================================================== */

    if (response.status === 401) {
      /*
       * The token may be:
       *
       * - Missing
       * - Expired
       * - Invalid
       * - Deleted
       *
       * We deliberately do NOT try to manipulate the
       * HttpOnly cookie from JavaScript.
       *
       * The backend owns that cookie.
       */
      throw new Error(
        data.message ||
          "Authentication required."
      );
    }

    /* ========================================================
       HANDLE OTHER API ERRORS
       ======================================================== */

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Admin API request failed."
      );
    }

    /* ========================================================
       SUCCESS
       ======================================================== */

    return data;
  } catch (error) {
    /*
     * Preserve the original error message so the dashboard
     * can display an appropriate message.
     */
    throw error;
  }
}

/* ============================================================
   GET PROJECTS
   ============================================================ */

/**
 * GET /api/admin/projects
 *
 * Returns all projects for the admin dashboard.
 */
export async function getAdminProjects() {
  return adminRequest(
    "/api/admin/projects"
  );
}

/* ============================================================
   CREATE PROJECT
   ============================================================ */

/**
 * POST /api/admin/projects
 *
 * Creates a new project.
 */
export async function createProject(
  project
) {
  return adminRequest(
    "/api/admin/projects",
    {
      method: "POST",

      body: JSON.stringify(
        project
      ),
    }
  );
}

/* ============================================================
   UPDATE PROJECT
   ============================================================ */

/**
 * PUT /api/admin/projects/:id
 *
 * Updates an existing project.
 */
export async function updateProject(
  id,
  project
) {
  return adminRequest(
    `/api/admin/projects/${id}`,
    {
      method: "PUT",

      body: JSON.stringify(
        project
      ),
    }
  );
}

/* ============================================================
   DELETE PROJECT
   ============================================================ */

/**
 * DELETE /api/admin/projects/:id
 *
 * Permanently deletes a project.
 */
export async function deleteProject(
  id
) {
  return adminRequest(
    `/api/admin/projects/${id}`,
    {
      method: "DELETE",
    }
  );
}


/* ============================================================
   LOGOUT
   ============================================================ */

/**
 * POST /api/admin/logout
 *
 * Clears the HttpOnly authentication cookie.
 */
export async function logoutAdmin() {
  return adminRequest(
    "/api/admin/logout",
    {
      method: "POST",
    }
  );
}