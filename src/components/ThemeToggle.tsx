"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Hydration mismatch prevent karne ke liye initial render pe empty pill dikhayenge
  if (!mounted) {
    return (
      <div
        className="h-9 w-[68px] rounded-full border border-[var(--border)]"
        style={{ background: "color-mix(in srgb, var(--surface-solid) 80%, transparent)" }}
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="relative flex h-9 w-[68px] items-center rounded-full px-1 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
      style={{
        background: "color-mix(in srgb, var(--surface-solid) 80%, transparent)",
        border: "1px solid var(--border)",
        backdropFilter: "blur(12px)",
        transform: "translateZ(0)"
      }}
    >
      <span aria-hidden="true" className="absolute left-2.5 text-[11px] transition-opacity duration-300" style={{ color: "#f59e0b", opacity: isDark ? 0.35 : 1 }}>
        <FontAwesomeIcon icon={faSun} />
      </span>
      <span aria-hidden="true" className="absolute right-2.5 text-[11px] transition-opacity duration-300" style={{ color: "var(--accent-soft)", opacity: isDark ? 1 : 0.35 }}>
        <FontAwesomeIcon icon={faMoon} />
      </span>

      <motion.span
        animate={{ x: isDark ? 32 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full shadow-md"
        style={{ background: "var(--text-primary)", boxShadow: "0 2px 8px color-mix(in srgb, var(--text-primary) 30%, transparent)" }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={isDark ? "moon" : "sun"}
            initial={{ opacity: 0, scale: 0.5, rotate: -30 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.5, rotate: 30 }}
            transition={{ duration: 0.15 }}
            className="text-[10px]"
            style={{ color: "var(--page-bg)" }}
          >
            <FontAwesomeIcon icon={isDark ? faMoon : faSun} />
          </motion.span>
        </AnimatePresence>
      </motion.span>
    </button>
  );
}