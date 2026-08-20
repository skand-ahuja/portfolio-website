// About.jsx - Animated Draw-Down Timeline
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBolt, faChartLine, faCode } from "@fortawesome/free-solid-svg-icons";
import { aboutNarrative, aboutHighlight, aboutClosing } from "../data/about";

const JOURNEY = [
  { id: "engineering", number: "01", period: "Feb 2023 — Apr 2025", title: "Project Engineer", subtitle: "Electrical & Electronics", skills: ["Field execution", "Technical documentation", "Project coordination"], icon: faBolt },
  { id: "analytics", number: "02", period: "May 2025 — Present", title: "Data Analytics", subtitle: "Power BI · Python · Power Platform", skills: ["Dashboards", "Reporting systems", "Workflow automation"], icon: faChartLine },
  { id: "development", number: "03", period: "Growing alongside analytics", title: "Full-Stack Development", subtitle: "React · Node.js · Flask", skills: ["Web applications", "APIs & databases", "Data-driven systems"], icon: faCode }
];

function JourneyItem({ stage, index, isLast }) {
  return (
    <motion.article initial={{ opacity: 0, x: 16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.4, delay: index * 0.07 }} className="relative grid grid-cols-[42px_1fr] gap-4">
      <div className="relative flex justify-center">
        {/* 🍏 EASTER EGG: Timeline wire draws itself down as it scrolls into view */}
        {!isLast && (
          <div className="absolute left-1/2 top-10 h-[calc(100%-0.5rem)] w-px -translate-x-1/2 bg-[var(--border)] overflow-hidden">
             <motion.div 
               initial={{ height: 0 }} whileInView={{ height: "100%" }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.8, ease: "easeInOut", delay: 0.2 }}
               className="w-full bg-[var(--accent)]" 
             />
          </div>
        )}
        {/* 🍏 FIXED: Solid background blocks the line, inner span provides the tint */}
        <span className="relative z-10 flex h-9 w-9 items-center justify-center rounded-lg border border-[color-mix(in_srgb,var(--accent)_30%,transparent)] bg-[var(--page-bg)] text-[var(--accent)] overflow-hidden">
          <span className="absolute inset-0 bg-[var(--accent)] opacity-10" />
          <FontAwesomeIcon icon={stage.icon} className="relative z-10 h-3.5 w-3.5" />
        </span>
      </div>
      <div className={isLast ? "pb-0" : "pb-8"}>
        <div className="mb-1.5 flex flex-wrap items-center gap-2"><span className="font-mono text-[9px] font-semibold tracking-widest text-[var(--accent)]">{stage.number}</span><span className="h-px w-3 bg-[var(--border)]" /><span className="font-mono text-[9px] tracking-widest text-[var(--text-muted)]">{stage.period}</span></div>
        <h3 className="text-lg font-bold tracking-tight text-[var(--text-primary)]">{stage.title}</h3>
        <p className="mt-1 text-xs font-medium text-[var(--accent)]">{stage.subtitle}</p>
        <div className="mt-3 flex flex-wrap gap-x-2 gap-y-1">
          {stage.skills.map((skill, i) => (
            <span key={skill} className="flex items-center gap-2 text-[11px] text-[var(--text-secondary)]">{skill}{i < stage.skills.length - 1 && <span className="h-1 w-1 rounded-full bg-[var(--accent)] opacity-50" />}</span>
          ))}
        </div>
      </div>
    </motion.article>
  );
}

export default function About() {
  const shortNarrative = aboutNarrative.slice(0, 2);
  return (
    <section id="about" className="relative px-6 py-20 md:px-12 md:py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} className="mb-5 flex items-center gap-3"><span className="block h-px w-7 bg-[var(--accent)]" /><span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[var(--accent)]">&gt; ORIGIN_STORY.MD</span></motion.div>
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20 xl:gap-24">
          <div>
            <motion.h2 initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} className="max-w-xl text-4xl font-bold tracking-tight text-[var(--text-primary)] lg:text-5xl">From wiring circuits to wiring <span className="text-[var(--accent)]">systems.</span></motion.h2>
            <div className="mt-6 max-w-xl space-y-4">
              {shortNarrative.map((p, i) => <motion.p key={i} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="text-[14.5px] leading-relaxed text-[var(--text-secondary)]">{p}</motion.p>)}
            </div>
            <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="group relative mt-7 max-w-xl border-l-2 border-[color-mix(in_srgb,var(--accent)_40%,transparent)] pl-5 transition-colors hover:border-[var(--accent)]">
              <span className="absolute -left-[5px] top-2 h-2 w-2 rounded-full bg-[var(--accent)] transition-transform group-hover:scale-125" />
              <p className="text-[14.5px] leading-relaxed text-[var(--text-secondary)]"><span className="font-semibold text-[var(--text-primary)]">{aboutHighlight}</span> {aboutClosing}</p>
            </motion.div>
          </div>
          <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} className="lg:pt-1">
            <div className="mb-7 flex items-center justify-between border-b border-[var(--border)] pb-3"><span className="font-mono text-[9px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">Journey</span><span className="hidden font-mono text-[9px] uppercase tracking-widest text-[var(--text-muted)] sm:block">Eng &rarr; Data &rarr; Code</span></div>
            <div>{JOURNEY.map((stage, i) => <JourneyItem key={stage.id} stage={stage} index={i} isLast={i === JOURNEY.length - 1} />)}</div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}