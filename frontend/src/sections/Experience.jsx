// Experience.jsx - Premium Timeline with Heartbeat Status
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faBriefcase, faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import { jobTimeline } from "../data/experience";

const SECTION_CONFIG = { label: "Experience", heading: "From engineering to", headingAccent: "data & systems.", subtext: "My professional journey across engineering, analytics, automation and software development.", ctaNote: "The common thread: solving practical problems with better systems.", ctaLink: "#platforms-built", ctaLinkLabel: "See what I built" };
const fadeUp = (delay = 0) => ({ initial: { opacity: 0, y: 16 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-50px" }, transition: { duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] } });

// TRUE HEARTBEAT EFFECT
function CurrentBadge() {
  return (
    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[var(--color-success)]/20 bg-[color-mix(in_srgb,var(--color-success)_10%,transparent)] px-2.5 py-1">
      <div className="relative flex h-2 w-2 items-center justify-center">
        {/* Soft outer glow */}
        <span className="absolute h-4 w-4 rounded-full bg-[var(--color-success)] opacity-20" />
        {/* Organic Lub-Dub Heartbeat using Framer Motion */}
        <motion.span
          animate={{ scale: [1, 1.4, 1, 1.2, 1], opacity: [0.8, 1, 0.8, 1, 0.8] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.5 }}
          className="relative h-2 w-2 rounded-full bg-[var(--color-success)] shadow-[0_0_8px_var(--color-success)]"
        />
      </div>
      <span className="font-mono text-[9px] font-semibold uppercase tracking-widest text-[var(--color-success)]">Current role</span>
    </div>
  );
}

function ExperienceItem({ item, index, isLast }) {
  return (
    <motion.article {...fadeUp(index * 0.1)} className="relative grid grid-cols-[28px_1fr] gap-4 md:grid-cols-[160px_32px_1fr] md:gap-6">
      <div className="hidden pt-1 md:block">
        <div className="flex items-center gap-2 text-[var(--text-muted)]"><FontAwesomeIcon icon={faCalendarDays} className="h-3 w-3 text-[var(--accent)]" /><span className="font-mono text-[10px] font-medium uppercase tracking-wider">{item.duration}</span></div>
      </div>
      <div className="relative flex justify-center">
        {!isLast && <span aria-hidden="true" className="absolute left-1/2 top-6 h-[calc(100%+1.5rem)] w-px -translate-x-1/2 bg-[var(--border)]" />}
        <span className="relative z-10 mt-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full border-[1.5px] border-[var(--accent)] bg-[var(--page-bg)]"><span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" /></span>
      </div>
      <div className={isLast ? "pb-0" : "pb-12 md:pb-16"}>
        <div className="mb-3 md:hidden">
          <div className="flex items-center gap-2 text-[var(--text-muted)]"><FontAwesomeIcon icon={faCalendarDays} className="h-3 w-3 text-[var(--accent)]" /><span className="font-mono text-[10px] font-medium uppercase tracking-wider">{item.duration}</span></div>
        </div>
        {item.current && <CurrentBadge />}
        <h3 className="text-xl font-bold tracking-tight text-[var(--text-primary)] sm:text-2xl">{item.role}</h3>
        <p className="mt-1 font-mono text-[11px] font-semibold uppercase tracking-widest text-[var(--accent)]">{item.company}</p>
        <p className="mt-4 max-w-2xl text-[14.5px] leading-relaxed text-[var(--text-secondary)]">{item.description}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {item.skills.map((skill) => (
            <span key={skill} className="rounded-md border border-[var(--border)] bg-[color-mix(in_srgb,var(--surface-solid)_40%,transparent)] px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider text-[var(--text-muted)] transition-colors hover:border-[color-mix(in_srgb,var(--accent)_30%,transparent)] hover:text-[var(--text-primary)]">{skill}</span>
          ))}
        </div>
      </div>
    </motion.article>
  );
}

export default function Experience() {
  const roles = [
    { id: "current", role: jobTimeline.role, company: jobTimeline.company, duration: jobTimeline.duration, current: true, description: "Working across data analytics, reporting, automation and digital systems, with a focus on turning complex operational workflows into clearer and more useful solutions.", skills: ["Data Analytics", "Power BI", "Python", "Automation", "Development"] },
    { id: "previous", role: jobTimeline.previousRole.title, company: jobTimeline.company, duration: jobTimeline.previousRole.duration, current: false, description: "Worked across electrical and electronics engineering projects before transitioning toward analytics, automation and software-driven problem solving.", skills: ["Electrical", "Electronics", "Engineering", "Projects"] }
  ];

  return (
    <section id="experience" className="relative px-6 py-20 md:px-12 md:py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div {...fadeUp(0)} className="mb-12 md:mb-16">
          <div className="mb-4 flex items-center gap-3"><span className="block h-px w-7 bg-[var(--accent)]" /><span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[var(--accent)]">{SECTION_CONFIG.label}</span></div>
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <h2 className="text-4xl font-bold tracking-tight text-[var(--text-primary)] md:text-5xl">{SECTION_CONFIG.heading} <span className="text-[var(--accent)]">{SECTION_CONFIG.headingAccent}</span></h2>
            <p className="max-w-sm text-[14px] leading-relaxed text-[var(--text-secondary)] md:text-right">{SECTION_CONFIG.subtext}</p>
          </div>
        </motion.div>
        <div className="mx-auto max-w-5xl">
          {roles.map((item, index) => <ExperienceItem key={item.id} item={item} index={index} isLast={index === roles.length - 1} />)}
        </div>
        <motion.div {...fadeUp(0)} className="mt-14 md:ml-[218px]">
          <div className="glass-card flex flex-col items-center justify-between gap-4 rounded-2xl p-5 sm:flex-row">
            <div className="flex items-center gap-4"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] text-[var(--accent)]"><FontAwesomeIcon icon={faBriefcase} className="h-4 w-4" /></span><p className="max-w-lg text-[13px] leading-relaxed text-[var(--text-secondary)]">{SECTION_CONFIG.ctaNote}</p></div>
            <a href={SECTION_CONFIG.ctaLink} className="group flex shrink-0 items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-widest text-[var(--accent)]">{SECTION_CONFIG.ctaLinkLabel} <FontAwesomeIcon icon={faArrowRight} className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-1" /></a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}