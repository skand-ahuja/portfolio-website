// AdminDashboard.jsx - Native Theme Synced Dashboard
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket, faBriefcase, faCircleCheck, faDatabase, faPlus, faSpinner, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { showSuccess, showError, confirmDelete, confirmLogout } from "../utils/alerts";
import AdminProjectForm from "../components/AdminProjectForm";
import AdminProjectTable from "../components/AdminProjectTable";
import { getAdminProjects, deleteProject, logoutAdmin } from "../services/adminApi";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  async function loadProjects() {
    setIsLoading(true); setError("");
    try {
      const response = await getAdminProjects();
      setProjects(response.data || []);
    } catch (err) {
      console.error("Failed to load admin projects:", err);
      setError(err.message || "Unable to load projects.");
      if (err.message?.includes("Authentication") || err.message?.includes("expired") || err.message?.includes("Invalid")) {
        localStorage.removeItem("admin_user");
        navigate("/admin", { replace: true });
      }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => { loadProjects(); }, []);

  const handleAddProject = () => { setEditingProject(null); setShowProjectForm(true); };
  const handleEditProject = (project) => { setEditingProject(project); setShowProjectForm(true); };
  const handleCancelForm = () => { setShowProjectForm(false); setEditingProject(null); };

  const handleFormSuccess = async (action = "saved") => {
    setShowProjectForm(false); setEditingProject(null);
    await loadProjects();
    if (action === "created") await showSuccess("Project created", "The project has been added to your portfolio.");
    if (action === "updated") await showSuccess("Project updated", "The project has been updated successfully.");
  };

  const handleDeleteProject = async (project) => {
    const result = await confirmDelete(project.title);
    if (!result.isConfirmed) return;
    try {
      setDeletingId(project.id); setError("");
      await deleteProject(project.id);
      setProjects(curr => curr.filter(item => item.id !== project.id));
      await showSuccess("Project deleted", `"${project.title}" has been permanently removed.`);
    } catch (err) {
      setError(err.message || "Could not delete project.");
      await showError("Delete failed", err.message || "The project could not be deleted.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleLogout = async () => {
    const result = await confirmLogout();
    if (!result.isConfirmed) return;
    try {
      await logoutAdmin();
      localStorage.removeItem("admin_user");

      await showSuccess("Logged out", "Your admin session has been securely closed. Redirecting...", 5000);
      
      navigate("/admin", { replace: true });
    } catch (err) {
      await showError("Logout failed", "Unable to end the admin session.");
    }
  };

  let adminUser = null;
  try { adminUser = JSON.parse(localStorage.getItem("admin_user") || "null"); } catch { adminUser = null; }

  return (
    <main data-theme="dark" className="min-h-[100svh] bg-black px-4 py-8 sm:px-6 lg:px-8 text-white font-sans">
      <div className="mx-auto w-full max-w-7xl">
        
        <header className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between border-b border-white/10 pb-6">
          <div>
            <p className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-widest text-[var(--accent)]">Control Center</p>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Admin Dashboard</h1>
            <p className="mt-2 text-[14px] text-[var(--text-secondary)]">Welcome back, <strong className="text-[var(--text-primary)]">{adminUser?.username || "Admin"}</strong>.</p>
          </div>
          <button type="button" onClick={handleLogout} className="btn-secondary h-10">
            <FontAwesomeIcon icon={faArrowRightFromBracket} className="h-3.5 w-3.5" /> Logout
          </button>
        </header>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard icon={faBriefcase} label="Total Projects" value={projects.length} />
          <StatCard icon={faCircleCheck} label="Featured" value={projects.filter(p => p.featured).length} />
          <StatCard icon={faDatabase} label="Database" value="Connected" />
        </div>

        <section aria-labelledby="projects-heading" className="glass-card rounded-[1.5rem] p-6 sm:p-8">
          {showProjectForm && <div className="mb-8"><AdminProjectForm project={editingProject} onCancel={handleCancelForm} onSuccess={handleFormSuccess} /></div>}

          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 id="projects-heading" className="text-xl font-bold tracking-tight">Projects</h2>
              <p className="mt-1 text-[13px] text-[var(--text-secondary)]">Manage the projects displayed on your portfolio.</p>
            </div>
            <button type="button" onClick={handleAddProject} className="btn-primary h-10"><FontAwesomeIcon icon={faPlus} className="h-3.5 w-3.5" /> Add Project</button>
          </div>

          {isLoading && (
            <div className="flex min-h-[200px] flex-col items-center justify-center gap-3" role="status">
              <FontAwesomeIcon icon={faSpinner} spin className="h-6 w-6 text-[var(--accent)]" />
              <span className="text-[13px] text-[var(--text-secondary)]">Loading projects...</span>
            </div>
          )}

          {!isLoading && error && (
            <div className="mb-5 rounded-2xl border border-[var(--color-error)]/20 bg-[color-mix(in_srgb,var(--color-error)_10%,transparent)] p-5" role="alert">
              <div className="flex gap-3">
                <FontAwesomeIcon icon={faTriangleExclamation} className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-error)]" />
                <div>
                  <p className="text-[14px] font-semibold text-[var(--color-error)]">Something went wrong</p>
                  <p className="mt-1 text-[13px] text-[var(--text-secondary)]">{error}</p>
                </div>
              </div>
              <button type="button" onClick={loadProjects} className="btn-secondary h-8 mt-4 px-4 py-0 text-xs">Try again</button>
            </div>
          )}

          {!isLoading && !error && <AdminProjectTable projects={projects} onEdit={handleEditProject} onDelete={handleDeleteProject} deletingId={deletingId} />}
        </section>
      </div>
    </main>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="glass-card rounded-[1.25rem] p-5">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] text-[var(--accent)]">
          <FontAwesomeIcon icon={icon} className="h-5 w-5" />
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)]">{label}</p>
          <p className="mt-1 text-2xl font-bold tracking-tight text-[var(--text-primary)]">{value}</p>
        </div>
      </div>
    </div>
  );
}