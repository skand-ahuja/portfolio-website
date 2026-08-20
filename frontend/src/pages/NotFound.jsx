// NotFound.jsx - GPU Accelerated 404 Page
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faHouse, faTerminal } from "@fortawesome/free-solid-svg-icons";

const GLITCH_STYLES = `
  @keyframes glitch-anim { 0%, 90% { transform: translate(0) skew(0deg); } 92% { transform: translate(-2px, 2px) skew(5deg); } 94% { transform: translate(2px, -2px) skew(-5deg); } 96% { transform: translate(-2px, -2px) skew(2deg); } 98% { transform: translate(2px, 2px) skew(-2deg); } 100% { transform: translate(0) skew(0deg); } }
  .glitch-wrapper { position: relative; display: inline-block; animation: glitch-anim 4s infinite linear alternate-reverse; }
  .glitch-wrapper::before, .glitch-wrapper::after { content: attr(data-text); position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0.5; z-index: -1; }
  .glitch-wrapper::before { left: -3px; text-shadow: 2px 0 var(--accent); animation: glitch-anim 3s infinite linear alternate-reverse; }
  .glitch-wrapper::after { left: 3px; text-shadow: -2px 0 var(--color-error); animation: glitch-anim 2s infinite linear alternate-reverse; }
`;

const TERMINAL_LINES = [
  { text: "$ navigating to route...", delay: 0 },
  { text: "> ERROR: path not found", delay: 600 },
  { text: "> status: 404", delay: 1000 },
  { text: "> suggestion: return home", delay: 1500 },
];

function TerminalBlock() {
  const [visibleLines, setVisibleLines] = useState([]);

  useEffect(() => {
    setVisibleLines([]);
    const timers = TERMINAL_LINES.map(({ text, delay }) => setTimeout(() => setVisibleLines((prev) => [...prev, text]), delay));
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="glass-card mx-auto w-full max-w-md rounded-[1.25rem] p-4 sm:p-5 font-mono text-[12px] sm:text-[13px]">
      <div className="mb-4 flex items-center gap-2 border-b border-[var(--border)] pb-3">
        <div className="flex gap-1.5">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        </div>
        <span className="ml-2 text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-semibold">terminal — bash</span>
      </div>
      <div className="space-y-2.5">
        {visibleLines.map((line, i) => {
          const isError = line.includes("ERROR");
          const isSuggestion = line.includes("suggestion");
          const isCommand = line.startsWith("$");
          return (
            <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }} className="flex items-start gap-3">
              <FontAwesomeIcon icon={faTerminal} className={`mt-0.5 h-2.5 w-2.5 shrink-0 ${isError ? "text-[var(--color-error)]" : isCommand ? "text-[var(--text-muted)]" : "text-[var(--accent)]"}`} />
              <span className={isError ? "font-semibold text-[var(--color-error)]" : isSuggestion ? "text-[var(--color-success)]" : isCommand ? "text-[var(--text-secondary)]" : "text-[var(--accent)]"}>{line}</span>
            </motion.div>
          );
        })}
        {visibleLines.length === TERMINAL_LINES.length && (
          <div className="flex items-center gap-3">
            <FontAwesomeIcon icon={faTerminal} className="h-2.5 w-2.5 shrink-0 text-[var(--text-muted)]" />
            <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1, repeat: Infinity }} className="inline-block h-4 w-2 rounded-[1px] bg-[var(--accent)]" />
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function NotFound() {
  useEffect(() => {
    const style = document.createElement("style"); style.id = "glitch-styles"; style.textContent = GLITCH_STYLES;
    if (!document.getElementById("glitch-styles")) document.head.appendChild(style);
    return () => document.getElementById("glitch-styles")?.remove();
  }, []);

  return (
    <div className="relative flex h-[100dvh] w-full flex-col items-center justify-center overflow-hidden bg-[var(--page-bg)] px-6">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden transform-gpu">
        <div className="absolute inset-0 opacity-[0.2]" style={{ backgroundImage: "linear-gradient(to right, var(--border-strong) 1px, transparent 1px), linear-gradient(to bottom, var(--border-strong) 1px, transparent 1px)", backgroundSize: "32px 32px", maskImage: "radial-gradient(ellipse 60% 60% at 50% 50%, black 50%, transparent 100%)", WebkitMaskImage: "radial-gradient(ellipse 60% 60% at 50% 50%, black 50%, transparent 100%)" }} />
        <div className="absolute -right-20 top-1/4 h-[400px] w-[400px] rounded-full bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] blur-[100px]" />
        <div className="absolute -left-20 bottom-1/4 h-[300px] w-[300px] rounded-full bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] blur-[100px]" />
      </div>

      <div className="relative z-10 flex w-full flex-col items-center text-center">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} className="mb-4 select-none">
          <div className="glitch-wrapper" data-text="404" aria-label="404">
            <span className="font-heading font-bold text-transparent bg-clip-text bg-gradient-to-br from-[var(--text-primary)] to-[var(--text-muted)] drop-shadow-xl" style={{ fontSize: "clamp(6rem, 18vw, 12rem)", lineHeight: "0.85", letterSpacing: "-0.04em" }}>
              404
            </span>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }} className="mb-6 flex items-center gap-2 rounded-full border border-[var(--border)] bg-[color-mix(in_srgb,var(--surface-solid)_40%,transparent)] px-4 py-2 backdrop-blur-md">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--color-error)]" />
          <span className="font-mono text-[9px] font-semibold uppercase tracking-widest text-[var(--text-secondary)]">System Error — Page Not Found</span>
        </motion.div>

        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }} className="mb-10 max-w-sm text-[14px] leading-relaxed text-[var(--text-secondary)]">
          The URL might be corrupted, or this node has been deleted. Let's redirect you to a secure connection.
        </motion.p>

        <div className="mb-10 w-full"><TerminalBlock /></div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.5 }} className="flex flex-wrap items-center justify-center gap-4">
          <button onClick={() => window.location.href = "/"} className="btn-primary"><FontAwesomeIcon icon={faHouse} className="h-3.5 w-3.5" /> Return Home</button>
          <button onClick={() => window.history.length > 1 ? window.history.back() : window.location.href = "/"} className="btn-secondary"><FontAwesomeIcon icon={faArrowLeft} className="h-3.5 w-3.5" /> Go Back</button>
        </motion.div>
      </div>
    </div>
  );
}