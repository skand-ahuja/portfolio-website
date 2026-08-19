/**
 * PlatformsBuilt.jsx
 *
 * Interactive platform showcase — tab-based selector on desktop,
 * horizontal scroll pills on mobile.
 *
 * FUTURE-PROOFING GUIDE:
 * ──────────────────────
 * 1. To ADD a platform    → add object to platformsBuilt in data/experience.js
 * 2. To CHANGE heading    → edit SECTION_CONFIG below
 * 3. To CHANGE hint text  → edit SECTION_CONFIG.selectorHint
 * 4. All styling uses CSS vars — dark/light mode automatic
 *
 * Fixes applied:
 * 1. text-primary/secondary/muted/accent → inline CSS var styles
 * 2. border-current/[0.08] → var(--border) token
 * 3. bg-accent/10, border-accent/15, bg-accent/[0.045] → color-mix()
 * 4. formatIndex(length-1) → String(length).padStart(2,"0") — shows correct count
 * 5. Glass card treatment on right detail panel
 * 6. Impact callout card uses proper CSS var colors
 * 7. Mobile selector border uses var(--border)
 * 8. ContentBlock icon bg uses color-mix
 * 9. SECTION_CONFIG for easy text updates
 */

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faBolt,
  faCheck,
  faCode,
  faLayerGroup,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { platformsBuilt } from "../data/experience";

/* ============================================================
   SECTION CONFIG
   ============================================================ */
const SECTION_CONFIG = {
  label:         "Platforms Built",
  heading:       "Systems built for",
  headingAccent: "real workflows.",
  subtext:       "Internal platforms designed to replace repetitive, fragmented and error-prone processes.",
  selectorLabel: "System index",
  selectorHint:  "Select a platform to explore the problem, solution, stack and impact.",
};

/* ============================================================
   HELPERS
   ============================================================ */

/* "01", "02" etc — for display */
const formatIndex = (n) => String(n + 1).padStart(2, "0");

/* Total count display — "02" for 2 items */
const formatCount = (arr) => String(arr.length).padStart(2, "0");

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
   CONTENT BLOCK
   Reusable layout for Problem / Solution / Stack labels
   ============================================================ */
function ContentBlock({ icon, label, children }) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        {/* Icon bubble */}
        <span
          className="flex h-6 w-6 items-center justify-center rounded-md"
          style={{
            background: "color-mix(in srgb, var(--accent) 10%, transparent)",
            color:      "var(--accent)",
          }}
        >
          <FontAwesomeIcon icon={icon} className="h-2.5 w-2.5" />
        </span>

        {/* Label */}
        <span
          className="font-mono-tag font-semibold uppercase"
          style={{
            fontSize:      "0.5625rem",   /* 9px */
            letterSpacing: "0.15em",
            color:         "var(--text-muted)",
          }}
        >
          {label}
        </span>
      </div>

      {children}
    </div>
  );
}

/* ============================================================
   PLATFORM SELECTOR — Desktop Tab
   ============================================================ */
function PlatformSelector({ platform, index, isActive, onClick }) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      aria-controls={`panel-${platform.id}`}
      id={`tab-${platform.id}`}
      onClick={onClick}
      className="group relative w-full overflow-hidden px-0 py-5 text-left transition-all duration-300"
      style={{ borderBottom: "1px solid var(--border)" }}
    >
      {/* Active indicator — left accent bar */}
      <motion.span
        initial={false}
        animate={{ scaleY: isActive ? 1 : 0, opacity: isActive ? 1 : 0 }}
        transition={{ duration: 0.25 }}
        className="absolute bottom-0 left-0 top-0 w-[2px] origin-center"
        style={{ background: "var(--accent)" }}
      />

      <div className="flex items-start gap-4 pl-4">

        {/* Index number */}
        <span
          className="mt-0.5 font-mono-tag font-semibold transition-colors"
          style={{
            fontSize:      "0.625rem",
            letterSpacing: "0.12em",
            color:         isActive ? "var(--accent)" : "var(--text-muted)",
          }}
        >
          {formatIndex(index)}
        </span>

        {/* Title + tagline */}
        <div className="min-w-0 flex-1">
          <h3
            className="text-sm font-semibold leading-snug sm:text-base"
            style={{
              letterSpacing: "-0.015em",
              color:         isActive ? "var(--text-primary)" : "var(--text-secondary)",
              transition:    "color 0.2s ease",
            }}
          >
            {platform.title}
          </h3>
          <p
            className="mt-1.5 line-clamp-2 text-xs leading-5"
            style={{
              color:   isActive ? "var(--text-secondary)" : "var(--text-muted)",
              transition: "color 0.2s ease",
            }}
          >
            {platform.tagline}
          </p>
        </div>

        {/* Arrow icon */}
        <span
          className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all duration-200"
          style={isActive ? {
            transform:  "translateX(0)",
            background: "var(--accent)",
            color:      "#ffffff",
          } : {
            transform:  "translateX(-4px)",
            background: "color-mix(in srgb, currentColor 5%, transparent)",
            color:      "var(--text-muted)",
          }}
        >
          <FontAwesomeIcon icon={faArrowRight} className="h-2.5 w-2.5" />
        </span>
      </div>
    </button>
  );
}

/* ============================================================
   MOBILE SELECTOR — Horizontal scroll pills
   ============================================================ */
function MobileSelector({ activeIndex, setActiveIndex }) {
  return (
    <div
      role="tablist"
      aria-label="Select a platform"
      className="mb-7 flex gap-2 overflow-x-auto pb-2 lg:hidden"
    >
      {platformsBuilt.map((platform, index) => {
        const isActive = activeIndex === index;
        return (
          <button
            key={platform.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls={`panel-${platform.id}`}
            id={`mobile-tab-${platform.id}`}
            onClick={() => setActiveIndex(index)}
            className="shrink-0 rounded-full px-3.5 py-2 font-mono-tag font-semibold transition-all duration-200"
            style={{
              fontSize:    "0.625rem",
              border:      isActive
                ? "1px solid var(--accent)"
                : "1px solid var(--border)",
              background:  isActive ? "var(--accent)" : "transparent",
              color:       isActive ? "#ffffff" : "var(--text-secondary)",
            }}
          >
            {formatIndex(index)} · {platform.title}
          </button>
        );
      })}
    </div>
  );
}

/* ============================================================
   PLATFORM DETAIL — Right panel content
   ============================================================ */
function PlatformDetail({ platform, index }) {
  return (
    <motion.div
      key={platform.id}
      role="tabpanel"
      id={`panel-${platform.id}`}
      aria-labelledby={`tab-${platform.id}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0  }}
      exit={{    opacity: 0, y: -8  }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >

      {/* ── 1. HEADER ──────────────────────────────────────── */}
      <div
        className="pb-7"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        {/* Platform number + shipped badge */}
        <div className="mb-4 flex items-center justify-between gap-4">
          <span
            className="font-mono-tag font-semibold uppercase"
            style={{
              fontSize:      "0.625rem",
              letterSpacing: "0.16em",
              color:         "var(--accent)",
            }}
          >
            Platform {formatIndex(index)}
          </span>

          <span
            className="flex items-center gap-2 font-mono-tag uppercase"
            style={{
              fontSize:      "0.5625rem",
              letterSpacing: "0.12em",
              color:         "var(--text-muted)",
            }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: "var(--color-success, #10b981)" }}
            />
            Shipped
          </span>
        </div>

        {/* Title */}
        <h3
          className="max-w-2xl font-bold text-2xl sm:text-3xl xl:text-4xl"
          style={{
            lineHeight:    "1.1",
            letterSpacing: "-0.035em",
            color:         "var(--text-primary)",
          }}
        >
          {platform.title}
        </h3>

        {/* Tagline */}
        <p
          className="mt-3 max-w-2xl text-sm leading-6 sm:text-[15px]"
          style={{ color: "var(--text-secondary)" }}
        >
          {platform.tagline}
        </p>
      </div>

      {/* ── 2. PROBLEM + SOLUTION GRID ─────────────────────── */}
      <div className="grid grid-cols-1 gap-8 py-7 md:grid-cols-2 md:gap-10">
        <ContentBlock icon={faTriangleExclamation} label="The Problem">
          <p
            className="text-sm leading-7"
            style={{ color: "var(--text-secondary)" }}
          >
            {platform.problem}
          </p>
        </ContentBlock>

        <ContentBlock icon={faLayerGroup} label="What I Built">
          <p
            className="text-sm leading-7"
            style={{ color: "var(--text-secondary)" }}
          >
            {platform.solution}
          </p>
        </ContentBlock>
      </div>

      {/* ── 3. TECH STACK ──────────────────────────────────── */}
      <div
        className="py-6"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <ContentBlock icon={faCode} label="Stack">
          <div className="flex flex-wrap gap-x-4 gap-y-2.5">
            {platform.techStack.map((tech) => (
              <span
                key={tech}
                className="group inline-flex items-center gap-2 font-mono-tag font-medium transition-colors duration-150"
                style={{
                  fontSize: "0.625rem",
                  color:    "var(--text-secondary)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--accent)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--text-secondary)";
                }}
              >
                <span
                  className="h-1 w-1 rounded-full transition-opacity duration-150"
                  style={{ background: "currentColor", opacity: 0.3 }}
                />
                {tech}
              </span>
            ))}
          </div>
        </ContentBlock>
      </div>

      {/* ── 4. IMPACT CALLOUT ──────────────────────────────── */}
      <div
        className="glass-card relative overflow-hidden rounded-xl p-5 sm:p-6"
        style={{
          /* Override glass-card border with accent tint for emphasis */
          borderColor: "color-mix(in srgb, var(--accent) 25%, transparent)",
          background:  "color-mix(in srgb, var(--accent) 5%, var(--surface))",
        }}
      >
        {/* Decorative blur blob */}
        <div
          aria-hidden="true"
          className="absolute -right-10 -top-10 h-28 w-28 rounded-full blur-3xl"
          style={{ background: "color-mix(in srgb, var(--accent) 10%, transparent)" }}
        />

        <div className="relative z-10 flex items-start gap-4">
          {/* Icon */}
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white"
            style={{ background: "var(--accent)" }}
          >
            <FontAwesomeIcon icon={faBolt} className="h-3.5 w-3.5" />
          </span>

          {/* Impact text */}
          <div>
            <p
              className="mb-1.5 font-mono-tag font-semibold uppercase"
              style={{
                fontSize:      "0.5625rem",
                letterSpacing: "0.16em",
                color:         "var(--accent)",
              }}
            >
              Impact
            </p>
            <p
              className="max-w-2xl text-sm font-medium leading-6 sm:text-[15px]"
              style={{ color: "var(--text-primary)" }}
            >
              {platform.impact}
            </p>
          </div>
        </div>
      </div>

    </motion.div>
  );
}

/* ============================================================
   PLATFORMS BUILT — MAIN EXPORT
   ============================================================ */
export default function PlatformsBuilt() {
  const [activeIndex, setActiveIndex] = useState(0);

  /* Guard — don't render if no data */
  if (!platformsBuilt || platformsBuilt.length === 0) return null;

  const activePlatform = platformsBuilt[activeIndex];

  return (
    <section
      id="platforms-built"
      className="relative overflow-hidden px-6 py-20 md:px-12 md:py-24"
    >

      {/* ── BACKGROUND DECORATORS ───────────────────────────── */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `
              linear-gradient(to right,  currentColor 1px, transparent 1px),
              linear-gradient(to bottom, currentColor 1px, transparent 1px)
            `,
            backgroundSize: "48px 48px",
          }}
        />
        {/* Ambient glow */}
        <div
          className="absolute -right-40 top-1/4 h-[380px] w-[380px] rounded-full blur-[110px]"
          style={{ background: "color-mix(in srgb, var(--accent) 4%, transparent)" }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">

        {/* ── SECTION HEADER ──────────────────────────────────── */}
        <motion.div {...fadeUp(0)} className="mb-12 md:mb-14">
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

          {/* Heading + subtext */}
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

        {/* ── MOBILE SELECTOR ─────────────────────────────────── */}
        <MobileSelector
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
        />

        {/* ── MAIN INTERACTIVE GRID ───────────────────────────── */}
        <motion.div
          {...fadeUp(0.05)}
          className="
            grid grid-cols-1
            lg:grid-cols-[0.38fr_0.62fr] lg:gap-14
            xl:grid-cols-[0.35fr_0.65fr] xl:gap-20
          "
        >

          {/* ── LEFT: Desktop Selector ────────────────────────── */}
          <aside className="hidden lg:block">

            {/* Selector header row */}
            <div
              className="mb-2 flex items-center justify-between gap-4 pb-3"
              style={{ borderBottom: "1px solid var(--border)" }}
            >
              <span
                className="font-mono-tag font-semibold uppercase"
                style={{
                  fontSize:      "0.5625rem",
                  letterSpacing: "0.15em",
                  color:         "var(--text-muted)",
                }}
              >
                {SECTION_CONFIG.selectorLabel}
              </span>

              {/* Shows total count e.g. "02" */}
              <span
                className="font-mono-tag"
                style={{
                  fontSize: "0.5625rem",
                  color:    "var(--text-muted)",
                }}
              >
                {formatCount(platformsBuilt)}
              </span>
            </div>

            {/* Platform tabs */}
            <div role="tablist" aria-label="Platform selector">
              {platformsBuilt.map((platform, index) => (
                <PlatformSelector
                  key={platform.id}
                  platform={platform}
                  index={index}
                  isActive={activeIndex === index}
                  onClick={() => setActiveIndex(index)}
                />
              ))}
            </div>

            {/* Helper hint */}
            <div className="mt-6 flex items-start gap-2.5">
              <FontAwesomeIcon
                icon={faCheck}
                className="mt-1 h-2.5 w-2.5 shrink-0"
                style={{ color: "var(--accent)" }}
              />
              <p
                className="max-w-[250px] text-[11px] leading-5"
                style={{ color: "var(--text-muted)" }}
              >
                {SECTION_CONFIG.selectorHint}
              </p>
            </div>
          </aside>

          {/* ── RIGHT: Detail Panel ───────────────────────────── */}
          <div
            className="min-w-0 lg:pl-14 xl:pl-16"
            style={{ borderLeft: "0" }}
          >
            {/* Subtle left border on desktop */}
            <div
              className="hidden lg:block"
              style={{
                position:    "absolute",
                left:        "38%",
                top:         0,
                bottom:      0,
                width:       "1px",
                background:  "var(--border)",
                pointerEvents: "none",
              }}
            />

            <AnimatePresence mode="wait">
              <PlatformDetail
                key={activePlatform.id}
                platform={activePlatform}
                index={activeIndex}
              />
            </AnimatePresence>
          </div>

        </motion.div>
      </div>
    </section>
  );
}