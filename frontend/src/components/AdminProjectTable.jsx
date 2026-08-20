// AdminProjectTable.jsx - Premium Admin Data Grid
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash, faStar, faCodeBranch, faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";

export default function AdminProjectTable({ projects = [], onEdit, onDelete, deletingId = null }) {
  if (projects.length === 0) {
    return (
      <div className="glass-card flex flex-col items-center justify-center rounded-[1.5rem] p-12 text-center">
        <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] text-[var(--accent)]"><FontAwesomeIcon icon={faCodeBranch} className="h-6 w-6" /></span>
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">No projects yet</h3>
        <p className="mt-2 max-w-sm text-[13.5px] text-[var(--text-secondary)]">Your portfolio does not have any projects yet. Add your first project from the dashboard.</p>
      </div>
    );
  }

  return (
    <div className="glass-card overflow-hidden rounded-[1.5rem] p-0">
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--surface-solid)_40%,transparent)]">
              {["Project", "Category", "Tech Stack", "Status", "Actions"].map((h, i) => (
                <th key={h} className={`px-5 py-4 font-mono text-[9px] font-semibold uppercase tracking-widest text-[var(--text-muted)] ${i === 4 ? "text-right" : ""}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {projects.map((p) => <ProjectRow key={p.id} project={p} onEdit={onEdit} onDelete={onDelete} deletingId={deletingId} />)}
          </tbody>
        </table>
      </div>
      <div className="divide-y divide-[var(--border)] md:hidden">
        {projects.map((p) => <ProjectMobileCard key={p.id} project={p} onEdit={onEdit} onDelete={onDelete} deletingId={deletingId} />)}
      </div>
    </div>
  );
}

function ProjectRow({ project, onEdit, onDelete, deletingId }) {
  const techStack = Array.isArray(project.tech_stack) ? project.tech_stack : (typeof project.tech_stack === "string" ? project.tech_stack.split(",").map(i => i.trim()).filter(Boolean) : []);

  return (
    <tr className="transition-colors hover:bg-[color-mix(in_srgb,var(--surface-solid)_30%,transparent)]">
      <td className="px-5 py-4">
        <div className="flex min-w-[240px] items-center gap-4">
          <ProjectThumbnail project={project} />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="truncate text-[14px] font-semibold text-[var(--text-primary)]">{project.title}</h3>
              {project.featured && <FontAwesomeIcon icon={faStar} className="h-3 w-3 text-[var(--accent)]" title="Featured" />}
            </div>
            <p className="mt-1 max-w-xs truncate text-[12px] text-[var(--text-secondary)]">{project.description}</p>
          </div>
        </div>
      </td>
      <td className="px-5 py-4"><CategoryBadge category={project.category} /></td>
      <td className="px-5 py-4">
        <div className="flex max-w-xs flex-wrap gap-1.5">
          {techStack.slice(0, 3).map((tech) => <span key={tech} className="rounded border border-[var(--border)] bg-[color-mix(in_srgb,var(--surface-solid)_50%,transparent)] px-2 py-0.5 font-mono text-[9px] text-[var(--text-secondary)]">{tech}</span>)}
          {techStack.length > 3 && <span className="text-[10px] text-[var(--text-muted)]">+{techStack.length - 3}</span>}
        </div>
      </td>
      <td className="px-5 py-4">
        {project.featured ? <span className="inline-flex items-center gap-1.5 rounded-full bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-widest text-[var(--accent)]"><FontAwesomeIcon icon={faStar} className="h-2.5 w-2.5" /> Featured</span> : <span className="inline-flex rounded-full border border-[var(--border)] px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest text-[var(--text-muted)]">Standard</span>}
      </td>
      <td className="px-5 py-4 text-right"><ActionButtons project={project} onEdit={onEdit} onDelete={onDelete} deletingId={deletingId} /></td>
    </tr>
  );
}

function ProjectMobileCard({ project, onEdit, onDelete, deletingId }) {
  return (
    <article className="p-5">
      <div className="flex gap-4">
        <ProjectThumbnail project={project} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-[14px] font-semibold text-[var(--text-primary)]">{project.title}</h3>
            {project.featured && <FontAwesomeIcon icon={faStar} className="h-3 w-3 text-[var(--accent)]" />}
          </div>
          <p className="mt-1 line-clamp-2 text-[12px] text-[var(--text-secondary)]">{project.description}</p>
          <div className="mt-3"><CategoryBadge category={project.category} /></div>
        </div>
      </div>
      <div className="mt-4 pt-2"><ActionButtons project={project} onEdit={onEdit} onDelete={onDelete} deletingId={deletingId} fullWidth /></div>
    </article>
  );
}

function ActionButtons({ project, onEdit, onDelete, deletingId, fullWidth = false }) {
  const isDeleting = deletingId === project.id;
  const btnClass = "inline-flex h-8 items-center justify-center gap-2 rounded-lg border border-[var(--border)] bg-[color-mix(in_srgb,var(--surface-solid)_40%,transparent)] px-3 text-[11px] font-semibold transition-all hover:bg-[color-mix(in_srgb,var(--surface-solid)_80%,transparent)] focus-visible:ring-2 disabled:opacity-50";

  return (
    <div className={`flex items-center justify-end gap-2 ${fullWidth ? "w-full" : ""}`}>
      {project.live_url && <a href={project.live_url} target="_blank" rel="noreferrer" className={btnClass} style={{ color: "var(--text-primary)" }}><FontAwesomeIcon icon={faArrowUpRightFromSquare} /></a>}
      {project.github_url && <a href={project.github_url} target="_blank" rel="noreferrer" className={btnClass} style={{ color: "var(--text-primary)" }}><FontAwesomeIcon icon={faCodeBranch} /></a>}
      <button onClick={() => onEdit(project)} disabled={isDeleting} className={btnClass} style={{ color: "var(--accent)" }}><FontAwesomeIcon icon={faPen} /> Edit</button>
      <button onClick={() => onDelete(project)} disabled={isDeleting} className={btnClass} style={{ color: "var(--color-error)", borderColor: "color-mix(in srgb, var(--color-error) 20%, transparent)" }}><FontAwesomeIcon icon={faTrash} spin={isDeleting} /> {isDeleting ? "..." : "Delete"}</button>
    </div>
  );
}

function ProjectThumbnail({ project }) {
  if (project.image_url) return <img src={project.image_url} alt="" loading="lazy" className="h-14 w-20 shrink-0 rounded-lg border border-[var(--border)] object-cover" />;
  return <div className="flex h-14 w-20 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] bg-[color-mix(in_srgb,var(--accent)_5%,transparent)] text-[var(--accent)]"><FontAwesomeIcon icon={faCodeBranch} className="h-4 w-4" /></div>;
}

function CategoryBadge({ category }) {
  const labels = { web_app: "Web App", automation: "Automation", data_dashboard: "Data Dashboard", other: "Other" };
  return <span className="inline-flex rounded-full border border-[var(--border)] px-2 py-0.5 font-mono text-[9px] font-medium uppercase tracking-widest text-[var(--text-muted)]">{labels[category] || category}</span>;
}