import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import GlassCard from "./GlassCard";

/**
 * ExpandablePlatformCard — a reusable accordion-style card used to
 * present a "platform" entry: problem -> solution -> tech stack -> impact.
 *
 * Shared by both the Experience section and the Platforms Built
 * section so the same visual language is used consistently across
 * both, without duplicating this markup twice.
 */
export default function ExpandablePlatformCard({ platform, isOpen, onToggle, showBadge = true }) {
  const panelId = `platform-panel-${platform.id}`;

  return (
    <GlassCard className="overflow-hidden p-0">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="flex w-full items-center justify-between gap-4 p-6 text-left"
      >
        <div>
          <div className="mb-1.5 flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold">{platform.title}</h3>
            {showBadge && platform.badge && (
              <span className="font-mono-tag rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
                {platform.badge}
              </span>
            )}
          </div>
          <p className="text-sm opacity-70">{platform.tagline}</p>
        </div>

        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent"
        >
          <FontAwesomeIcon icon={faChevronDown} className="h-3.5 w-3.5" aria-hidden="true" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={panelId}
            role="region"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="space-y-4 border-t border-current/10 px-6 pb-6 pt-5">
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-accent">
                  The problem
                </p>
                <p className="text-sm leading-relaxed opacity-80">{platform.problem}</p>
              </div>

              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-accent">
                  What I built
                </p>
                <p className="text-sm leading-relaxed opacity-80">{platform.solution}</p>
              </div>

              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-accent">
                  Tech stack
                </p>
                <div className="flex flex-wrap gap-2">
                  {platform.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="font-mono-tag rounded-md bg-current/5 px-2.5 py-1 text-xs"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-lg bg-accent/5 p-3">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-accent">
                  Impact
                </p>
                <p className="text-sm font-medium leading-relaxed">{platform.impact}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  );
}