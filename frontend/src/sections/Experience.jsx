/**
 * Experience.jsx
 *
 * Professional timeline section showing career progression.
 *
 * FUTURE-PROOFING GUIDE:
 * ──────────────────────
 * 1. To ADD a role      → add object to `roles` array in Experience()
 * 2. To CHANGE heading  → edit SECTION_CONFIG
 * 3. To ADD skills      → edit the skills array in each role object
 * 4. To EXTERNALIZE     → move `roles` array to data/experience.js
 *                         and import here (description + skills fields)
 *
 * Fixes applied:
 * 1. dark:text-emerald-400 → inline style (data-theme dark mode)
 * 2. text-primary/secondary/muted/accent → inline CSS var styles
 * 3. bg-accent/10, border-accent/40 → color-mix() with CSS vars
 * 4. bg-[var(--page-bg)] on node → proper surface color
 * 5. Glass treatment added to CTA bottom bar
 * 6. SECTION_CONFIG for easy text updates
 * 7. Connecting line uses CSS var border token
 */

import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faBriefcase,
  faCalendarDays,
} from "@fortawesome/free-solid-svg-icons";
import { jobTimeline } from "../data/experience";

/* ============================================================
   SECTION CONFIG
   Change text/labels here without touching JSX.
   ============================================================ */
const SECTION_CONFIG = {
  label:         "Experience",
  heading:       "From engineering to",
  headingAccent: "data & systems.",
  subtext:       "My professional journey across engineering, analytics, automation and software development.",
  ctaNote:       "The common thread: solving practical problems with better systems.",
  ctaLink:       "#platforms-built",
  ctaLinkLabel:  "See what I built",
};

/* ============================================================
   ANIMATION VARIANTS
   ============================================================ */
const fadeUp = (delay = 0) => ({
  initial:     { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0  },
  viewport:    { once: true, margin: "-50px" },
  transition:  { duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] },
});

/* ============================================================
   CURRENT ROLE BADGE
   Pulsing green dot + "Current role" label
   ============================================================ */
function CurrentBadge() {
  return (
    <div
      className="mb-3 inline-flex items-center gap-2 rounded-full px-2.5 py-1"
      style={{ background: "rgba(16, 185, 129, 0.10)" }}
    >
      {/* Pulsing dot */}
      <span className="relative flex h-1.5 w-1.5">
        <span
          className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
          style={{ background: "#34d399" }}  /* emerald-400 */
        />
        <span
          className="relative inline-flex h-1.5 w-1.5 rounded-full"
          style={{ background: "#10b981" }}  /* emerald-500 */
        />
      </span>

      {/* Label — inline style instead of dark:text-emerald-400 */}
      <span
        className="font-mono-tag font-semibold uppercase"
        style={{
          fontSize:      "0.5625rem",   /* 9px */
          letterSpacing: "0.1em",
          color:         "var(--color-success, #10b981)",
        }}
      >
        Current role
      </span>
    </div>
  );
}

/* ============================================================
   TIMELINE RAIL
   Vertical line + node dot for each experience item.
   ============================================================ */
function TimelineRail({ isLast }) {
  return (
    <div className="relative flex justify-center">
      {/* Vertical connecting line */}
      {!isLast && (
        <span
          aria-hidden="true"
          className="absolute left-1/2 top-5 h-[calc(100%+2rem)] w-px -translate-x-1/2"
          style={{ background: "var(--border)" }}
        />
      )}

      {/* Node dot — ring + inner dot */}
      <span
        className="relative z-10 mt-0.5 flex h-4 w-4 items-center justify-center rounded-full"
        style={{
          border:     "1px solid color-mix(in srgb, var(--accent) 40%, transparent)",
          background: "var(--page-bg)",
        }}
      >
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ background: "var(--accent)" }}
        />
      </span>
    </div>
  );
}

/* ============================================================
   DATE DISPLAY
   Shared between desktop column and mobile inline.
   ============================================================ */
function DateLabel({ duration }) {
  return (
    <div className="flex items-center gap-2">
      <FontAwesomeIcon
        icon={faCalendarDays}
        className="h-3 w-3 shrink-0"
        style={{ color: "var(--accent)" }}
      />
      <span
        className="font-mono-tag font-medium leading-5"
        style={{
          fontSize: "0.625rem",   /* 10px */
          color:    "var(--text-muted)",
        }}
      >
        {duration}
      </span>
    </div>
  );
}

/* ============================================================
   EXPERIENCE ITEM
   One role in the timeline.
   ============================================================ */
function ExperienceItem({ item, index, isLast }) {
  return (
    <motion.article
      {...fadeUp(index * 0.1)}
      className="
        relative grid gap-4
        grid-cols-[28px_1fr]
        md:grid-cols-[160px_32px_1fr] md:gap-6
      "
    >
      {/* ── 1. DATE COLUMN (desktop only) ─────────────────── */}
      <div className="hidden pt-0.5 md:block">
        <DateLabel duration={item.duration} />
      </div>

      {/* ── 2. TIMELINE RAIL ──────────────────────────────── */}
      <TimelineRail isLast={isLast} />

      {/* ── 3. CONTENT COLUMN ─────────────────────────────── */}
      <div className={isLast ? "pb-0" : "pb-12 md:pb-14"}>

        {/* Mobile date */}
        <div className="mb-3 md:hidden">
          <DateLabel duration={item.duration} />
        </div>

        {/* Current role badge */}
        {item.current && <CurrentBadge />}

        {/* Role title */}
        <h3
          className="text-xl font-semibold sm:text-2xl"
          style={{
            letterSpacing: "-0.025em",
            color:         "var(--text-primary)",
          }}
        >
          {item.role}
        </h3>

        {/* Company */}
        <p
          className="mt-1.5 text-sm font-semibold"
          style={{ color: "var(--accent)" }}
        >
          {item.company}
        </p>

        {/* Description */}
        <p
          className="mt-5 max-w-2xl text-sm leading-7 sm:text-[15px]"
          style={{ color: "var(--text-secondary)" }}
        >
          {item.description}
        </p>

        {/* Skill tags */}
        <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2">
          {item.skills.map((skill) => (
            <span key={skill} className="experience-skill">
              {skill}
            </span>
          ))}
        </div>

        {/* Divider between items */}
        {!isLast && (
          <div
            className="mt-8 h-px max-w-2xl"
            style={{ background: "var(--border)" }}
          />
        )}
      </div>
    </motion.article>
  );
}

/* ============================================================
   EXPERIENCE — MAIN EXPORT
   ============================================================ */
export default function Experience() {

  /*
   * ROLES DATA
   *
   * TO EXTERNALIZE: move this array to data/experience.js
   * and add `description` + `skills` fields there.
   * Then import here: import { roles } from "../data/experience";
   *
   * TO ADD A ROLE: copy one object and add to the array.
   * Array order = timeline order (top = most recent).
   */
  const roles = [
    {
      id:          "current",
      role:        jobTimeline.role,
      company:     jobTimeline.company,
      duration:    jobTimeline.duration,
      current:     true,
      description: "Working across data analytics, reporting, automation and digital systems, with a focus on turning complex operational workflows into clearer and more useful solutions.",
      skills:      ["Data Analytics", "Power BI", "Python", "Automation", "Development"],
    },
    {
      id:          "previous",
      role:        jobTimeline.previousRole.title,
      company:     jobTimeline.company,
      duration:    jobTimeline.previousRole.duration,
      current:     false,
      description: "Worked across electrical and electronics engineering projects before transitioning toward analytics, automation and software-driven problem solving.",
      skills:      ["Electrical", "Electronics", "Engineering", "Projects"],
    },
    /* ── FUTURE ROLE TEMPLATE ─────────────────────────────────
    {
      id:          "role-3",
      role:        "Your Future Role",
      company:     "Company Name",
      duration:    "Month YYYY — Month YYYY",
      current:     false,
      description: "What you did here.",
      skills:      ["Skill 1", "Skill 2"],
    },
    ─────────────────────────────────────────────────────────── */
  ];

  return (
    <section id="experience" className="relative px-6 py-20 md:px-12 md:py-24">
      <div className="mx-auto max-w-6xl">

        {/* ====================================================
            SECTION HEADER
            ==================================================== */}
        <motion.div
          {...fadeUp(0)}
          className="mb-12 md:mb-16"
        >
          {/* Label */}
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

          {/* Heading + subtext row */}
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

        {/* ====================================================
            TIMELINE
            ==================================================== */}
        <div className="mx-auto max-w-5xl">
          {roles.map((item, index) => (
            <ExperienceItem
              key={item.id}
              item={item}
              index={index}
              isLast={index === roles.length - 1}
            />
          ))}
        </div>

        {/* ====================================================
            BOTTOM CTA BAR
            Glass treatment added — consistent with other sections.
            ==================================================== */}
        <motion.div
          {...fadeUp(0)}
          className="mt-14 md:ml-[218px]"
        >
          <div
            className="glass-card flex flex-col gap-4 rounded-2xl p-5 sm:flex-row sm:items-center sm:justify-between"
          >
            {/* Left: icon + note */}
            <div className="flex items-center gap-3">
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                style={{
                  background: "color-mix(in srgb, var(--accent) 10%, transparent)",
                  color:      "var(--accent)",
                }}
              >
                <FontAwesomeIcon icon={faBriefcase} className="h-3 w-3" />
              </span>

              <p
                className="max-w-lg text-xs leading-5 sm:text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                {SECTION_CONFIG.ctaNote}
              </p>
            </div>

            {/* Right: link */}
            <a
              href={SECTION_CONFIG.ctaLink}
              className="group inline-flex shrink-0 items-center gap-2 text-xs font-semibold"
              style={{ color: "var(--accent)" }}
            >
              {SECTION_CONFIG.ctaLinkLabel}
              <FontAwesomeIcon
                icon={faArrowRight}
                className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-1"
              />
            </a>
          </div>
        </motion.div>

      </div>
    </section>
  );
}