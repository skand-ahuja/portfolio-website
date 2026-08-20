// AdminProjectForm.jsx - Premium Admin Form UI
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk, faXmark } from "@fortawesome/free-solid-svg-icons";
import { createProject, updateProject } from "../services/adminApi";
import { showError } from "../utils/alerts";

const EMPTY_FORM = { title: "", description: "", github_url: "", live_url: "", tech_stack: "", image_url: "", category: "web_app", featured: false, display_order: 0 };

export default function AdminProjectForm({ project = null, onSuccess, onCancel }) {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (project) setFormData({ title: project.title || "", description: project.description || "", github_url: project.github_url || "", live_url: project.live_url || "", tech_stack: project.tech_stack || "", image_url: project.image_url || "", category: project.category || "web_app", featured: Boolean(project.featured), display_order: project.display_order ?? 0 });
    else setFormData({ ...EMPTY_FORM });
    setError("");
  }, [project]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    if (error) setError("");
  };

  const isValidUrl = (val) => {
    if (!val.trim()) return true;
    try { const url = new URL(val.trim()); return url.protocol === "http:" || url.protocol === "https:"; } 
    catch { return false; }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError("");
    if (!formData.title.trim()) return setError("Project title is required.");
    if (!formData.description.trim()) return setError("Project description is required.");
    if (!formData.tech_stack.trim()) return setError("Please enter the technology stack.");

    for (const item of [{ l: "GitHub", v: formData.github_url }, { l: "Live", v: formData.live_url }, { l: "Image", v: formData.image_url }]) {
      if (!isValidUrl(item.v)) return setError(`${item.l} URL must be valid HTTP/HTTPS.`);
    }

    setIsSaving(true);
    try {
      const payload = { ...formData, title: formData.title.trim(), description: formData.description.trim(), tech_stack: formData.tech_stack.trim(), display_order: Number(formData.display_order) || 0 };
      if (!project) { await createProject(payload); if (onSuccess) await onSuccess("created"); } 
      else { await updateProject(project.id, payload); if (onSuccess) await onSuccess("updated"); }
    } catch (err) {
      console.error("Save failed:", err);
      const msg = err.message || "Unable to save project.";
      setError(msg); await showError("Unable to save project", msg);
    } finally { setIsSaving(false); }
  };

  return (
    <section className="glass-card rounded-[1.5rem] p-6 sm:p-8" aria-labelledby="form-title">
      <div className="mb-6 flex items-start justify-between gap-4 border-b border-[var(--border)] pb-4">
        <div>
          <p className="mb-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-[var(--accent)]">Project Management</p>
          <h2 id="form-title" className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">{project ? "Edit Project" : "Add Project"}</h2>
        </div>
        {onCancel && (
          <button type="button" onClick={onCancel} disabled={isSaving} className="flex h-8 w-8 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--text-primary)_10%,transparent)] text-[var(--text-secondary)] transition-colors hover:bg-[color-mix(in_srgb,var(--text-primary)_20%,transparent)] hover:text-[var(--text-primary)] disabled:opacity-50">
            <FontAwesomeIcon icon={faXmark} className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {error && <div className="mb-5 rounded-xl border border-[var(--color-error)]/30 bg-[color-mix(in_srgb,var(--color-error)_10%,transparent)] p-4 text-[13px] font-medium text-[var(--color-error)]" role="alert">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <FormField label="Project title" name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Portfolio Website" required disabled={isSaving} />
        <div>
          <label className="mb-1.5 block font-mono text-[10px] font-semibold uppercase tracking-widest text-[var(--text-secondary)]">Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="form-control resize-y" required disabled={isSaving} />
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <FormField label="GitHub URL" name="github_url" type="url" value={formData.github_url} onChange={handleChange} placeholder="https://github.com/..." disabled={isSaving} />
          <FormField label="Live URL" name="live_url" type="url" value={formData.live_url} onChange={handleChange} placeholder="https://example.com" disabled={isSaving} />
        </div>

        <div>
          <FormField label="Tech stack" name="tech_stack" value={formData.tech_stack} onChange={handleChange} placeholder="React, Node.js, PostgreSQL" required disabled={isSaving} />
          <p className="mt-1.5 text-[11px] text-[var(--text-muted)]">Separate technologies with commas.</p>
        </div>

        <FormField label="Image URL" name="image_url" type="url" value={formData.image_url} onChange={handleChange} placeholder="https://..." disabled={isSaving} />

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block font-mono text-[10px] font-semibold uppercase tracking-widest text-[var(--text-secondary)]">Category</label>
            <select name="category" value={formData.category} onChange={handleChange} disabled={isSaving} className="form-control appearance-none">
              <option value="web_app">Web App</option><option value="automation">Automation</option><option value="data_dashboard">Data Dashboard</option><option value="other">Other</option>
            </select>
          </div>
          <FormField label="Display order" name="display_order" type="number" value={formData.display_order} onChange={handleChange} min="0" disabled={isSaving} />
        </div>

        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--surface-solid)_40%,transparent)] p-4 transition-colors hover:border-[var(--accent)]">
          <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} disabled={isSaving} className="h-4 w-4 accent-[var(--accent)]" />
          <span>
            <span className="block text-[13.5px] font-semibold text-[var(--text-primary)]">Featured project</span>
            <span className="mt-0.5 block text-[11.5px] text-[var(--text-secondary)]">Display this project as a highlighted item.</span>
          </span>
        </label>

        <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:justify-end border-t border-[var(--border)]">
          {onCancel && <button type="button" onClick={onCancel} disabled={isSaving} className="btn-secondary">Cancel</button>}
          <button type="submit" disabled={isSaving} className="btn-primary"><FontAwesomeIcon icon={faFloppyDisk} className="h-3.5 w-3.5" /> {isSaving ? "Saving..." : project ? "Update Project" : "Save Project"}</button>
        </div>
      </form>
    </section>
  );
}

function FormField({ label, name, type = "text", value, onChange, placeholder, required = false, disabled = false, min }) {
  return (
    <div>
      <label className="mb-1.5 block font-mono text-[10px] font-semibold uppercase tracking-widest text-[var(--text-secondary)]">{label}</label>
      <input name={name} type={type} value={value} onChange={onChange} placeholder={placeholder} required={required} disabled={disabled} min={min} className="form-control" />
    </div>
  );
}