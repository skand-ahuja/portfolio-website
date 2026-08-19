/**
 * Stats.jsx
 *
 * Three key numbers with animated count-up on scroll into view.
 *
 * FUTURE-PROOFING GUIDE:
 * ──────────────────────
 * 1. To CHANGE a stat value   → edit `value` in STATS array
 * 2. To ADD a stat            → add object to STATS array
 *                               (grid auto-adjusts: sm:grid-cols-3 → change if needed)
 * 3. To CHANGE heading        → edit SECTION_CONFIG
 * 4. CountUp duration         → change `duration` prop (ms)
 *
 * Fixes applied:
 * 1. text-primary/secondary/muted/accent → inline CSS var styles
 * 2. border-current/[0.08], border-current/[0.1] → var(--border)
 * 3. bg-accent/[0.08], group-hover:bg-accent → onMouseEnter/Leave
 * 4. group-hover:text-white → inline style on hover
 * 5. Icon always shows accent color (not dimmed) — better UX
 * 6. Glass card wrapper on stats strip — premium feel
 * 7. SECTION_CONFIG for easy text updates
 *
 * DESIGN DECISION — Icons always colored:
 * Keeping icons at full accent color always (not dimmed/gray) because:
 * - The icon IS the visual indicator of what the stat is about
 * - Dimming it removes meaning, especially on mobile
 * - Hover lift + background change is enough interactive feedback
 */

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBriefcase, faCode, faLayerGroup } from "@fortawesome/free-solid-svg-icons";

/* ============================================================
   SECTION CONFIG
   ============================================================ */
const SECTION_CONFIG = {
  label:         "By the numbers",
  heading:       "A few numbers behind",
  headingAccent: "the work.",
  subtext:       "A quick snapshot of the projects, experience and systems behind the portfolio.",
  footnote:      "Numbers grow. The focus stays the same: useful work over vanity metrics.",
};

/* ============================================================
   STATS DATA
   ============================================================ */
const STATS = [
  {
    id:          "projects",
    value:       10,
    suffix:      "+",
    label:       "Projects Built",
    description: "Web apps, dashboards & automation tools",
    icon:        faCode,
  },
  {
    id:          "experience",
    value:       3,
    suffix:      "+",
    label:       "Years Experience",
    description: "Engineering, analytics & software development",
    icon:        faBriefcase,
  },
  {
    id:          "platforms",
    value:       5,
    suffix:      "+",
    label:       "Platforms Automated",
    description: "Reporting, tracking & business workflows",
    icon:        faLayerGroup,
  },
  /* ── ADD MORE STATS HERE ────────────────────────────────────
  {
    id:          "stat-4",
    value:       100,
    suffix:      "%",
    label:       "Stat Label",
    description: "Short description",
    icon:        faRocket,
  },
  Note: if you add a 4th stat, change grid to sm:grid-cols-4
  ─────────────────────────────────────────────────────────── */
];

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
   COUNT UP
   Physics-based cubic ease-out number animation.
   Starts when element enters viewport via IntersectionObserver.
   ============================================================ */
function CountUp({ target, duration = 1400 }) {
  const [count,   setCount]   = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  /* Start counting when element enters viewport */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  /* rAF-based count animation with cubic ease-out */
  useEffect(() => {
    if (!started) return;

    let raf;
    let startTime;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;

      const progress      = Math.min((timestamp - startTime) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);   /* cubic ease-out */

      setCount(Math.floor(easedProgress * target));

      if (progress < 1) raf = requestAnimationFrame(step);
    }

    raf = requestAnimationFrame(step);
    return () => { if (raf) cancelAnimationFrame(raf); };
  }, [started, target, duration]);

  return <span ref={ref}>{count}</span>;
}

/* ============================================================
   STAT ITEM
   ============================================================ */
function StatItem({ stat, index, isLast, totalCount }) {
  /* Icon hover state — controlled here, not via Tailwind group */
  const [iconHovered, setIconHovered] = useState(false);

  return (
    <motion.article
      {...fadeUp(index * 0.08)}
      className="group relative py-7 sm:px-6 sm:py-8 lg:px-8"
      style={{
        /*
         * Right border between stats on desktop (sm+).
         * Bottom border between stats on mobile.
         * Last item gets no border.
         */
        borderBottom: !isLast ? "1px solid var(--border)" : "none",
      }}
      /* Override for sm+ — right border instead of bottom */
      ref={(el) => {
        if (!el) return;
        const applyBorders = () => {
          const isMobile = window.innerWidth < 640;
          if (isLast) {
            el.style.borderBottom = "none";
            el.style.borderRight  = "none";
          } else if (isMobile) {
            el.style.borderBottom = `1px solid var(--border)`;
            el.style.borderRight  = "none";
          } else {
            el.style.borderBottom = "none";
            el.style.borderRight  = `1px solid var(--border)`;
          }
        };
        applyBorders();
        window.addEventListener("resize", applyBorders);
      }}
    >
      {/* ── NUMBER + ICON ROW ─────────────────────────────── */}
      <div className="mb-5 flex items-start justify-between gap-4">

        {/* Animated count */}
        <div className="flex items-baseline">
          <span
            className="text-5xl font-bold leading-none md:text-6xl"
            style={{
              letterSpacing: "-0.06em",
              color:         "var(--text-primary)",
            }}
          >
            <CountUp target={stat.value} />
          </span>

          {/* Suffix "+", "%" etc */}
          <span
            className="ml-1 text-2xl font-semibold md:text-3xl"
            style={{ color: "var(--accent)" }}
          >
            {stat.suffix}
          </span>
        </div>

        {/* Icon bubble — always accent colored, lifts on hover */}
        <button
          type="button"
          aria-hidden="true"
          tabIndex={-1}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-all duration-300"
          style={{
            background: iconHovered
              ? "var(--accent)"
              : "color-mix(in srgb, var(--accent) 10%, transparent)",
            color:     iconHovered ? "#ffffff" : "var(--accent)",
            transform: iconHovered ? "translateY(-3px)" : "translateY(0)",
            /*
             * DESIGN DECISION: icon always uses accent color.
             * Never gray/muted — the icon conveys meaning,
             * not just decoration. Especially important on mobile
             * where users scan quickly.
             */
          }}
          onMouseEnter={() => setIconHovered(true)}
          onMouseLeave={() => setIconHovered(false)}
        >
          <FontAwesomeIcon icon={stat.icon} className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* ── LABEL ─────────────────────────────────────────── */}
      <h3
        className="text-sm font-semibold sm:text-base"
        style={{
          letterSpacing: "-0.01em",
          color:         "var(--text-primary)",
        }}
      >
        {stat.label}
      </h3>

      {/* ── DESCRIPTION ───────────────────────────────────── */}
      <p
        className="mt-2 max-w-[250px] text-xs leading-5"
        style={{ color: "var(--text-secondary)" }}
      >
        {stat.description}
      </p>

      {/* ── BACKGROUND INDEX NUMBER ───────────────────────── */}
      <span
        aria-hidden="true"
        className="font-mono-tag absolute bottom-4 right-0 font-medium opacity-40 sm:bottom-5 sm:right-5"
        style={{
          fontSize:      "0.5625rem",
          letterSpacing: "0.14em",
          color:         "var(--text-muted)",
        }}
      >
        {String(index + 1).padStart(2, "0")}
      </span>
    </motion.article>
  );
}

/* ============================================================
   STATS — MAIN EXPORT
   ============================================================ */
export default function Stats() {
  return (
    <section id="stats" className="relative px-6 py-20 md:px-12 md:py-24">
      <div className="mx-auto max-w-6xl">

        {/* ── SECTION HEADER ──────────────────────────────── */}
        <motion.div {...fadeUp(0)} className="mb-10 md:mb-12">
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

        {/* ── STATS STRIP ─────────────────────────────────── */}
        <motion.div
          {...fadeUp(0.08)}
          className="glass-card relative overflow-hidden p-0"
        >
          {/* Accent top-left line — visual anchor */}
          <span
            aria-hidden="true"
            className="absolute left-0 top-0 h-[2px] w-16"
            style={{ background: "var(--accent)" }}
          />

          {/* Stats grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3">
            {STATS.map((stat, index) => (
              <StatItem
                key={stat.id}
                stat={stat}
                index={index}
                isLast={index === STATS.length - 1}
                totalCount={STATS.length}
              />
            ))}
          </div>
        </motion.div>

        {/* ── BOTTOM FOOTNOTE ─────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.12 }}
          className="mt-5 flex items-center gap-2"
        >
          <span
            className="h-1 w-1 rounded-full shrink-0"
            style={{ background: "var(--accent)" }}
          />
          <p
            className="font-mono-tag leading-5"
            style={{
              fontSize:      "0.5625rem",
              letterSpacing: "0.08em",
              color:         "var(--text-muted)",
            }}
          >
            {SECTION_CONFIG.footnote}
          </p>
        </motion.div>

      </div>
    </section>
  );
}