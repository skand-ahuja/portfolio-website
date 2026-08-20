// Stats.jsx - With Hover Gradient Easter Egg
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBriefcase, faCode, faLayerGroup } from "@fortawesome/free-solid-svg-icons";

const SECTION_CONFIG = { label: "By the numbers", heading: "A few numbers behind", headingAccent: "the work.", subtext: "A quick snapshot of the projects, experience and systems behind the portfolio.", footnote: "Numbers grow. The focus stays the same: useful work over vanity metrics." };
const STATS = [{ id: "projects", value: 10, suffix: "+", label: "Projects Built", description: "Web apps, dashboards & automation tools", icon: faCode }, { id: "experience", value: 3, suffix: "+", label: "Years Experience", description: "Engineering, analytics & software development", icon: faBriefcase }, { id: "platforms", value: 5, suffix: "+", label: "Platforms Automated", description: "Reporting, tracking & business workflows", icon: faLayerGroup }];
const fadeUp = (delay = 0) => ({ initial: { opacity: 0, y: 16 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-60px" }, transition: { duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] } });

function CountUp({ target, duration = 1400 }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setStarted(true); observer.disconnect(); } }, { threshold: 0.35 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let raf, start;
    const step = (ts) => {
      if (!start) start = ts;
      const prog = Math.min((ts - start) / duration, 1);
      setCount(Math.floor((1 - Math.pow(1 - prog, 3)) * target));
      if (prog < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [started, target, duration]);
  return <span ref={ref}>{count}</span>;
}

function StatItem({ stat, index, isLast }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.article
      {...fadeUp(index * 0.08)} 
      onMouseEnter={() => setHovered(true)} 
      onMouseLeave={() => setHovered(false)}
      className={`group relative px-5 py-8 sm:px-6 lg:px-8 transition-colors duration-300 border-[var(--border)] ${
        isLast ? "" : "border-b sm:border-b-0 sm:border-r"
      }`}
      style={{ background: hovered ? "color-mix(in srgb, var(--accent) 3%, transparent)" : "transparent" }}
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex items-baseline">
          <span className={`text-5xl font-bold leading-none md:text-6xl transition-all duration-500 ${hovered ? "bg-gradient-to-r from-[var(--accent)] to-[var(--accent-hover)] bg-clip-text text-transparent" : "text-[var(--text-primary)]"}`} style={{ letterSpacing: "-0.06em" }}>
            <CountUp target={stat.value} />
          </span>
          <span className="ml-1 text-2xl font-semibold md:text-3xl text-[var(--accent)]">{stat.suffix}</span>
        </div>
        <button type="button" tabIndex={-1} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-all duration-300" style={{ background: hovered ? "var(--accent)" : "color-mix(in srgb, var(--accent) 10%, transparent)", color: hovered ? "#ffffff" : "var(--accent)", transform: hovered ? "translateY(-3px)" : "translateY(0)" }}>
          <FontAwesomeIcon icon={stat.icon} className="h-3.5 w-3.5" />
        </button>
      </div>
      <h3 className="text-[15px] font-semibold sm:text-base text-[var(--text-primary)]" style={{ letterSpacing: "-0.01em" }}>{stat.label}</h3>
      <p className="mt-2 max-w-[250px] text-[13px] leading-relaxed text-[var(--text-secondary)]">{stat.description}</p>
      <span aria-hidden="true" className="font-mono absolute bottom-4 right-5 font-medium opacity-40 text-[9px] uppercase tracking-widest text-[var(--text-muted)]">{String(index + 1).padStart(2, "0")}</span>
    </motion.article>
  );
}

export default function Stats() {
  return (
    <section id="stats" className="relative px-6 py-20 md:px-12 md:py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div {...fadeUp(0)} className="mb-10 md:mb-12">
          <div className="mb-4 flex items-center gap-3"><span className="block h-px w-7 bg-[var(--accent)]" /><span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[var(--accent)]">{SECTION_CONFIG.label}</span></div>
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <h2 className="text-4xl font-bold tracking-tight text-[var(--text-primary)] lg:text-5xl">{SECTION_CONFIG.heading} <span className="text-[var(--accent)]">{SECTION_CONFIG.headingAccent}</span></h2>
            <p className="max-w-sm text-[14px] leading-relaxed text-[var(--text-secondary)] md:text-right">{SECTION_CONFIG.subtext}</p>
          </div>
        </motion.div>
        <motion.div {...fadeUp(0.08)} className="glass-card relative overflow-hidden p-0">
          <span aria-hidden="true" className="absolute left-0 top-0 h-[2px] w-16 bg-[var(--accent)]" />
          <div className="grid grid-cols-1 sm:grid-cols-3">
            {STATS.map((stat, i) => <StatItem key={stat.id} stat={stat} index={i} isLast={i === STATS.length - 1} />)}
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: 0.12 }} className="mt-5 flex items-center gap-2">
          <span className="h-1 w-1 rounded-full shrink-0 bg-[var(--accent)]" />
          <p className="font-mono text-[9px] uppercase tracking-widest text-[var(--text-muted)]">{SECTION_CONFIG.footnote}</p>
        </motion.div>
      </div>
    </section>
  );
}