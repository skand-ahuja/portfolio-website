import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import GlassCard from "./GlassCard";

export default function ExpandablePlatformCard({ platform, isOpen, onToggle, showBadge = true }) {
  return (
    <GlassCard size="none" className="overflow-hidden">
      <button onClick={onToggle} className="flex w-full items-center justify-between gap-4 p-5 text-left outline-none focus-visible:bg-[color-mix(in_srgb,var(--accent)_5%,transparent)]">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <h3 className="text-[15px] font-semibold text-[var(--text-primary)]">{platform.title}</h3>
            {showBadge && platform.badge && <span className="rounded-full bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider text-[var(--accent)]">{platform.badge}</span>}
          </div>
          <p className="text-[13px] text-[var(--text-secondary)]">{platform.tagline}</p>
        </div>
        <motion.span animate={{ rotate: isOpen ? 180 : 0 }} className="flex h-7 w-7 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--text-primary)_5%,transparent)] text-[var(--text-muted)]"><FontAwesomeIcon icon={faChevronDown} className="h-3 w-3" /></motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="space-y-4 border-t border-[var(--border)] bg-[color-mix(in_srgb,var(--surface-solid)_30%,transparent)] p-5">
              <div><p className="mb-1 font-mono text-[9px] uppercase tracking-widest text-[var(--text-muted)]">Problem</p><p className="text-[13px] leading-relaxed text-[var(--text-secondary)]">{platform.problem}</p></div>
              <div><p className="mb-1 font-mono text-[9px] uppercase tracking-widest text-[var(--text-muted)]">Solution</p><p className="text-[13px] leading-relaxed text-[var(--text-secondary)]">{platform.solution}</p></div>
              <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-solid)] p-4"><p className="mb-1 font-mono text-[9px] uppercase tracking-widest text-[var(--accent)]">Impact</p><p className="text-[13px] font-medium text-[var(--text-primary)]">{platform.impact}</p></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  );
}