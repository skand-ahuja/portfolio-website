import { useEffect, useRef, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faDownload, faXmark } from "@fortawesome/free-solid-svg-icons";
import ThemeToggle from "./ThemeToggle";

const NAV_LINKS = [{ label: "About", href: "about" }, { label: "Experience", href: "experience" }, { label: "Projects", href: "projects" }, { label: "Skills", href: "skills" }, { label: "Contact", href: "contact" }];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  const scrollToSection = useCallback((id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setIsMobileMenuOpen(false);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.find(e => e.isIntersecting);
      if (visible) setActiveSection(visible.target.id);
    }, { rootMargin: "-10% 0px -85% 0px", threshold: 0 });
    document.querySelectorAll("section[id]").forEach(s => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const isLinkActive = useCallback((href) => activeSection === href || (href === "projects" && activeSection === "platforms-built"), [activeSection]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 pointer-events-none">
      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className={`pointer-events-auto flex w-full max-w-5xl items-center justify-between rounded-full px-4 py-3 transition-all duration-400 ${isScrolled ? "glass-nav-pill" : "bg-transparent"}`}>
        <button onClick={() => scrollToSection("hero")} className="font-mono text-[13px] font-bold uppercase tracking-widest text-[var(--text-primary)] transition-colors hover:text-[var(--accent)] outline-none">&gt; SA.</button>
        
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => {
            const isActive = isLinkActive(link.href);
            return (
              <button key={link.href} onClick={() => scrollToSection(link.href)} className="relative rounded-full px-4 py-1.5 text-[13px] font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)] outline-none">
                {isActive && <motion.div layoutId="nav-pill" transition={{ type: "spring", stiffness: 400, damping: 30 }} className="absolute inset-0 rounded-full border border-[var(--border)] bg-[color-mix(in_srgb,var(--accent)_8%,transparent)]" />}
                <span className="relative z-10" style={{ color: isActive ? "var(--text-primary)" : "inherit" }}>{link.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <a href="/Skand_Ahuja_Resume.pdf" download className="btn-primary hidden h-9 text-[12px] md:inline-flex"><FontAwesomeIcon icon={faDownload} /> Resume</a>
          <button onClick={() => setIsMobileMenuOpen(o => !o)} className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface-solid)] md:hidden"><FontAwesomeIcon icon={isMobileMenuOpen ? faXmark : faBars} className="text-[var(--text-primary)]" /></button>
        </div>
      </motion.div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="pointer-events-auto absolute left-4 right-4 top-20 z-40 rounded-3xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--surface-solid)_80%,transparent)] p-4 shadow-2xl backdrop-blur-2xl md:hidden">
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((l) => (<button key={l.href} onClick={() => scrollToSection(l.href)} className={`rounded-xl px-4 py-3 text-left text-sm font-medium ${isLinkActive(l.href) ? "bg-[var(--accent)] text-white" : "text-[var(--text-secondary)]"}`}>{l.label}</button>))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}