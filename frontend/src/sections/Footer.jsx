// Footer.jsx - With Live Time & Rocket Launch Easter Eggs
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faArrowUp, faEnvelope, faRocket } from "@fortawesome/free-solid-svg-icons";

const BRAND_CONFIG = { name: "SKAND AHUJA", tagline: ["Engineering.", "Data.", "Software."], subline: "Building systems that solve real operational problems.", logoHref: "#hero" };
const NAV_LINKS = [{ label: "About", href: "#about" }, { label: "Experience", href: "#experience" }, { label: "Projects", href: "#projects" }, { label: "Skills", href: "#skills" }, { label: "Contact", href: "#contact" }];
const SOCIAL_LINKS = [{ id: "linkedin", icon: faLinkedin, href: "https://linkedin.com/in/skand-ahuja", label: "LinkedIn" }, { id: "github", icon: faGithub, href: "https://github.com/skand-ahuja", label: "GitHub" }, { id: "email", icon: faEnvelope, href: "mailto:your@email.com", label: "Email" }];
const fadeUp = (delay = 0) => ({ initial: { opacity: 0, y: 12 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.45, delay } });

// 🍏 EASTER EGG 1: Live Local Time Clock
function LiveTime() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const update = () => setTime(new Date().toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit" }));
    update();
    const int = setInterval(update, 1000);
    return () => clearInterval(int);
  }, []);
  return (
    <div className="flex items-center gap-2 mt-4">
      <span className="relative flex h-1.5 w-1.5"><span className="absolute h-full w-full animate-ping rounded-full bg-[var(--color-warning)] opacity-75" /><span className="relative h-1.5 w-1.5 rounded-full bg-[var(--color-warning)]" /></span>
      <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)]">New Delhi: <span className="text-[var(--text-primary)] font-semibold">{time} IST</span></span>
    </div>
  );
}

// 🍏 EASTER EGG 2: Rocket Launch Animation
function BackToTopButton() {
  const [hovered, setHovered] = useState(false);
  const [launching, setLaunching] = useState(false);

  const handleClick = () => {
    setLaunching(true);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => setLaunching(false), 500); // Reset after landing
    }, 400); // Wait for rocket to fly up before scrolling
  };

  return (
    <button onClick={handleClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} className="mt-8 flex h-10 items-center justify-center gap-2.5 rounded-full border px-5 text-[11px] font-semibold uppercase tracking-widest transition-all duration-300" style={{ borderColor: hovered ? "color-mix(in srgb, var(--accent) 30%, transparent)" : "var(--border)", background: hovered ? "color-mix(in srgb, var(--accent) 10%, transparent)" : "transparent", color: hovered ? "var(--accent)" : "var(--text-secondary)" }}>
      <motion.span animate={launching ? { y: -50, opacity: 0 } : { y: hovered ? -2 : 0, opacity: 1 }} transition={{ duration: launching ? 0.4 : 0.2 }}>
        <FontAwesomeIcon icon={launching ? faRocket : faArrowUp} className="h-3 w-3" />
      </motion.span>
      Back to top
    </button>
  );
}

export default function Footer() {
  return (
    <footer className="px-6 pb-8 md:px-12 md:pb-10">
      <div className="mx-auto max-w-6xl">
        <div className="glass-card rounded-[2rem] p-8 shadow-sm md:p-10 lg:p-12">
          <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
            <motion.div {...fadeUp(0)}>
              <a href={BRAND_CONFIG.logoHref} className="font-mono text-2xl font-bold tracking-tighter text-[var(--text-primary)]"><span className="text-[var(--accent)]">&gt;</span>{BRAND_CONFIG.name}</a>
              <p className="mt-4 max-w-sm text-[14px] leading-relaxed text-[var(--text-secondary)]">{BRAND_CONFIG.tagline.join(" ")}</p>
              <p className="mt-4 max-w-sm text-[13px] leading-relaxed text-[var(--text-muted)]">{BRAND_CONFIG.subline}</p>
              <LiveTime />
            </motion.div>
            <motion.div {...fadeUp(0.05)}>
              <p className="mb-5 font-mono text-[10px] font-semibold uppercase tracking-widest text-[var(--accent)]">Navigation</p>
              <ul className="space-y-3">{NAV_LINKS.map((l) => <li key={l.href}><a href={l.href} className="text-[13.5px] font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--accent)]">{l.label}</a></li>)}</ul>
            </motion.div>
            <motion.div {...fadeUp(0.10)}>
              <p className="mb-5 font-mono text-[10px] font-semibold uppercase tracking-widest text-[var(--accent)]">Connect</p>
              <div className="flex flex-wrap gap-3">
                {SOCIAL_LINKS.map((s) => (
                  <motion.a key={s.id} href={s.href} target={s.id === "email" ? undefined : "_blank"} rel="noreferrer" whileTap={{ scale: 0.95 }} className="group flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[color-mix(in_srgb,var(--surface-solid)_20%,transparent)] text-[var(--text-secondary)] transition-all hover:-translate-y-1 hover:border-[color-mix(in_srgb,var(--accent)_30%,transparent)] hover:bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] hover:text-[var(--accent)]"><FontAwesomeIcon icon={s.icon} className="h-4 w-4" /></motion.a>
                ))}
              </div>
              <BackToTopButton />
            </motion.div>
          </div>
          <div className="mt-12 flex flex-col items-center justify-between border-t border-[var(--border)] pt-6 sm:flex-row">
            <p className="text-[11px] text-[var(--text-muted)]">&copy; {new Date().getFullYear()} Skand Ahuja.</p>
            <p className="font-mono text-[9px] uppercase tracking-widest text-[var(--text-muted)]">React &middot; Tailwind &middot; Motion</p>
          </div>
        </div>
      </div>
    </footer>
  );
}