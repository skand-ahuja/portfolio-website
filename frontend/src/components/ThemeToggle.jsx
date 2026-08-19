/**
 * ThemeToggle.jsx
 *
 * Fixes applied:
 * 1. dark: Tailwind classes replaced with CSS var() — our dark mode uses
 *    data-theme="dark" attribute, NOT Tailwind's class strategy.
 *    So dark:* utilities never fire. Inline styles with CSS vars fix this.
 * 2. Hardcoded border-slate-200 / bg-white/70 → CSS vars
 * 3. Thumb travel math fixed: w-[72px] track, h-7(28px) thumb,
 *    px-1 padding → travel = 72 - 28 - 8(padding both sides) = 36px
 * 4. Glass styling added — matches navbar glass-nav-pill aesthetic
 * 5. focus-visible ring added for WCAG keyboard accessibility
 * 6. Smooth icon crossfade with AnimatePresence
 */

import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";

export default function ThemeToggle({ theme, toggleTheme }) {
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark        ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDark}
      className="
        relative flex items-center
        h-10 w-[72px]
        rounded-full px-1
        shadow-sm backdrop-blur-md
        transition-all duration-300
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-offset-2
      "
      style={{
        /*
         * Use CSS vars directly — these switch automatically when
         * data-theme="dark" is set on <html> by useTheme.js.
         * Tailwind dark: prefix does NOT work here (wrong strategy).
         */
        background:      "color-mix(in srgb, var(--surface-solid) 80%, transparent)",
        border:          "1px solid var(--border)",
        backdropFilter:  "blur(12px)",
        /* Focus ring uses accent color */
        "--tw-ring-color":        "var(--accent)",
        "--tw-ring-offset-color": "var(--page-bg)",
      }}
    >
      {/* ============================================================
          SUN ICON — always visible on left
          Dimmed when dark mode is active (thumb is on right)
          ============================================================ */}
      <span
        aria-hidden="true"
        className="absolute left-2.5 text-xs transition-opacity duration-300"
        style={{
          color:   "#f59e0b",              /* amber-500 — sun color */
          opacity: isDark ? 0.35 : 1,      /* dim when not active  */
        }}
      >
        <FontAwesomeIcon icon={faSun} />
      </span>

      {/* ============================================================
          MOON ICON — always visible on right
          Dimmed when light mode is active (thumb is on left)
          ============================================================ */}
      <span
        aria-hidden="true"
        className="absolute right-2.5 text-xs transition-opacity duration-300"
        style={{
          color:   "var(--accent-soft)",   /* indigo-400 — moon color */
          opacity: isDark ? 1 : 0.35,      /* dim when not active    */
        }}
      >
        <FontAwesomeIcon icon={faMoon} />
      </span>

      {/* ============================================================
          SLIDING THUMB
          
          Track:  w-[72px], px-1 (4px each side) → inner width = 64px
          Thumb:  w-7 = 28px
          Travel: 64 - 28 = 36px
          
          x: 0  → left  (light mode)
          x: 36 → right (dark mode)
          ============================================================ */}
      <motion.span
        aria-hidden="true"
        animate={{ x: isDark ? 36 : 0 }}
        transition={{
          type:      "spring",
          stiffness: 480,
          damping:   30,
          mass:      0.8,
        }}
        className="
          relative z-10
          flex h-7 w-7
          items-center justify-center
          rounded-full
          shadow-md
        "
        style={{
          background: "var(--accent)",
          /* Subtle inner glow on the thumb */
          boxShadow:  "0 2px 8px color-mix(in srgb, var(--accent) 40%, transparent), inset 0 1px 0 rgba(255,255,255,0.2)",
        }}
      >
        {/* --------------------------------------------------------
            ICON CROSSFADE
            AnimatePresence swaps sun ↔ moon with a quick fade+scale
            so the transition feels polished, not jarring
            -------------------------------------------------------- */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={isDark ? "moon" : "sun"}
            initial={{ opacity: 0, scale: 0.6, rotate: -30 }}
            animate={{ opacity: 1, scale: 1,   rotate: 0   }}
            exit={{    opacity: 0, scale: 0.6, rotate:  30  }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="text-white text-xs"
          >
            <FontAwesomeIcon icon={isDark ? faMoon : faSun} />
          </motion.span>
        </AnimatePresence>
      </motion.span>
    </button>
  );
}