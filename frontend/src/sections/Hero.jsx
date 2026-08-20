import { useRef } from "react";
import { motion, useMotionValue, useSpring, useMotionTemplate } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faArrowDown, faTerminal, faDatabase, faChartLine, faCodeBranch } from "@fortawesome/free-solid-svg-icons";

/* ============================================================
   SMOOTH STAGGER ANIMATIONS
   ============================================================ */
const fadeUpVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

/* ============================================================
   RIGHT SIDE VISUAL: "THE SYSTEM"
   This replaces empty space with a high-end engineering visual.
   ============================================================ */
function SystemVisual() {
  return (
    <div className="relative h-[400px] w-full max-w-[500px] lg:h-[500px]">
      {/* Background Glow to make the UI pop */}
      <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/20 blur-[80px]" />

      {/* Main Glass Panel: Code/Terminal Interface */}
      <motion.div
        initial={{ opacity: 0, y: 40, rotateX: 10, rotateY: -10 }}
        animate={{ opacity: 1, y: 0, rotateX: 0, rotateY: 0 }}
        transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="glass-card absolute left-0 top-[10%] w-[85%] overflow-hidden p-0 shadow-2xl backdrop-blur-2xl"
        style={{ transformPerspective: 1000 }}
      >
        <div className="flex items-center gap-2 border-b px-4 py-3" style={{ borderColor: "var(--border)", background: "color-mix(in srgb, var(--surface-solid) 20%, transparent)" }}>
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <span className="ml-2 font-mono text-[10px] font-medium text-muted" style={{ color: "var(--text-muted)" }}>
            system_architecture.ts
          </span>
        </div>
        <div className="p-5 font-mono text-xs leading-relaxed sm:text-sm" style={{ color: "var(--text-secondary)" }}>
          <p><span style={{ color: "var(--accent)" }}>import</span> &#123; Pipeline &#125; <span style={{ color: "var(--accent)" }}>from</span> &apos;@core/data&apos;;</p>
          <p className="mt-2"><span style={{ color: "var(--accent)" }}>const</span> system = <span style={{ color: "var(--accent)" }}>new</span> Pipeline(&#123;</p>
          <p className="pl-4">frontend: <span style={{ color: "#34d399" }}>&apos;React&apos;</span>,</p>
          <p className="pl-4">backend: <span style={{ color: "#34d399" }}>&apos;Node.js & Flask&apos;</span>,</p>
          <p className="pl-4">database: <span style={{ color: "#34d399" }}>&apos;PostgreSQL&apos;</span>,</p>
          <p className="pl-4">analytics: <span style={{ color: "#34d399" }}>&apos;Power BI&apos;</span></p>
          <p>&#125;);</p>
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity }}
            className="mt-3 inline-block h-3.5 w-2" style={{ background: "var(--accent)" }} 
          />
        </div>
      </motion.div>

      {/* Floating Panel 1: Analytics/Chart */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="glass-card absolute bottom-[15%] right-0 flex w-[60%] flex-col gap-3 p-4 shadow-xl"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faChartLine} className="h-3 w-3" style={{ color: "var(--accent)" }} />
            <span className="font-mono text-[10px] uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Data Flow</span>
          </div>
          <span className="text-xs font-bold text-emerald-400">+98%</span>
        </div>
        <div className="flex items-end gap-1.5 pt-2">
          {[40, 70, 45, 90, 65, 100].map((height, i) => (
            <motion.div 
              key={i} 
              initial={{ height: 0 }} animate={{ height: `${height}%` }} transition={{ duration: 1, delay: 0.8 + (i * 0.1) }}
              className="w-full rounded-t-sm" style={{ background: i === 5 ? "var(--accent)" : "color-mix(in srgb, var(--accent) 20%, transparent)", minHeight: "4px" }} 
            />
          ))}
        </div>
      </motion.div>

      {/* Floating Panel 2: API Status Ping */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="glass-card absolute -right-[5%] top-[25%] flex items-center gap-3 rounded-full p-3 pr-5 shadow-lg"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full" style={{ background: "color-mix(in srgb, var(--color-success) 15%, transparent)" }}>
          <FontAwesomeIcon icon={faDatabase} className="h-3 w-3" style={{ color: "var(--color-success)" }} />
        </div>
        <div>
          <p className="font-mono text-[9px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Database Sync</p>
          <p className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>Connected &middot; 12ms</p>
        </div>
      </motion.div>
    </div>
  );
}

export default function Hero() {
  const containerRef = useRef(null);
  
  // Spotlight
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 40, damping: 20, mass: 0.5 });
  const smoothY = useSpring(mouseY, { stiffness: 40, damping: 20, mass: 0.5 });
  const spotlight = useMotionTemplate`radial-gradient(600px circle at ${smoothX}px ${smoothY}px, color-mix(in srgb, var(--accent) 5%, transparent), transparent 80%)`;

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <section
      id="hero"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative flex min-h-[100svh] items-center overflow-hidden px-6 pb-20 pt-32 md:px-12 md:pt-40"
    >
      {/* 1. BACKGROUND */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0 opacity-[0.15] dark:opacity-[0.25]"
          style={{
            backgroundImage: `linear-gradient(to right, var(--border-strong) 1px, transparent 1px), linear-gradient(to bottom, var(--border-strong) 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
            maskImage: "linear-gradient(to bottom, black 20%, transparent 95%)",
            WebkitMaskImage: "linear-gradient(to bottom, black 20%, transparent 95%)",
          }}
        />
        <motion.div className="absolute inset-0" style={{ background: spotlight }} />
      </div>

      {/* 2. MAIN CONTENT (Grid Layout: Text Left, System Visual Right) */}
      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
          
          {/* LEFT: THE PITCH */}
          <motion.div
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.1 } } }}
          >
            {/* Availability Badge */}
            <motion.div variants={fadeUpVariants} className="mb-6 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 backdrop-blur-md" style={{ borderColor: "var(--border)", background: "color-mix(in srgb, var(--surface) 40%, transparent)" }}>
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="font-mono text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--text-primary)" }}>
                Available for Roles & Freelance
              </span>
            </motion.div>

            {/* Premium Typography Headline */}
            <motion.h1 variants={fadeUpVariants} className="mb-6 font-bold tracking-tight" style={{ fontSize: "clamp(3rem, 7vw, 5.5rem)", lineHeight: 1.05 }}>
              <span className="block text-transparent bg-clip-text bg-gradient-to-br from-gray-900 to-gray-500 dark:from-white dark:to-gray-400">
                I build data-driven
              </span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-indigo-400 to-purple-500">
                systems & applications.
              </span>
            </motion.h1>

            {/* Subtext */}
            <motion.p variants={fadeUpVariants} className="mb-8 max-w-lg text-[15px] leading-[1.8] sm:text-[17px]" style={{ color: "var(--text-secondary)" }}>
              I turn fragmented workflows and raw data into robust full-stack solutions. Bridging engineering precision with modern software development to solve real operational bottlenecks.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={fadeUpVariants} className="flex flex-wrap items-center gap-4">
              <a href="#contact" className="group inline-flex h-12 items-center justify-center gap-2.5 rounded-full px-7 text-sm font-semibold transition-all duration-300 hover:scale-105" style={{ background: "var(--text-primary)", color: "var(--page-bg)", transform: "translateZ(0)", boxShadow: "0 10px 30px color-mix(in srgb, var(--text-primary) 20%, transparent)" }}>
                Start a project
                <FontAwesomeIcon icon={faArrowRight} className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
              <a href="#projects" className="inline-flex h-12 items-center justify-center rounded-full border px-7 text-sm font-semibold transition-all duration-300 hover:scale-105 hover:bg-white/5" style={{ borderColor: "var(--border)", background: "transparent", color: "var(--text-primary)", transform: "translateZ(0)" }}>
                <FontAwesomeIcon icon={faCodeBranch} className="mr-2 h-3.5 w-3.5" style={{ color: "var(--text-muted)" }}/>
                View architecture
              </a>
            </motion.div>
          </motion.div>

          {/* RIGHT: THE PROOF (Bionic System Visual) */}
          <div className="hidden lg:block">
            <SystemVisual />
          </div>

        </div>
      </div>

      {/* 3. BOTTOM TECH STRIP (Scroll Indicator) */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1.0 }} 
        className="absolute bottom-6 left-1/2 z-20 hidden w-[calc(100%-3rem)] max-w-7xl -translate-x-1/2 md:block"
      >
        <div className="flex items-center justify-between pt-5" style={{ borderTop: "1px solid var(--border)" }}>
          <div className="flex items-center gap-6 lg:gap-8">
            {["React", "Node.js", "Python", "PostgreSQL", "Power BI", "Automation"].map((tech) => (
              <span key={tech} className="font-mono text-[10px] uppercase tracking-[0.15em]" style={{ color: "var(--text-muted)" }}>{tech}</span>
            ))}
          </div>
          <a href="#about" className="group flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.1em] transition-colors duration-200" style={{ color: "var(--text-secondary)" }} onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")} onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}>
            Explore
            <FontAwesomeIcon icon={faArrowDown} className="h-3 w-3 transition-transform duration-300 group-hover:translate-y-1" />
          </a>
        </div>
      </motion.div>
    </section>
  );
}