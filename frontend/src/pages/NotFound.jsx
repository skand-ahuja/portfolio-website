import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faHouse, faTerminal } from "@fortawesome/free-solid-svg-icons";

/* ============================================================
   GLITCH ANIMATION — Fixed for Dual-Theme
   Uses text-shadows instead of solid backgrounds so it doesn't 
   block the grid pattern behind it.
   ============================================================ */
const GLITCH_STYLES = `
  @keyframes glitch-anim {
    0%, 90% { transform: translate(0) skew(0deg); }
    92% { transform: translate(-2px, 2px) skew(5deg); }
    94% { transform: translate(2px, -2px) skew(-5deg); }
    96% { transform: translate(-2px, -2px) skew(2deg); }
    98% { transform: translate(2px, 2px) skew(-2deg); }
    100% { transform: translate(0) skew(0deg); }
  }

  .glitch-wrapper {
    position: relative;
    display: inline-block;
    animation: glitch-anim 4s infinite linear alternate-reverse;
  }

  .glitch-wrapper::before,
  .glitch-wrapper::after {
    content: attr(data-text);
    position: absolute;
    top: 0; left: 0; width: 100%; height: 100%;
    opacity: 0.5;
    z-index: -1;
  }

  .glitch-wrapper::before {
    left: -3px;
    text-shadow: 2px 0 blue;
    animation: glitch-anim 3s infinite linear alternate-reverse;
  }
  
  .glitch-wrapper::after {
    left: 3px;
    text-shadow: -2px 0 red;
    animation: glitch-anim 2s infinite linear alternate-reverse;
  }
`;

const TERMINAL_LINES = [
  { text: "$ navigating to route...",  delay: 0    },
  { text: "> ERROR: path not found",   delay: 600  },
  { text: "> status: 404",             delay: 1000 },
  { text: "> suggestion: return home", delay: 1500 },
];

/* ============================================================
   TERMINAL BLOCK
   ============================================================ */
function TerminalBlock() {
  const [visibleLines, setVisibleLines] = useState([]);

  useEffect(() => {
    // 1. Reset array on load (Fixes React Strict Mode double-mount issue)
    setVisibleLines([]);

    // 2. Store all timer IDs in an array
    const timers = TERMINAL_LINES.map(({ text, delay }) => {
      return setTimeout(() => {
        setVisibleLines((prev) => [...prev, text]);
      }, delay);
    });

    // 3. Properly clear ALL timers when component unmounts
    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0  }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-white dark:bg-[#0c0c0e] border border-slate-200 dark:border-white/[0.08] rounded-[16px] p-4 sm:p-5 font-mono text-xs sm:text-sm shadow-xl shadow-slate-200/50 dark:shadow-none w-full max-w-md mx-auto"
    >
      {/* Terminal header bar */}
      <div className="mb-4 flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-white/10">
        <div className="flex gap-1.5">
          {["#ff5f57", "#febc2e", "#28c840"].map((color, i) => (
            <span key={i} className="h-3 w-3 rounded-full" style={{ background: color }} />
          ))}
        </div>
        <span className="ml-2 font-mono text-[10px] uppercase tracking-widest text-slate-400 dark:text-gray-500 font-semibold">
          terminal — bash
        </span>
      </div>

      {/* Terminal output lines */}
      <div className="space-y-2">
        {visibleLines.map((line, i) => {
          const isError = line.includes("ERROR");
          const isSuggestion = line.includes("suggestion");
          const isCommand = line.startsWith("$");
          
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0  }}
              transition={{ duration: 0.25 }}
              className="flex items-start gap-2"
            >
              <FontAwesomeIcon
                icon={faTerminal}
                className={`mt-0.5 h-2.5 w-2.5 shrink-0 ${
                  isError ? "text-red-500" : isCommand ? "text-slate-400 dark:text-gray-500" : "text-indigo-500 dark:text-gold-500"
                }`}
              />
              <span className={
                isError ? "text-red-500 font-medium" : 
                isSuggestion ? "text-emerald-500" : 
                isCommand ? "text-slate-500 dark:text-gray-400" : "text-indigo-600 dark:text-gold-400"
              }>
                {line}
              </span>
            </motion.div>
          );
        })}

        {/* Blinking cursor */}
        {visibleLines.length === TERMINAL_LINES.length && (
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faTerminal} className="h-2.5 w-2.5 shrink-0 text-slate-400 dark:text-gray-500" />
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="inline-block h-4 w-2 rounded-sm bg-indigo-500 dark:bg-gold-500"
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ============================================================
   NOT FOUND — MAIN COMPONENT
   ============================================================ */
export default function NotFound() {
  
  /* Inject CSS cleanly on mount */
  useEffect(() => {
    const style = document.createElement("style");
    style.id = "glitch-styles";
    style.textContent = GLITCH_STYLES;
    if (!document.getElementById("glitch-styles")) document.head.appendChild(style);
    return () => document.getElementById("glitch-styles")?.remove();
  }, []);

  function handleGoHome() {
    window.location.href = "/";
  }

  function handleGoBack() {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = "/";
    }
  }

  return (
    <div className="relative flex h-[100dvh] w-full flex-col items-center justify-center overflow-hidden bg-white dark:bg-[#050505] px-6">
      
      {/* BACKGROUND (Locked inside the screen) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Subtle Grid */}
        <div 
          className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"
          style={{ maskImage: "radial-gradient(ellipse 60% 60% at 50% 50%, black 50%, transparent 100%)", WebkitMaskImage: "radial-gradient(ellipse 60% 60% at 50% 50%, black 50%, transparent 100%)" }}
        />
        {/* Ambient Glows */}
        <div className="absolute top-1/4 -right-20 h-[400px] w-[400px] rounded-full bg-indigo-500/10 dark:bg-gold-500/5 blur-[100px]" />
        <div className="absolute bottom-1/4 -left-20 h-[300px] w-[300px] rounded-full bg-indigo-500/10 dark:bg-gold-500/5 blur-[100px]" />
      </div>

      {/* CONTENT */}
      <div className="relative z-10 flex flex-col items-center text-center w-full">

        {/* ── GIANT 404 ──────────────────── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1  }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-4 select-none"
        >
          <div className="glitch-wrapper" data-text="404" aria-label="404">
            <span className="font-heading font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-indigo-800 dark:from-gold-300 dark:to-gold-600 drop-shadow-xl" 
                  style={{ fontSize: "clamp(6rem, 18vw, 14rem)", lineHeight: "0.85", letterSpacing: "-0.04em" }}>
              404
            </span>
          </div>
        </motion.div>

        {/* ── STATUS BADGE ──────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0  }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mb-6 flex items-center gap-2 bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] rounded-full px-4 py-2"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500 dark:text-gray-400 font-semibold">
            System Error — Page Not Found
          </span>
        </motion.div>

        {/* ── SUBTEXT ───────────────────────────────────────── */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0  }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mb-8 max-w-sm text-sm leading-relaxed text-slate-600 dark:text-gray-400"
        >
          The URL might be corrupted, or this node has been deleted. Let's redirect you to a secure connection.
        </motion.p>

        {/* ── TERMINAL BLOCK ────────────────────────────────── */}
        <div className="mb-8 w-full">
          <TerminalBlock />
        </div>

        {/* ── CTA BUTTONS ───────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0  }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          {/* Primary: Go Home */}
          <button onClick={handleGoHome} className="flex h-12 items-center gap-3 rounded-[12px] px-6 text-sm font-semibold transition-all duration-300 bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-gold-500 dark:text-background dark:hover:bg-gold-400 hover:-translate-y-0.5 shadow-lg shadow-indigo-500/20 dark:shadow-none">
            <FontAwesomeIcon icon={faHouse} className="h-3.5 w-3.5" />
            Return Home
          </button>

          {/* Secondary: Go Back */}
          <button onClick={handleGoBack} className="flex h-12 items-center gap-3 rounded-[12px] px-6 text-sm font-medium transition-all duration-300 bg-transparent border border-slate-200 dark:border-white/[0.08] text-slate-700 dark:text-gray-300 hover:border-indigo-500 dark:hover:border-gold-500 hover:text-indigo-600 dark:hover:text-gold-400 hover:-translate-y-0.5">
            <FontAwesomeIcon icon={faArrowLeft} className="h-3.5 w-3.5" />
            Go Back
          </button>
        </motion.div>

      </div>
    </div>
  );
}