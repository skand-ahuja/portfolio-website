/**
 * Projects.jsx
 *
 * Filterable project grid with expandable case study modal.
 *
 * FUTURE-PROOFING GUIDE:
 * ──────────────────────
 * 1. To ADD a project    → add object to data/projects.js `projects` array
 * 2. To ADD a category   → add to data/projects.js `projectCategories` array
 * 3. To CHANGE heading   → edit SECTION_CONFIG below
 * 4. Modal uses glass-modal class (Tier 4 from index.css)
 * 5. Cards use glass-card class (Tier 2 from index.css)
 *
 * Fixes applied:
 * 1. hover:border-accent/30 → onMouseEnter/Leave with CSS vars
 * 2. hover:bg-accent-hover → onMouseEnter/Leave (class doesn't exist)
 * 3. text-primary/secondary/muted/accent → inline CSS var styles
 * 4. bg-accent/5, bg-accent/[0.08] → color-mix()
 * 5. border-current/10, bg-current/[0.025] → CSS var tokens
 * 6. glass-card + rounded-[28px] conflict → glass-modal class
 * 7. focus-visible ring → inline style
 * 8. border-white/15 → var(--border-glass) token
 * 9. Project card hover lift → onMouseEnter/Leave
 * 10. SECTION_CONFIG for easy text updates
 */

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import {
  faArrowRight,
  faArrowUpRightFromSquare,
  faChartBar,
  faImage,
  faLock,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { projectCategories } from "../data/projects";

/* ============================================================
   SECTION CONFIG
   ============================================================ */
const SECTION_CONFIG = {
  label:         "Projects",
  heading:       "Selected work,",
  headingAccent: "built with purpose.",
  subtext:       "Web applications, data projects and automation systems. Open any project for the full case study.",
  emptyState:    "No projects in this category yet.",
};


/* ============================================================
   API CONFIG
   ============================================================ */

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

/* ============================================================
   NORMALIZE API PROJECT
   Converts PostgreSQL project structure into the structure
   already expected by this component.
   ============================================================ */

function normalizeProject(project) {
  return {
    id: project.id,

    title: project.title,

    /* API description → existing UI summary */
    summary: project.description,

    /* API tech_stack is comma-separated */
    tech: project.tech_stack
      ? project.tech_stack
          .split(",")
          .map((tech) => tech.trim())
          .filter(Boolean)
      : [],

    thumbnail:
      project.image_url || null,

    github_url:
      project.github_url || null,

    live_url:
      project.live_url || null,

    category:
      project.category || "other",

    featured:
      Boolean(project.featured),

    display_order:
      project.display_order ?? 0,

    /*
     * These fields are not currently stored
     * in the PostgreSQL projects table.
     *
     * Keep them empty so the existing modal
     * continues to work safely.
     */
    objective: "",
    problem: "",
    solution: "",

    is_confidential: false,

    powerbi_url: null,
    website_url: null,
  };
}

/* ============================================================
   HELPERS
   ============================================================ */
const getCategoryLabel = (id) =>
  projectCategories.find((c) => c.id === id)?.label ?? "Project";

const getProjectNumber = (i) =>
  String(i + 1).padStart(2, "0");

/* ============================================================
   ANIMATION VARIANTS
   ============================================================ */
const fadeUp = (delay = 0) => ({
  initial:     { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0  },
  viewport:    { once: true, margin: "-60px" },
  transition:  { duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] },
});

/* ============================================================
   PROJECT IMAGE
   Graceful fallback for broken/missing thumbnails
   ============================================================ */
function ProjectImage({ project, className = "" }) {
  const [hasError, setHasError] = useState(false);

  /* Reset error state when project changes */
  useEffect(() => { setHasError(false); }, [project.thumbnail]);

  if (!project.thumbnail || hasError) {
    return (
      <div
        className={`flex h-full w-full items-center justify-center ${className}`}
        style={{ background: "color-mix(in srgb, var(--accent) 5%, transparent)" }}
      >
        <div className="flex flex-col items-center gap-3 text-center">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-2xl"
            style={{
              background: "color-mix(in srgb, var(--accent) 10%, transparent)",
              color:      "var(--accent)",
            }}
          >
            <FontAwesomeIcon icon={faImage} className="h-5 w-5" />
          </div>
          <span
            className="font-mono-tag text-xs"
            style={{ color: "var(--text-muted)" }}
          >
            Project preview
          </span>
        </div>
      </div>
    );
  }

  return (
    <img
      src={project.thumbnail}
      alt={`${project.title} preview`}
      loading="lazy"
      onError={() => setHasError(true)}
      className={`h-full w-full object-cover ${className}`}
    />
  );
}

/* ============================================================
   PROJECT CARD
   ============================================================ */
function ProjectCard({ project, index, onOpen }) {
  const category = getCategoryLabel(project.category);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.45,
        delay:    Math.min(index * 0.06, 0.18),
      }}
      onClick={() => onOpen(project)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen(project);
        }
      }}
      /* Hover: lift + accent border */
      onMouseEnter={(e) => {
        e.currentTarget.style.transform   = "translateY(-4px)";
        e.currentTarget.style.borderColor = "color-mix(in srgb, var(--accent) 35%, transparent)";
        e.currentTarget.style.boxShadow   = "var(--shadow-lg)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform   = "";
        e.currentTarget.style.borderColor = "";
        e.currentTarget.style.boxShadow   = "";
      }}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${project.title}`}
      className="glass-card group relative flex h-full cursor-pointer flex-col overflow-hidden p-0"
      style={{ outline: "none" }}
      /* WCAG focus ring via CSS — more reliable than Tailwind focus-visible: */
      onFocus={(e) => {
        e.currentTarget.style.outline      = "2px solid var(--accent)";
        e.currentTarget.style.outlineOffset = "3px";
      }}
      onBlur={(e) => {
        e.currentTarget.style.outline = "";
        e.currentTarget.style.outlineOffset = "";
      }}
    >
      {/* ── THUMBNAIL ─────────────────────────────────────── */}
      <div
        className="relative w-full overflow-hidden aspect-[16/9]"
        style={{ background: "color-mix(in srgb, var(--accent) 5%, transparent)" }}
      >
        {/* Zoom on hover */}
        <div className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.035]">
          <ProjectImage project={project} />
        </div>

        {/* Bottom gradient overlay */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent"
        />

        {/* Category badge */}
        <span
          className="font-mono-tag absolute left-4 top-4 rounded-full px-3 py-1.5 uppercase backdrop-blur-md"
          style={{
            fontSize:      "0.5625rem",
            letterSpacing: "0.12em",
            fontWeight:    500,
            color:         "#ffffff",
            border:        "1px solid rgba(255,255,255,0.18)",
            background:    "rgba(0,0,0,0.45)",
          }}
        >
          {category}
        </span>

        {/* Featured badge */}
        {project.featured && (
          <span
            className="font-mono-tag absolute right-4 top-4 rounded-full px-3 py-1.5 font-semibold uppercase"
            style={{
              fontSize:      "0.5625rem",
              letterSpacing: "0.12em",
              color:         "#ffffff",
              background:    "var(--accent)",
              boxShadow:     "0 2px 8px color-mix(in srgb, var(--accent) 40%, transparent)",
            }}
          >
            Featured
          </span>
        )}

        {/* Confidential badge */}
        {project.is_confidential && (
          <span
            className="font-mono-tag absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full px-3 py-1.5 backdrop-blur-md"
            style={{
              fontSize:   "0.5625rem",
              color:      "#ffffff",
              border:     "1px solid rgba(255,255,255,0.18)",
              background: "rgba(0,0,0,0.60)",
            }}
          >
            <FontAwesomeIcon icon={faLock} className="h-2.5 w-2.5" />
            Internal
          </span>
        )}
      </div>

      {/* ── CONTENT ───────────────────────────────────────── */}
      <div className="flex flex-1 flex-col p-5 sm:p-6">

        {/* Number + Title */}
        <div className="mb-4">
          <div className="mb-2 flex items-center gap-2">
            <span
              className="font-mono-tag font-semibold"
              style={{
                fontSize:      "0.625rem",
                letterSpacing: "0.14em",
                color:         "var(--accent)",
              }}
            >
              {getProjectNumber(index)}
            </span>
            <span
              aria-hidden="true"
              className="h-px w-5"
              style={{ background: "color-mix(in srgb, var(--accent) 30%, transparent)" }}
            />
          </div>

          <h3
            className="text-xl font-semibold leading-tight transition-colors duration-200"
            style={{
              letterSpacing: "-0.025em",
              color:         "var(--text-primary)",
            }}
            /* Title turns accent on card hover */
            onMouseEnter={(e) => { e.currentTarget.style.color = "var(--accent)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-primary)"; }}
          >
            {project.title}
          </h3>

          <p
            className="mt-2.5 line-clamp-3 text-sm leading-6"
            style={{ color: "var(--text-secondary)" }}
          >
            {project.summary}
          </p>
        </div>

        {/* Tech stack pills */}
        {project.tech?.length > 0 && (
          <div className="mb-5 flex flex-wrap gap-2">
            {project.tech.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="font-mono-tag rounded-md px-2.5 py-1 font-medium"
                style={{
                  fontSize:   "0.5625rem",
                  color:      "var(--accent)",
                  background: "color-mix(in srgb, var(--accent) 8%, transparent)",
                }}
              >
                {tech}
              </span>
            ))}
            {project.tech.length > 4 && (
              <span
                className="font-mono-tag rounded-md px-2.5 py-1"
                style={{
                  fontSize:    "0.5625rem",
                  color:       "var(--text-muted)",
                  border:      "1px solid var(--border)",
                }}
              >
                +{project.tech.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Card footer */}
        <div
          className="mt-auto flex items-center justify-between gap-4 pt-4"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <span
            className="font-mono-tag uppercase"
            style={{
              fontSize:      "0.5625rem",
              letterSpacing: "0.14em",
              color:         "var(--text-muted)",
            }}
          >
            Case study
          </span>

          <span
            className="flex items-center gap-2 text-xs font-semibold"
            style={{ color: "var(--accent)" }}
          >
            View project
            <FontAwesomeIcon
              icon={faArrowRight}
              className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-1"
            />
          </span>
        </div>
      </div>
    </motion.article>
  );
}

/* ============================================================
   PROJECT MODAL
   Uses glass-modal (Tier 4) from index.css
   ============================================================ */
function ProjectModal({ project, onClose }) {
  const category = getCategoryLabel(project.category);

  /* Body scroll lock + Escape key */
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEsc = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{    opacity: 0 }}
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto p-4 sm:p-6"
      style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(12px)" }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
    >
      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.97 }}
        animate={{ opacity: 1, y: 0,   scale: 1    }}
        exit={{    opacity: 0, y: 20,   scale: 0.97 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        /* glass-modal = Tier 4 glass (strongest blur, deepest shadow) */
        className="glass-modal relative my-auto w-full max-w-5xl overflow-hidden p-0"
        style={{ borderRadius: "1.75rem" }}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close project details"
          className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-md transition-all duration-200"
          style={{
            border:     "1px solid rgba(255,255,255,0.18)",
            background: "rgba(0,0,0,0.50)",
            color:      "#ffffff",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.75)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.50)"; }}
        >
          <FontAwesomeIcon icon={faXmark} className="h-4 w-4" />
        </button>

        {/* ── MODAL HERO IMAGE ──────────────────────────────── */}
        <div
          className="relative w-full overflow-hidden aspect-[16/7] max-h-[420px]"
          style={{ background: "color-mix(in srgb, var(--accent) 5%, transparent)" }}
        >
          <ProjectImage project={project} />

          {/* Gradient overlay */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent"
          />

          {/* Badges over image */}
          <div className="absolute bottom-5 left-5 flex flex-wrap gap-2 sm:bottom-6 sm:left-7">
            <span
              className="font-mono-tag rounded-full px-3 py-1.5 uppercase backdrop-blur-md"
              style={{
                fontSize:      "0.5625rem",
                letterSpacing: "0.08em",
                color:         "#ffffff",
                border:        "1px solid rgba(255,255,255,0.18)",
                background:    "rgba(0,0,0,0.45)",
              }}
            >
              {category}
            </span>

            {project.featured && (
              <span
                className="font-mono-tag rounded-full px-3 py-1.5 uppercase"
                style={{
                  fontSize:   "0.5625rem",
                  color:      "#ffffff",
                  background: "var(--accent)",
                }}
              >
                Featured
              </span>
            )}

            {project.is_confidential && (
              <span
                className="font-mono-tag flex items-center gap-1.5 rounded-full px-3 py-1.5 backdrop-blur-md"
                style={{
                  fontSize:   "0.5625rem",
                  color:      "#ffffff",
                  border:     "1px solid rgba(255,255,255,0.18)",
                  background: "rgba(0,0,0,0.55)",
                }}
              >
                <FontAwesomeIcon icon={faLock} className="h-2.5 w-2.5" />
                Internal
              </span>
            )}
          </div>
        </div>

        {/* ── MODAL BODY ────────────────────────────────────── */}
        <div className="max-h-[60vh] overflow-y-auto p-6 sm:p-8 lg:p-10">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.4fr_0.6fr]">

            {/* Left: Project details */}
            <div>
              <h2
                id="project-modal-title"
                className="mb-4 font-bold text-3xl leading-tight sm:text-4xl"
                style={{
                  letterSpacing: "-0.035em",
                  color:         "var(--text-primary)",
                }}
              >
                {project.title}
              </h2>

              <p
                className="mb-8 max-w-2xl text-base leading-7"
                style={{ color: "var(--text-secondary)" }}
              >
                {project.summary}
              </p>

              {/* Case study sections */}
              <div className="space-y-7">
                {[
                  { key: "objective", label: "Objective", value: project.objective },
                  { key: "problem",   label: "Problem",   value: project.problem   },
                  { key: "solution",  label: "Solution",  value: project.solution  },
                ].filter((s) => s.value).map((section) => (
                  <div key={section.key}>
                    <p
                      className="font-mono-tag mb-2 font-semibold uppercase"
                      style={{
                        fontSize:      "0.5625rem",
                        letterSpacing: "0.14em",
                        color:         "var(--accent)",
                      }}
                    >
                      {section.label}
                    </p>
                    <p
                      className="text-sm leading-7"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {section.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Tech stack sidebar */}
            <aside>
              <div
                className="glass-card rounded-2xl p-5"
                style={{
                  background: "color-mix(in srgb, var(--surface-solid) 30%, transparent)",
                }}
              >
                <p
                  className="font-mono-tag mb-4 font-semibold uppercase"
                  style={{
                    fontSize:      "0.5625rem",
                    letterSpacing: "0.14em",
                    color:         "var(--accent)",
                  }}
                >
                  Tech stack
                </p>

                <div className="flex flex-wrap gap-2">
                  {project.tech?.map((tech) => (
                    <span
                      key={tech}
                      className="font-mono-tag rounded-lg px-2.5 py-1.5"
                      style={{
                        fontSize:   "0.625rem",
                        color:      "var(--text-secondary)",
                        border:     "1px solid var(--border)",
                        background: "color-mix(in srgb, var(--surface-solid) 20%, transparent)",
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </aside>
          </div>

          {/* ── ACTION BUTTONS ──────────────────────────────── */}
          <div
            className="mt-10 flex flex-wrap items-center gap-3 pt-6"
            style={{ borderTop: "1px solid var(--border)" }}
          >
            {project.is_confidential ? (
              <span
                className="font-mono-tag flex items-center gap-2 text-xs"
                style={{ color: "var(--text-muted)" }}
              >
                <FontAwesomeIcon icon={faLock} className="h-3 w-3" />
                Source unavailable: internal / confidential
              </span>
            ) : (
              <>
                {/* GitHub */}
                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-card flex h-11 items-center gap-2 rounded-full px-5 text-sm font-medium transition-transform duration-200 hover:-translate-y-0.5"
                    style={{ color: "var(--text-primary)" }}
                  >
                    <FontAwesomeIcon icon={faGithub} className="h-4 w-4" />
                    GitHub
                  </a>
                )}

                {/* Power BI Dashboard */}
                {project.powerbi_url && (
                  <a
                    href={project.powerbi_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-card flex h-11 items-center gap-2 rounded-full px-5 text-sm font-medium transition-transform duration-200 hover:-translate-y-0.5"
                    style={{ color: "var(--text-primary)" }}
                  >
                    <FontAwesomeIcon icon={faChartBar} className="h-4 w-4" />
                    Dashboard
                  </a>
                )}

                {/* Live Demo */}
                {project.live_url && (
                  <a
                    href={project.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-11 items-center gap-2 rounded-full px-5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5"
                    style={{ background: "var(--accent)" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "var(--accent-hover)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "var(--accent)"; }}
                  >
                    Live Demo
                    <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="h-3 w-3" />
                  </a>
                )}

                {/* Website */}
                {project.website_url && (
                  <a
                    href={project.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-11 items-center gap-2 rounded-full px-5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5"
                    style={{ background: "var(--accent)" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "var(--accent-hover)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "var(--accent)"; }}
                  >
                    Visit Website
                    <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="h-3 w-3" />
                  </a>
                )}
              </>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ============================================================
   PROJECTS — MAIN EXPORT
   ============================================================ */
export default function Projects() {
  const [activeCategory, setActiveCategory] =
    useState("all");

  const [selectedProject, setSelectedProject] =
    useState(null);

  const [projects, setProjects] =
    useState([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /* ==========================================================
     FETCH PROJECTS FROM BACKEND
     ========================================================== */

  useEffect(() => {
    let isMounted = true;

    async function loadProjects() {
      try {
        setIsLoading(true);
        setError("");

        const response = await fetch(
          `${API_BASE_URL}/api/projects`
        );

        if (!response.ok) {
          throw new Error(
            "Unable to load projects."
          );
        }

        const result =
          await response.json();

        if (!result.success) {
          throw new Error(
            result.message ||
              "Unable to load projects."
          );
        }

        const normalizedProjects =
          (result.data || []).map(
            normalizeProject
          );

        if (isMounted) {
          setProjects(
            normalizedProjects
          );
        }
      } catch (error) {
        console.error(
          "Projects API error:",
          error
        );

        if (isMounted) {
          setError(
            "Projects could not be loaded right now."
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadProjects();

    return () => {
      isMounted = false;
    };
  }, []);

  /* ==========================================================
     FILTER PROJECTS
     ========================================================== */

  const filteredProjects = useMemo(() => {
    if (activeCategory === "all") {
      return projects;
    }

    return projects.filter(
      (project) =>
        project.category ===
        activeCategory
    );
  }, [
    projects,
    activeCategory,
  ]);

  /* ==========================================================
     ONLY SHOW CATEGORIES THAT HAVE PROJECTS
     ========================================================== */

  const activeCategories = useMemo(
    () =>
      projectCategories.filter(
        (category) =>
          category.id === "all" ||
          projects.some(
            (project) =>
              project.category ===
              category.id
          )
      ),
    [projects]
  );

  return (
    <section id="projects" className="relative px-6 py-20 md:px-12 md:py-24">
      <div className="mx-auto max-w-6xl">

        {/* ── SECTION HEADER ──────────────────────────────── */}
        <motion.div {...fadeUp(0)} className="mb-10 md:mb-12">
          <div className="mb-4 flex items-center gap-3">
            <span
              className="block h-px w-7 shrink-0"
              style={{ background: "var(--accent)" }}
            />
            <span
              className="font-mono-tag font-semibold uppercase"
              style={{
                fontSize:      "0.625rem",
                letterSpacing: "0.16em",
                color:         "var(--accent)",
              }}
            >
              {SECTION_CONFIG.label}
            </span>
          </div>

          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <h2
              className="max-w-2xl font-bold text-3xl sm:text-4xl lg:text-5xl"
              style={{
                lineHeight:    "1.08",
                letterSpacing: "-0.04em",
                color:         "var(--text-primary)",
              }}
            >
              {SECTION_CONFIG.heading}{" "}
              <span style={{ color: "var(--accent)" }}>
                {SECTION_CONFIG.headingAccent}
              </span>
            </h2>

            <p
              className="max-w-sm text-sm leading-6 md:text-right"
              style={{ color: "var(--text-secondary)" }}
            >
              {SECTION_CONFIG.subtext}
            </p>
          </div>
        </motion.div>

        {/* ── CATEGORY FILTER TABS ────────────────────────── */}
        <motion.div
          {...fadeUp(0.08)}
          className="mb-8 flex flex-wrap gap-2"
          role="tablist"
          aria-label="Filter projects by category"
        >
          {activeCategories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveCategory(cat.id)}
                className="font-mono-tag rounded-full px-4 py-2 font-medium transition-all duration-200"
                style={{
                  fontSize:    "0.625rem",
                  border:      isActive
                    ? "1px solid var(--accent)"
                    : "1px solid var(--border)",
                  background:  isActive
                    ? "var(--accent)"
                    : "color-mix(in srgb, var(--surface-solid) 25%, transparent)",
                  color:       isActive ? "#ffffff" : "var(--text-secondary)",
                  boxShadow:   isActive
                    ? "0 2px 8px color-mix(in srgb, var(--accent) 25%, transparent)"
                    : "none",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor = "color-mix(in srgb, var(--accent) 40%, transparent)";
                    e.currentTarget.style.color       = "var(--accent)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor = "var(--border)";
                    e.currentTarget.style.color       = "var(--text-secondary)";
                  }
                }}
              >
                {cat.label}
              </button>
            );
          })}
        </motion.div>

        {/* ========================================================
            LOADING STATE
            ======================================================== */}

        {isLoading && (
          <div
            className="
              grid
              grid-cols-1
              gap-5
              md:grid-cols-2
              lg:grid-cols-3
            "
            aria-live="polite"
          >
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="glass-card h-[420px] animate-pulse rounded-2xl"
                aria-hidden="true"
              />
            ))}
          </div>
        )}

        {/* ========================================================
            API ERROR
            ======================================================== */}

        {!isLoading && error && (
          <div
            className="glass-card rounded-2xl p-8 text-center"
            role="alert"
          >
            <p
              className="text-sm"
              style={{
                color:
                  "var(--text-secondary)",
              }}
            >
              {error}
            </p>
          </div>
        )}

        {/* ── PROJECT GRID ────────────────────────────────── */}
        {!isLoading && !error && (
          <motion.div
            layout
            className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3"
          >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                onOpen={setSelectedProject}
              />
            ))}
          </AnimatePresence>
        </motion.div>
        )}

        {/* ── EMPTY STATE ─────────────────────────────────── */}
        {filteredProjects.length === 0 && (
          <div className="glass-card mt-8 p-10 text-center">
            <p
              className="text-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              {SECTION_CONFIG.emptyState}
            </p>
          </div>
        )}
      </div>

      {/* ── PROJECT MODAL ───────────────────────────────────── */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}