/**
 * Hero.jsx
 *
 * Fixes applied:
 * 1. id="top" → id="hero" (matches Navbar IntersectionObserver)
 * 2. hover:bg-accent-hover → inline style (CSS var, not Tailwind class)
 * 3. Bottom strip <a> moved out of pointer-events-none wrapper
 * 4. `loaded` state replaced with direct Framer Motion animate
 * 5. Headline rewritten for recruiter/client impact
 * 6. CTA hierarchy improved — primary vs secondary clearer
 * 7. Availability badge made more premium
 * 8. Social links kept + email added
 * 9. All grid/orbit/node animations preserved + improved
 */

import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDown,
  faArrowRight,
  faCode,
  faDatabase,
  faChartLine,
  faGear,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";

/* ============================================================
   FLOATING SYSTEM NODES
   These appear on the right side on desktop — they show
   WHAT you build, visually reinforcing the headline.
   ============================================================ */
const SYSTEM_NODES = [
  { id: "frontend",  label: "Frontend",  icon: faCode,      x: "78%", y: "22%" },
  { id: "backend",   label: "Backend",   icon: faGear,      x: "88%", y: "42%" },
  { id: "database",  label: "Database",  icon: faDatabase,  x: "74%", y: "62%" },
  { id: "analytics", label: "Analytics", icon: faChartLine, x: "91%", y: "76%" },
];

/* ============================================================
   STAGGER ANIMATION VARIANTS
   Each child staggers in sequence — feels polished & deliberate
   ============================================================ */
const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren:   0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  show:   {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  },
};

/* slightly faster for small decorative elements */
const fastItem = {
  hidden: { opacity: 0, y: 10 },
  show:   {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  },
};

/* ============================================================
   INTERACTIVE BACKGROUND
   Grid + ambient glow + mouse-follow glow + orbits + SVG lines
   ============================================================ */
function HeroBackground() {
  const containerRef = useRef(null);

  /* Spring-smoothed mouse position for the glow blob */
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const glowX = useSpring(mouseX, { stiffness: 80, damping: 25, mass: 0.5 });
  const glowY = useSpring(mouseY, { stiffness: 80, damping: 25, mass: 0.5 });

  function handleMouseMove(e) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      aria-hidden="true"
      className="pointer-events-auto absolute inset-0 overflow-hidden"
    >
      {/* ----------------------------------------------------------
          BASE DOT/GRID PATTERN
          Kept from original — professional tech feel
          ---------------------------------------------------------- */}
      <div
        className="absolute inset-0 opacity-[0.28] dark:opacity-[0.12]"
        style={{
          backgroundImage: `
            linear-gradient(to right,  rgba(99,102,241,0.12) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(99,102,241,0.12) 1px, transparent 1px)
          `,
          backgroundSize:    "64px 64px",
          maskImage:         "linear-gradient(to bottom, black 10%, transparent 95%)",
          WebkitMaskImage:   "linear-gradient(to bottom, black 10%, transparent 95%)",
        }}
      />

      {/* ----------------------------------------------------------
          STATIC AMBIENT GLOWS
          ---------------------------------------------------------- */}
      <div className="
        absolute -right-40 top-10
        h-[650px] w-[650px] rounded-full
        bg-indigo-500/[0.08] dark:bg-indigo-500/[0.10]
        blur-[130px]
      " />

      <div className="
        absolute -left-48 bottom-0
        h-[450px] w-[450px] rounded-full
        bg-indigo-400/[0.05]
        blur-[120px]
      " />

      {/* ----------------------------------------------------------
          MOUSE-FOLLOW GLOW (desktop only)
          ---------------------------------------------------------- */}
      <motion.div
        className="
          absolute hidden lg:block
          h-[400px] w-[400px] rounded-full
          -translate-x-1/2 -translate-y-1/2
          bg-indigo-500/[0.07] dark:bg-indigo-400/[0.08]
          blur-[90px]
          pointer-events-none
        "
        style={{ x: glowX, y: glowY }}
      />

      {/* ----------------------------------------------------------
          ROTATING ORBIT RINGS (desktop only)
          Kept from original — they add depth without distraction
          ---------------------------------------------------------- */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        className="
          absolute right-[3%] top-[8%] hidden lg:block
          h-[560px] w-[560px] rounded-full
          border border-indigo-500/[0.08] dark:border-indigo-400/[0.08]
        "
      >
        <span className="
          absolute left-1/2 top-[-4px]
          h-2 w-2 -translate-x-1/2 rounded-full
          bg-indigo-500/50
        " />
      </motion.div>

      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 38, repeat: Infinity, ease: "linear" }}
        className="
          absolute right-[9%] top-[17%] hidden lg:block
          h-[390px] w-[390px] rounded-full
          border border-indigo-500/[0.08] dark:border-indigo-400/[0.08]
        "
      >
        <span className="
          absolute bottom-[18%] right-[2%]
          h-1.5 w-1.5 rounded-full
          bg-indigo-400/60
        " />
      </motion.div>

      {/* ----------------------------------------------------------
          SVG CONNECTION LINES + DATA PULSE
          Visual metaphor: center node connects to all skill areas
          ---------------------------------------------------------- */}
      <svg
        viewBox="0 0 1000 800"
        preserveAspectRatio="none"
        className="absolute inset-0 hidden lg:block h-full w-full"
      >
        <defs>
          <linearGradient id="hero-line-gradient" x1="0" x2="1">
            <stop offset="0%"   stopColor="#6366f1" stopOpacity="0"    />
            <stop offset="45%"  stopColor="#6366f1" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#818cf8" stopOpacity="0.08" />
          </linearGradient>
        </defs>

        {/* Line to Frontend node */}
        <motion.path
          d="M 570 400 C 650 400, 690 180, 780 180"
          fill="none" stroke="url(#hero-line-gradient)" strokeWidth="1"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.4, delay: 0.8 }}
        />

        {/* Line to Backend node */}
        <motion.path
          d="M 570 400 C 680 400, 760 360, 880 360"
          fill="none" stroke="url(#hero-line-gradient)" strokeWidth="1"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.4, delay: 1.0 }}
        />

        {/* Line to Database node */}
        <motion.path
          d="M 570 400 C 660 430, 680 550, 750 550"
          fill="none" stroke="url(#hero-line-gradient)" strokeWidth="1"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.4, delay: 1.2 }}
        />

        {/* Line to Analytics node */}
        <motion.path
          d="M 750 550 C 830 550, 850 650, 920 650"
          fill="none" stroke="url(#hero-line-gradient)" strokeWidth="1"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.4 }}
        />

        {/* Animated data pulse traveling along the first line */}
        <motion.circle
          r="3" fill="#818cf8"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{ duration: 3, repeat: Infinity, delay: 2 }}
        >
          <animateMotion
            dur="3s"
            repeatCount="indefinite"
            path="M 570 400 C 650 400, 690 180, 780 180"
          />
        </motion.circle>

        {/* Second pulse on Database line */}
        <motion.circle
          r="2.5" fill="#a5b4fc"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.8, 0.8, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, delay: 3.2 }}
        >
          <animateMotion
            dur="3.5s"
            repeatCount="indefinite"
            path="M 570 400 C 660 430, 680 550, 750 550"
          />
        </motion.circle>
      </svg>

      {/* ----------------------------------------------------------
          FLOATING SKILL NODES (desktop only)
          Each floats independently — subtle life in the background
          ---------------------------------------------------------- */}
      {SYSTEM_NODES.map((node, index) => (
        <motion.div
          key={node.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: [0, -6, 0],
          }}
          transition={{
            opacity: { duration: 0.5, delay: 1   + index * 0.15 },
            scale:   { duration: 0.5, delay: 1   + index * 0.15 },
            y:       { duration: 4   + index * 0.6, repeat: Infinity, ease: "easeInOut" },
          }}
          style={{ left: node.x, top: node.y }}
          className="
            glass-card absolute hidden lg:flex
            -translate-x-1/2 -translate-y-1/2
            items-center gap-2
            rounded-full px-3 py-2
          "
        >
          <span className="
            flex h-6 w-6 items-center justify-center
            rounded-full bg-accent/10
            text-accent
          ">
            <FontAwesomeIcon icon={node.icon} className="h-2.5 w-2.5" />
          </span>
          <span
            className="font-mono-tag text-[10px] font-medium"
            style={{ color: "var(--text-secondary)" }}
          >
            {node.label}
          </span>
        </motion.div>
      ))}

      {/* ----------------------------------------------------------
          CENTRAL HUB NODE — the "you" in the system diagram
          ---------------------------------------------------------- */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="
          absolute left-[57%] top-1/2 hidden lg:block
          -translate-x-1/2 -translate-y-1/2
        "
      >
        <motion.div
          animate={{
            boxShadow: [
              "0 0 0 0px rgba(99,102,241,0.15)",
              "0 0 0 18px rgba(99,102,241,0)",
              "0 0 0 0px rgba(99,102,241,0)",
            ],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
          className="
            flex h-16 w-16 items-center justify-center
            rounded-2xl
            border border-accent/20 bg-accent/10
            text-accent backdrop-blur-md
          "
        >
          <FontAwesomeIcon icon={faCode} className="h-5 w-5" />
        </motion.div>
      </motion.div>

      {/* Fade gradient into next section */}
      <div className="
        absolute bottom-0 left-0 right-0 h-40
        bg-gradient-to-b from-transparent to-[var(--page-bg)]
      " />
    </div>
  );
}

/* ============================================================
   HERO — MAIN COMPONENT
   ============================================================ */
export default function Hero() {
  return (
    /*
     * id="hero" — CRITICAL: must match Navbar's scrollToSection("hero")
     * and IntersectionObserver watches section[id]
     * Previously was id="top" which broke active highlighting
     */
    <section
      id="hero"
      className="
        relative flex min-h-[100svh] items-center
        overflow-hidden
        px-6 pb-16 pt-28
        md:px-12 md:pb-20 md:pt-32
      "
    >
      <HeroBackground />

      {/* ============================================================
          CONTENT — staggered entrance via containerVariants
          pointer-events-none on wrapper, restored on interactive els
          ============================================================ */}
      <div className="
        pointer-events-none relative z-10
        mx-auto w-full max-w-6xl
      ">
        <motion.div
          className="max-w-4xl lg:max-w-[680px]"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >

          {/* ----------------------------------------------------------
              AVAILABILITY BADGE
              Small, premium, not shouting — shows confidence
              ---------------------------------------------------------- */}
          <motion.div
            variants={fastItem}
            className="pointer-events-auto mb-8 inline-flex items-center gap-3"
          >
            {/* Pulsing green dot */}
            <span className="relative flex h-2 w-2">
              <span className="
                absolute inline-flex h-full w-full
                animate-ping rounded-full
                bg-emerald-400 opacity-75
              " />
              <span className="
                relative inline-flex h-2 w-2
                rounded-full bg-emerald-500
              " />
            </span>

            {/* Badge pill */}
            <span
              className="
                font-mono-tag text-[10px] font-semibold uppercase tracking-[0.18em]
                rounded-full border px-3 py-1.5
              "
              style={{
                color:           "var(--text-secondary)",
                borderColor:     "var(--border)",
                background:      "var(--surface)",
                backdropFilter:  "blur(8px)",
              }}
            >
              Open to opportunities
            </span>
          </motion.div>

          {/* ----------------------------------------------------------
              GREETING LINE
              ---------------------------------------------------------- */}
          <motion.p
            variants={itemVariants}
            className="mb-3 text-base font-medium sm:text-lg"
            style={{ color: "var(--text-secondary)" }}
          >
            Hi, I&apos;m{" "}
            <span className="font-semibold" style={{ color: "var(--text-primary)" }}>
              Skand Ahuja
            </span>
            .
          </motion.p>

          {/* ----------------------------------------------------------
              MAIN HEADLINE
              
              Story it tells:
              Line 1 — I TURN   → active verb, you're doing something
              Line 2 — PROBLEMS → relatable, every recruiter/client has them
              Line 3 — INTO SYSTEMS → outcome, the value proposition
              
              The gradient on line 3 draws the eye to the payoff.
              This works for: recruiters (impact), clients (solution),
              and freelancers (clear offer).
              ---------------------------------------------------------- */}
          <motion.h1
            variants={itemVariants}
            className="
              mb-6 font-bold
              text-[clamp(3rem,8.5vw,6.8rem)]
              leading-[0.90] tracking-[-0.055em]
            "
            style={{ color: "var(--text-primary)" }}
          >
            <span className="block">I TURN</span>
            <span className="block">PROBLEMS</span>
            <span
              className="block bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-500 bg-clip-text text-transparent dark:from-indigo-300 dark:via-indigo-400 dark:to-violet-400"
            >
              INTO SYSTEMS.
            </span>
          </motion.h1>

          {/* ----------------------------------------------------------
              ROLE TAGS
              3 disciplines shown as mono tags — quickly scannable
              ---------------------------------------------------------- */}
          <motion.div
            variants={fastItem}
            className="mb-5 flex flex-wrap items-center gap-x-3 gap-y-2"
          >
            {["Full-Stack Dev", "Data Analytics", "Automation"].map((role, i) => (
              <div key={role} className="flex items-center gap-3">
                {i > 0 && (
                  <span
                    className="hidden h-1 w-1 rounded-full sm:block"
                    style={{ background: "color-mix(in srgb, var(--accent) 50%, transparent)" }}
                  />
                )}
                <span
                  className="font-mono-tag text-xs font-semibold sm:text-sm"
                  style={{ color: "var(--accent)" }}
                >
                  {role}
                </span>
              </div>
            ))}
          </motion.div>

          {/* ----------------------------------------------------------
              DESCRIPTION
              
              3 sentences, each speaks to a different reader:
              - "web applications" → recruiter looking for dev
              - "automated workflows" → client with manual process pain
              - "engineering background" → differentiator from pure devs
              ---------------------------------------------------------- */}
          <motion.p
            variants={itemVariants}
            className="mb-9 max-w-lg text-base leading-[1.75] sm:text-[1.0625rem]"
            style={{ color: "var(--text-secondary)" }}
          >
            I build full-stack web applications, Power BI dashboards,
            and automated workflows — bridging an engineering background
            with data and software to solve real operational problems.
          </motion.p>

          {/* ----------------------------------------------------------
              CTA BUTTONS
              Primary: Contact (highest intent action for recruiter/client)
              Secondary: View Projects (portfolio proof for skeptics)
              ---------------------------------------------------------- */}
          <motion.div
            variants={fastItem}
            className="pointer-events-auto mb-10 flex flex-wrap items-center gap-3"
          >
            {/* Primary CTA */}
            <a
              href="#contact"
              className="
                group inline-flex h-12 items-center justify-center gap-3
                rounded-full px-6
                text-sm font-semibold text-white
                shadow-md
                transition-all duration-200
                hover:-translate-y-0.5 hover:shadow-lg
              "
              style={{
                background: "var(--accent)", color: "#ffffff",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--accent-hover)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--accent)";
              }}
            >
              Let&apos;s work together
              <FontAwesomeIcon
                icon={faArrowRight}
                className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-1"
              />
            </a>

            {/* Secondary CTA */}
            <a
              href="#projects"
              className="
                inline-flex h-12 items-center justify-center
                rounded-full border px-6
                text-sm font-semibold
                backdrop-blur-md
                transition-all duration-200
                hover:-translate-y-0.5 hover:bg-accent/5 hover:text-accent
              "
              style={{
                borderColor: "var(--border)",
                background:  "color-mix(in srgb, var(--surface-solid) 25%, transparent)",
                color:       "var(--text-primary)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--border-strong)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
              }}
            >
              See my work
            </a>
          </motion.div>

          {/* ----------------------------------------------------------
              SOCIAL LINKS
              ---------------------------------------------------------- */}
          <motion.div
            variants={fastItem}
            className="pointer-events-auto flex items-center gap-4"
          >
            <span
              className="font-mono-tag text-[10px] uppercase tracking-widest"
              style={{ color: "var(--text-muted)" }}
            >
              Find me
            </span>

            <span
              className="h-px w-5"
              style={{ background: "var(--border)" }}
            />

            {[
              { href: "https://github.com/skand-ahuja",   icon: faGithub,   label: "GitHub"   },
              { href: "https://linkedin.com/in/skand-ahuja", icon: faLinkedin, label: "LinkedIn" },
              { href: "mailto:your@email.com",             icon: faEnvelope, label: "Email"    },
            ].map((social) => (
              <a
                key={social.label}
                href={social.href}
                target={social.href.startsWith("mailto") ? undefined : "_blank"}
                rel={social.href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                aria-label={social.label}
                className="
                  transition-all duration-200
                  hover:-translate-y-0.5 hover:text-accent
                "
                style={{ color: "var(--text-secondary)" }}
              >
                <FontAwesomeIcon icon={social.icon} className="h-5 w-5" />
              </a>
            ))}
          </motion.div>

        </motion.div>
      </div>

      {/* ============================================================
          BOTTOM TECH STRIP + SCROLL CTA
          pointer-events-auto restored here since wrapper is none
          ============================================================ */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.0 }}
        className="
          pointer-events-auto
          absolute bottom-5 left-1/2 z-20 hidden md:block
          w-[calc(100%-3rem)] max-w-6xl
          -translate-x-1/2
        "
      >
        <div
          className="flex items-center justify-between pt-4"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          {/* Tech stack labels */}
          <div className="flex items-center gap-5 lg:gap-7">
            {["React", "Node.js", "Python", "SQL", "Power BI", "Automation"].map((tech) => (
              <span
                key={tech}
                className="font-mono-tag text-[10px] uppercase tracking-[0.12em]"
                style={{ color: "var(--text-muted)" }}
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Scroll down CTA — pointer-events-auto since parent is auto */}
          <a
            href="#about"
            className="
              flex items-center gap-2 text-xs font-medium
              transition-colors duration-200 hover:text-accent
            "
            style={{ color: "var(--text-secondary)" }}
          >
            Explore
            <motion.span
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            >
              <FontAwesomeIcon icon={faArrowDown} className="h-3 w-3" />
            </motion.span>
          </a>
        </div>
      </motion.div>
    </section>
  );
}