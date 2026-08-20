// Projects.jsx - Premium Filterable Grid with API Fail-Safe & Glass Modal
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faArrowRight, faArrowUpRightFromSquare, faChartBar, faImage, faLock, faXmark } from "@fortawesome/free-solid-svg-icons";

// Import local fallback data
import { projects as localProjects, projectCategories } from "../data/projects";

const SECTION_CONFIG = {
  label: "Projects",
  heading: "Selected work,",
  headingAccent: "built with purpose.",
  subtext: "Web applications, data pipelines and automation systems. Open any project for the full case study.",
  emptyState: "No projects in this category yet.",
};

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Normalizes BOTH backend (PostgreSQL) and frontend (Local) project structures
function normalizeProject(project) {
  return {
    id: project.id,
    title: project.title,
    summary: project.summary || project.description || "",
    tech: Array.isArray(project.tech) ? project.tech : (project.tech_stack ? project.tech_stack.split(",").map(t => t.trim()).filter(Boolean) : []),
    thumbnail: project.thumbnail || project.image_url || null,
    github_url: project.github_url || null,
    live_url: project.live_url || null,
    category: project.category || "other",
    featured: Boolean(project.featured),
    display_order: project.display_order ?? 0,
    objective: project.objective || "",
    problem: project.problem || "",
    solution: project.solution || "",
    is_confidential: Boolean(project.is_confidential),
    powerbi_url: project.powerbi_url || null,
    website_url: project.website_url || null,
  };
}

const getCategoryLabel = (id) => projectCategories.find((c) => c.id === id)?.label ?? "Project";
const getProjectNumber = (i) => String(i + 1).padStart(2, "0");
const fadeUp = (delay = 0) => ({ initial: { opacity: 0, y: 16 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-60px" }, transition: { duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] } });

// Fallback Image Component
function ProjectImage({ project, className = "" }) {
  const [hasError, setHasError] = useState(false);
  useEffect(() => { setHasError(false); }, [project.thumbnail]);

  if (!project.thumbnail || hasError) {
    return (
      <div className={`flex h-full w-full items-center justify-center bg-[color-mix(in_srgb,var(--accent)_5%,transparent)] ${className}`}>
        <div className="flex flex-col items-center gap-2 text-center text-[var(--accent)]">
          <FontAwesomeIcon icon={faImage} className="h-6 w-6" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)]">Preview</span>
        </div>
      </div>
    );
  }
  return <img src={project.thumbnail} alt={project.title} loading="lazy" onError={() => setHasError(true)} className={`h-full w-full object-cover ${className}`} />;
}

// Sleek Apple-style Project Card
function ProjectCard({ project, index, onOpen }) {
  const category = getCategoryLabel(project.category);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.06, 0.18) }}
      onClick={() => onOpen(project)}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onOpen(project); } }}
      role="button" tabIndex={0} aria-label={`View details for ${project.title}`}
      className="glass-card group relative flex h-full cursor-pointer flex-col overflow-hidden p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-[color-mix(in_srgb,var(--accent)_5%,transparent)] transform-gpu">
        <div className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.03]">
          <ProjectImage project={project} />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        
        <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/40 px-3 py-1.5 font-mono text-[9px] font-medium uppercase tracking-widest text-white backdrop-blur-md">
          {category}
        </span>
        {project.featured && (
          <span className="absolute right-4 top-4 rounded-full bg-[var(--accent)] px-3 py-1.5 font-mono text-[9px] font-semibold uppercase tracking-widest text-white shadow-[0_2px_8px_color-mix(in_srgb,var(--accent)_40%,transparent)]">
            Featured
          </span>
        )}
        {project.is_confidential && (
          <span className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full border border-white/20 bg-black/60 px-3 py-1.5 font-mono text-[9px] text-white backdrop-blur-md">
            <FontAwesomeIcon icon={faLock} className="h-2.5 w-2.5" /> Internal
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-4">
          <div className="mb-2 flex items-center gap-2">
            <span className="font-mono text-[10px] font-semibold tracking-widest text-[var(--accent)]">{getProjectNumber(index)}</span>
            <span className="h-px w-5 bg-[color-mix(in_srgb,var(--accent)_30%,transparent)]" />
          </div>
          <h3 className="text-[1.15rem] font-bold leading-tight tracking-tight text-[var(--text-primary)] transition-colors duration-200 group-hover:text-[var(--accent)]">
            {project.title}
          </h3>
          <p className="mt-2 line-clamp-3 text-[13px] leading-relaxed text-[var(--text-secondary)]">{project.summary}</p>
        </div>

        {project.tech?.length > 0 && (
          <div className="mb-5 flex flex-wrap gap-1.5">
            {project.tech.slice(0, 4).map((tech) => (
              <span key={tech} className="rounded-md bg-[color-mix(in_srgb,var(--accent)_8%,transparent)] px-2 py-1 font-mono text-[9px] font-medium text-[var(--accent)]">
                {tech}
              </span>
            ))}
            {project.tech.length > 4 && (
              <span className="rounded-md border border-[var(--border)] px-2 py-1 font-mono text-[9px] text-[var(--text-muted)]">
                +{project.tech.length - 4}
              </span>
            )}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between border-t border-[var(--border)] pt-4">
          <span className="font-mono text-[9px] uppercase tracking-widest text-[var(--text-muted)]">Case study</span>
          <span className="flex items-center gap-1.5 text-xs font-semibold text-[var(--accent)]">
            View project <FontAwesomeIcon icon={faArrowRight} className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </motion.article>
  );
}

// Premium Glass Modal (Tier 4)
function ProjectModal({ project, onClose }) {
  const category = getCategoryLabel(project.category);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleEsc = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleEsc);
    return () => { document.body.style.overflow = prev; document.removeEventListener("keydown", handleEsc); };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-md sm:p-6"
      role="dialog" aria-modal="true" aria-labelledby="modal-title"
    >
      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.97 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="glass-modal relative my-auto w-full max-w-4xl overflow-hidden p-0 shadow-2xl"
      >
        <button
          onClick={onClose} aria-label="Close modal"
          className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-md transition-colors hover:bg-black/80"
        >
          <FontAwesomeIcon icon={faXmark} className="h-4 w-4" />
        </button>

        <div className="relative aspect-[21/9] w-full max-h-[360px] overflow-hidden bg-[color-mix(in_srgb,var(--accent)_5%,transparent)]">
          <ProjectImage project={project} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <div className="absolute bottom-5 left-5 flex flex-wrap gap-2 sm:bottom-6 sm:left-8">
            <span className="rounded-full border border-white/20 bg-black/40 px-3 py-1.5 font-mono text-[9px] uppercase tracking-widest text-white backdrop-blur-md">{category}</span>
            {project.featured && <span className="rounded-full bg-[var(--accent)] px-3 py-1.5 font-mono text-[9px] uppercase tracking-widest text-white">Featured</span>}
          </div>
        </div>

        <div className="max-h-[65vh] overflow-y-auto p-6 sm:p-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.5fr_0.5fr]">
            <div>
              <h2 id="modal-title" className="mb-4 text-3xl font-bold tracking-tight text-[var(--text-primary)]">{project.title}</h2>
              <p className="mb-8 text-[15px] leading-relaxed text-[var(--text-secondary)]">{project.summary}</p>
              
              <div className="space-y-6">
                {[{ key: "objective", label: "Objective", val: project.objective }, { key: "problem", label: "Problem", val: project.problem }, { key: "solution", label: "Solution", val: project.solution }].filter(s => s.val).map((sec) => (
                  <div key={sec.key}>
                    <p className="mb-1.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-[var(--accent)]">{sec.label}</p>
                    <p className="text-[14px] leading-relaxed text-[var(--text-secondary)]">{sec.val}</p>
                  </div>
                ))}
              </div>
            </div>

            <aside>
              <div className="rounded-2xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--surface-solid)_40%,transparent)] p-5">
                <p className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-widest text-[var(--accent)]">Tech Stack</p>
                <div className="flex flex-wrap gap-1.5">
                  {project.tech?.map((tech) => (
                    <span key={tech} className="rounded-md border border-[var(--border)] bg-[color-mix(in_srgb,var(--surface-solid)_50%,transparent)] px-2 py-1 font-mono text-[10px] text-[var(--text-secondary)]">{tech}</span>
                  ))}
                </div>
              </div>
            </aside>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-[var(--border)] pt-6">
            {project.is_confidential ? (
              <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)]"><FontAwesomeIcon icon={faLock} /> Source confidential</span>
            ) : (
              <>
                {project.github_url && <a href={project.github_url} target="_blank" rel="noreferrer" className="btn-secondary"><FontAwesomeIcon icon={faGithub} /> GitHub</a>}
                {project.powerbi_url && <a href={project.powerbi_url} target="_blank" rel="noreferrer" className="btn-secondary"><FontAwesomeIcon icon={faChartBar} /> Dashboard</a>}
                {(project.live_url || project.website_url) && <a href={project.live_url || project.website_url} target="_blank" rel="noreferrer" className="btn-primary">Live Demo <FontAwesomeIcon icon={faArrowUpRightFromSquare} /></a>}
              </>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Main Projects Section
export default function Projects() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedProject, setSelectedProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // The Bulletproof API Fail-Safe
  useEffect(() => {
    let isMounted = true;
    async function fetchProjects() {
      setIsLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/api/projects`);
        if (!res.ok) throw new Error("API Unavailable");
        const data = await res.json();
        if (data.success && isMounted) setProjects(data.data.map(normalizeProject));
        else throw new Error("Invalid API Data");
      } catch (err) {
        console.warn("Backend unavailable, using premium local fallback data:", err.message);
        if (isMounted) setProjects(localProjects.map(normalizeProject));
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    fetchProjects();
    return () => { isMounted = false; };
  }, []);

  const filteredProjects = useMemo(() => activeCategory === "all" ? projects : projects.filter(p => p.category === activeCategory), [projects, activeCategory]);
  const activeCategories = useMemo(() => projectCategories.filter(cat => cat.id === "all" || projects.some(p => p.category === cat.id)), [projects]);

  return (
    <section id="projects" className="relative px-6 py-20 md:px-12 md:py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div {...fadeUp(0)} className="mb-10">
          <div className="mb-4 flex items-center gap-3">
            <span className="block h-px w-7 bg-[var(--accent)]" />
            <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[var(--accent)]">{SECTION_CONFIG.label}</span>
          </div>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <h2 className="text-4xl font-bold tracking-tight text-[var(--text-primary)] md:text-5xl">
              {SECTION_CONFIG.heading} <span className="text-[var(--accent)]">{SECTION_CONFIG.headingAccent}</span>
            </h2>
            <p className="max-w-sm text-[14px] leading-relaxed text-[var(--text-secondary)] md:text-right">{SECTION_CONFIG.subtext}</p>
          </div>
        </motion.div>

        {/* Apple iOS Style Segmented Control for Categories */}
        <motion.div {...fadeUp(0.08)} className="mb-8 flex flex-wrap gap-2" role="tablist">
          {activeCategories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id} role="tab" aria-selected={isActive} onClick={() => setActiveCategory(cat.id)}
                className="rounded-full px-4 py-2.5 font-mono text-[10px] font-semibold uppercase tracking-wider transition-all duration-300"
                style={{
                  background: isActive ? "var(--text-primary)" : "color-mix(in srgb, var(--surface-solid) 40%, transparent)",
                  color: isActive ? "var(--page-bg)" : "var(--text-secondary)",
                  border: `1px solid ${isActive ? "transparent" : "var(--border)"}`
                }}
              >
                {cat.label}
              </button>
            );
          })}
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => <div key={i} className="glass-card h-[400px] animate-pulse rounded-2xl" />)}
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((p, i) => <ProjectCard key={p.id} project={p} index={i} onOpen={setSelectedProject} />)}
            </AnimatePresence>
          </motion.div>
        )}

        {!isLoading && filteredProjects.length === 0 && (
          <div className="glass-card mt-8 p-10 text-center text-sm text-[var(--text-secondary)]">{SECTION_CONFIG.emptyState}</div>
        )}
      </div>

      <AnimatePresence>
        {selectedProject && <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />}
      </AnimatePresence>
    </section>
  );
}