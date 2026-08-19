/**
 * AdminDashboard.jsx
 *
 * Admin control center for managing portfolio projects.
 *
 * Features:
 * - HttpOnly-cookie authenticated dashboard
 * - Load projects from PostgreSQL
 * - Add project
 * - Edit project
 * - Permanently delete project
 * - SweetAlert2 confirmations and notifications
 * - Responsive project table
 * - Dark admin interface
 * - Logout confirmation
 * - Accessibility-friendly controls
 *
 * IMPORTANT:
 * - JWT is NOT accessed from localStorage.
 * - JWT is stored inside an HttpOnly cookie by the backend.
 * - Authentication is handled by adminApi.js + backend middleware.
 */

import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  FontAwesomeIcon,
} from "@fortawesome/react-fontawesome";

import {
  faArrowRightFromBracket,
  faBriefcase,
  faCircleCheck,
  faDatabase,
  faPlus,
  faSpinner,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";

/* ============================================================
   SWEETALERT HELPERS
   ============================================================ */

import {
  showSuccess,
  showError,
  confirmDelete,
  confirmLogout,
} from "../utils/alerts";

/* ============================================================
   ADMIN COMPONENTS
   ============================================================ */

import AdminProjectForm from "../components/AdminProjectForm";
import AdminProjectTable from "../components/AdminProjectTable";

/* ============================================================
   ADMIN API
   ============================================================ */

import {
  getAdminProjects,
  deleteProject,
  logoutAdmin,
} from "../services/adminApi";

/* ============================================================
   DARK ADMIN THEME
   ============================================================ */

/*
 * These CSS variables are defined on the dashboard root.
 *
 * Child components inherit them automatically.
 */
const darkAdminTheme = {
  "--page-bg": "#09090f",

  "--surface-solid": "#11111a",

  "--surface-elevated":
    "#181824",

  "--border":
    "rgba(255, 255, 255, 0.10)",

  "--text-primary":
    "#f4f4f5",

  "--text-secondary":
    "#a1a1aa",

  "--text-muted":
    "#71717a",

  "--accent":
    "#818cf8",

  "--shadow-card":
    "0 20px 60px rgba(0, 0, 0, 0.35)",
};

/* ============================================================
   ADMIN DASHBOARD
   ============================================================ */

export default function AdminDashboard() {
  const navigate =
    useNavigate();

  /* ==========================================================
     PROJECT STATE
     ========================================================== */

  const [
    projects,
    setProjects,
  ] = useState([]);

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  /* ==========================================================
     PROJECT FORM STATE
     ========================================================== */

  const [
    showProjectForm,
    setShowProjectForm,
  ] = useState(false);

  const [
    editingProject,
    setEditingProject,
  ] = useState(null);

  /* ==========================================================
     DELETE STATE
     ========================================================== */

  const [
    deletingId,
    setDeletingId,
  ] = useState(null);

  /* ==========================================================
     LOAD PROJECTS
     ========================================================== */

  async function loadProjects() {
    setIsLoading(true);
    setError("");

    try {
      /*
       * adminApi.js automatically sends the HttpOnly
       * authentication cookie using:
       *
       * credentials: "include"
       */
      const response =
        await getAdminProjects();

      setProjects(
        response.data || []
      );
    } catch (
      requestError
    ) {
      console.error(
        "Failed to load admin projects:",
        requestError
      );

      const message =
        requestError.message ||
        "Unable to load projects.";

      setError(message);

      /* ======================================================
         AUTHENTICATION FAILURE
         ====================================================== */

      /*
       * IMPORTANT:
       *
       * We do NOT remove admin_token from localStorage
       * because the JWT is no longer stored there.
       *
       * The HttpOnly cookie can only be cleared by the backend.
       *
       * For now, redirect the administrator to login when
       * authentication fails.
       */
      if (
        requestError.message?.includes(
          "Authentication"
        ) ||
        requestError.message?.includes(
          "expired"
        ) ||
        requestError.message?.includes(
          "Invalid"
        )
      ) {
        localStorage.removeItem(
          "admin_user"
        );

        navigate(
          "/admin",
          {
            replace: true,
          }
        );
      }
    } finally {
      setIsLoading(false);
    }
  }

  /* ==========================================================
     INITIAL LOAD
     ========================================================== */

  useEffect(() => {
    /*
     * IMPORTANT:
     *
     * There is NO token check here.
     *
     * The browser automatically sends the HttpOnly cookie.
     *
     * The backend decides whether the session is valid.
     */

    loadProjects();

    /*
     * React development mode may execute effects twice.
     *
     * This is safe because loadProjects() only performs
     * a GET request.
     */
  }, []);

  /* ==========================================================
     ADD PROJECT
     ========================================================== */

  function handleAddProject() {
    setEditingProject(null);
    setShowProjectForm(true);
  }

  /* ==========================================================
     EDIT PROJECT
     ========================================================== */

  function handleEditProject(
    project
  ) {
    setEditingProject(project);
    setShowProjectForm(true);
  }

  /* ==========================================================
     FORM SUCCESS
     ========================================================== */

  async function handleFormSuccess(
    action = "saved"
  ) {
    setShowProjectForm(false);
    setEditingProject(null);

    /*
     * Reload directly from PostgreSQL so the dashboard
     * always reflects the real database state.
     */
    await loadProjects();

    /* --------------------------------------------------------
       CREATE SUCCESS
       -------------------------------------------------------- */

    if (action === "created") {
      await showSuccess(
        "Project created",
        "The project has been added to your portfolio."
      );
    }

    /* --------------------------------------------------------
       UPDATE SUCCESS
       -------------------------------------------------------- */

    if (action === "updated") {
      await showSuccess(
        "Project updated",
        "The project has been updated successfully."
      );
    }
  }

  /* ==========================================================
     CANCEL FORM
     ========================================================== */

  function handleCancelForm() {
    setShowProjectForm(false);
    setEditingProject(null);
  }

  /* ==========================================================
     DELETE PROJECT
     ========================================================== */

  async function handleDeleteProject(
    project
  ) {
    /*
     * This is a REAL database deletion.
     *
     * It does NOT simply hide the project from the UI.
     */
    const result =
      await confirmDelete(
        project.title
      );

    /*
     * Administrator selected Cancel.
     */
    if (!result.isConfirmed) {
      return;
    }

    try {
      setDeletingId(project.id);
      setError("");

      /* ------------------------------------------------------
         DELETE REQUEST
         ------------------------------------------------------ */

      await deleteProject(
        project.id
      );

      /* ------------------------------------------------------
         UPDATE UI
         ------------------------------------------------------ */

      /*
       * Remove the deleted project from the current UI
       * immediately after successful backend deletion.
       */
      setProjects(
        (currentProjects) =>
          currentProjects.filter(
            (item) =>
              item.id !==
              project.id
          )
      );

      /* ------------------------------------------------------
         SUCCESS MESSAGE
         ------------------------------------------------------ */

      await showSuccess(
        "Project deleted",
        `"${project.title}" has been permanently removed.`
      );
    } catch (
      deleteError
    ) {
      console.error(
        "Failed to delete project:",
        deleteError
      );

      setError(
        deleteError.message ||
          "Could not delete project."
      );

      await showError(
        "Delete failed",
        deleteError.message ||
          "The project could not be deleted. Please try again."
      );
    } finally {
      setDeletingId(null);
    }
  }

  /* ==========================================================
     LOGOUT
     ========================================================== */

  async function handleLogout() {
  const result =
    await confirmLogout();

  if (!result.isConfirmed) {
    return;
  }

  try {
    await logoutAdmin();

    /*
     * admin_user only contains non-sensitive
     * information used by the UI.
     */
    localStorage.removeItem(
      "admin_user"
    );

    await showSuccess(
      "Logged out",
      "Your admin session has been securely closed."
    );

    navigate(
      "/admin",
      {
        replace: true,
      }
    );
  } catch (error) {
    console.error(
      "Logout failed:",
      error
    );

    await showError(
      "Logout failed",
      "Unable to end the admin session. Please try again."
    );
  }
}

  /* ==========================================================
     ADMIN USER
     ========================================================== */

  let adminUser = null;

  try {
    adminUser = JSON.parse(
      localStorage.getItem(
        "admin_user"
      ) || "null"
    );
  } catch {
    adminUser = null;
  }

  /* ==========================================================
     RENDER
     ========================================================== */

  return (
    <main
      className="
        min-h-[100svh]
        px-4
        py-6
        sm:px-6
        lg:px-8
      "
      style={{
        ...darkAdminTheme,

        background:
          "var(--page-bg)",

        color:
          "var(--text-primary)",
      }}
    >
      <div
        className="
          mx-auto
          w-full
          max-w-7xl
        "
      >
        {/* ==================================================
            HEADER
            ================================================== */}

        <header
          className="
            mb-8
            flex
            flex-col
            gap-5
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <div>
            <p
              className="
                mb-2
                font-mono
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.16em]
              "
              style={{
                color:
                  "var(--accent)",
              }}
            >
              Portfolio Control Center
            </p>

            <h1
              className="
                font-heading
                text-2xl
                font-bold
                tracking-tight
                sm:text-3xl
              "
            >
              Admin Dashboard
            </h1>

            <p
              className="
                mt-2
                text-sm
              "
              style={{
                color:
                  "var(--text-secondary)",
              }}
            >
              Welcome back,{" "}
              <strong
                style={{
                  color:
                    "var(--text-primary)",
                }}
              >
                {adminUser?.username ||
                  "Admin"}
              </strong>
              .
            </p>
          </div>

          {/* ==================================================
              LOGOUT
              ================================================== */}

          <button
            type="button"
            onClick={
              handleLogout
            }
            className="
              inline-flex
              h-11
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              px-4
              text-sm
              font-semibold
              transition-all
              duration-200
              hover:-translate-y-0.5
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-[var(--accent)]
            "
            style={{
              color:
                "var(--text-primary)",

              borderColor:
                "var(--border)",

              background:
                "var(--surface-solid)",
            }}
          >
            <FontAwesomeIcon
              icon={
                faArrowRightFromBracket
              }
              className="h-3.5 w-3.5"
              aria-hidden="true"
            />

            Logout
          </button>
        </header>

        {/* ==================================================
            STAT CARDS
            ================================================== */}

        <div
          className="
            mb-8
            grid
            grid-cols-1
            gap-4
            sm:grid-cols-3
          "
        >
          <StatCard
            icon={faBriefcase}
            label="Total Projects"
            value={
              projects.length
            }
          />

          <StatCard
            icon={faCircleCheck}
            label="Featured"
            value={
              projects.filter(
                (project) =>
                  project.featured
              ).length
            }
          />

          <StatCard
            icon={faDatabase}
            label="Database"
            value="Connected"
          />
        </div>

        {/* ==================================================
            PROJECT SECTION
            ================================================== */}

        <section
          aria-labelledby="projects-heading"
          className="
            rounded-3xl
            border
            p-5
            sm:p-6
          "
          style={{
            background:
              "var(--surface-solid)",

            borderColor:
              "var(--border)",

            boxShadow:
              "var(--shadow-card)",
          }}
        >
          {/* ==================================================
              PROJECT FORM
              ================================================== */}

          {showProjectForm && (
            <div className="mb-6">
              <AdminProjectForm
                project={
                  editingProject
                }
                onCancel={
                  handleCancelForm
                }
                onSuccess={
                  handleFormSuccess
                }
              />
            </div>
          )}

          {/* ==================================================
              SECTION HEADER
              ================================================== */}

          <div
            className="
              mb-6
              flex
              flex-col
              gap-4
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <div>
              <h2
                id="projects-heading"
                className="
                  font-heading
                  text-lg
                  font-bold
                  sm:text-xl
                "
              >
                Projects
              </h2>

              <p
                className="
                  mt-1
                  text-xs
                  sm:text-sm
                "
                style={{
                  color:
                    "var(--text-secondary)",
                }}
              >
                Manage the projects
                displayed on your
                portfolio.
              </p>
            </div>

            {/* Add Project */}

            <button
              type="button"
              onClick={
                handleAddProject
              }
              className="
                inline-flex
                h-11
                items-center
                justify-center
                gap-2
                rounded-xl
                px-4
                text-sm
                font-semibold
                text-white
                transition-all
                duration-200
                hover:-translate-y-0.5
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-[var(--accent)]
              "
              style={{
                background:
                  "var(--accent)",

                boxShadow:
                  "0 8px 24px rgba(129, 140, 248, 0.18)",
              }}
            >
              <FontAwesomeIcon
                icon={faPlus}
                className="h-3.5 w-3.5"
                aria-hidden="true"
              />

              Add Project
            </button>
          </div>

          {/* ==================================================
              LOADING
              ================================================== */}

          {isLoading && (
            <div
              className="
                flex
                min-h-40
                flex-col
                items-center
                justify-center
                gap-3
              "
              role="status"
              aria-live="polite"
            >
              <FontAwesomeIcon
                icon={faSpinner}
                spin
                className="h-5 w-5"
                style={{
                  color:
                    "var(--accent)",
                }}
                aria-hidden="true"
              />

              <span
                className="text-sm"
                style={{
                  color:
                    "var(--text-secondary)",
                }}
              >
                Loading projects...
              </span>
            </div>
          )}

          {/* ==================================================
              ERROR
              ================================================== */}

          {!isLoading &&
            error && (
              <div
                className="
                  mb-5
                  rounded-2xl
                  border
                  p-5
                "
                role="alert"
                style={{
                  background:
                    "rgba(239, 68, 68, 0.06)",

                  borderColor:
                    "rgba(239, 68, 68, 0.20)",
                }}
              >
                <div className="flex gap-3">
                  <FontAwesomeIcon
                    icon={
                      faTriangleExclamation
                    }
                    className="
                      mt-0.5
                      h-4
                      w-4
                      shrink-0
                    "
                    style={{
                      color:
                        "#ef4444",
                    }}
                    aria-hidden="true"
                  />

                  <div>
                    <p
                      className="
                        text-sm
                        font-semibold
                      "
                      style={{
                        color:
                          "#f87171",
                      }}
                    >
                      Something went wrong
                    </p>

                    <p
                      className="
                        mt-1
                        text-xs
                        leading-5
                      "
                      style={{
                        color:
                          "var(--text-secondary)",
                      }}
                    >
                      {error}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={
                    loadProjects
                  }
                  className="
                    mt-4
                    rounded-lg
                    border
                    px-3
                    py-2
                    text-xs
                    font-semibold
                    transition-colors
                    hover:bg-white/5
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-[var(--accent)]
                  "
                  style={{
                    borderColor:
                      "var(--border)",

                    color:
                      "var(--text-primary)",
                  }}
                >
                  Try again
                </button>
              </div>
            )}

          {/* ==================================================
              PROJECT TABLE
              ================================================== */}

          {!isLoading &&
            !error && (
              <AdminProjectTable
                projects={
                  projects
                }
                onEdit={
                  handleEditProject
                }
                onDelete={
                  handleDeleteProject
                }
                deletingId={
                  deletingId
                }
              />
            )}
        </section>
      </div>
    </main>
  );
}

/* ============================================================
   STAT CARD
   ============================================================ */

function StatCard({
  icon,
  label,
  value,
}) {
  return (
    <div
      className="
        rounded-2xl
        border
        p-5
      "
      style={{
        background:
          "var(--surface-solid)",

        borderColor:
          "var(--border)",
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-xl
          "
          style={{
            background:
              "rgba(129, 140, 248, 0.10)",

            color:
              "var(--accent)",
          }}
        >
          <FontAwesomeIcon
            icon={icon}
            className="h-4 w-4"
            aria-hidden="true"
          />
        </div>

        <div>
          <p
            className="text-xs"
            style={{
              color:
                "var(--text-muted)",
            }}
          >
            {label}
          </p>

          <p
            className="
              mt-1
              text-lg
              font-bold
            "
          >
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}