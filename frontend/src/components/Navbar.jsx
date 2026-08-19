/**
 * Navbar.jsx
 *
 * Fixed issues:
 * 1. Hero section id mismatch — logo now scrolls to "hero" (not "top")
 *    Make sure Hero.jsx has id="hero" (not id="top")
 * 2. Active section highlighting — reliable IntersectionObserver
 * 3. text-background → text-white (that class doesn't exist in Tailwind)
 * 4. Race condition removed — observer solely controls activeSection
 * 5. Active pill is now glassmorphic (backdrop-blur + accent tint)
 * 6. rootMargin fixed so sections actually trigger on normal scroll
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faDownload, faXmark } from "@fortawesome/free-solid-svg-icons";
import ThemeToggle from "./ThemeToggle";

/* ============================================================
   NAV LINKS
   href must exactly match the section id in the DOM.
   "hero" → <section id="hero"> in Hero.jsx
   ============================================================ */
const NAV_LINKS = [
  { label: "About",      href: "about"      },
  { label: "Experience", href: "experience" },
  { label: "Projects",   href: "projects"   },
  { label: "Skills",     href: "skills"     },
  { label: "Contact",    href: "contact"    },
];

/* ============================================================
   COMPONENT
   ============================================================ */
export default function Navbar({ theme, toggleTheme }) {

  /* Whether user has scrolled past the initial snap point */
  const [isScrolled, setIsScrolled] = useState(false);

  /* Mobile menu open/closed */
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  /*
   * Active section id — drives the highlighted nav pill.
   * Default "hero" so the logo area is "active" on load.
   * Controlled ONLY by IntersectionObserver (no race condition).
   */
  const [activeSection, setActiveSection] = useState("hero");

  const navRef          = useRef(null);
  const mobileMenuRef   = useRef(null);
  const mobileButtonRef = useRef(null);

  /* ============================================================
     SCROLL TO SECTION
     Do NOT set activeSection here — let the observer do it.
     This avoids the race condition where manual set + observer
     set fight each other.
     ============================================================ */
  const scrollToSection = useCallback((id) => {
    const section = document.getElementById(id);

    if (!section) {
      console.warn(`[Navbar] Section not found: #${id}`);
      return;
    }

    section.scrollIntoView({ behavior: "smooth", block: "start" });
    setIsMobileMenuOpen(false);
  }, []);

  /* ============================================================
     SCROLL LISTENER — navbar glass pill on scroll
     ============================================================ */
  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 16);
    }

    /* Run immediately to catch pre-loaded scroll position */
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ============================================================
     INTERSECTION OBSERVER — active section detection
     
     Strategy:
     - Watch ALL sections with an id
     - On each update, collect all currently intersecting entries
     - Pick the one whose top is closest to the navbar bottom
     - This handles fast scrolling, tab switching, and load cases
     
     rootMargin "-10% 0px -85% 0px":
     - Top:    ignore top 10% (so navbar doesn't block detection)
     - Bottom: ignore bottom 85% (only top portion of viewport counts)
     - Result: whichever section's TOP is just below the navbar → active
     ============================================================ */
  useEffect(() => {
    /* Track ALL intersecting sections in a Map for stable lookup */
    const intersectingMap = new Map();

    const observer = new IntersectionObserver(
      (entries) => {
        /* Update our map with latest entry states */
        entries.forEach((entry) => {
          intersectingMap.set(entry.target.id, entry);
        });

        /* Among all currently intersecting, pick the one closest to top */
        let best = null;
        let bestTop = Infinity;

        intersectingMap.forEach((entry, id) => {
          if (!entry.isIntersecting) return;

          const top = Math.abs(entry.boundingClientRect.top);
          if (top < bestTop) {
            bestTop = top;
            best = id;
          }
        });

        if (best) setActiveSection(best);
      },
      {
        /*
         * rootMargin: top offset accounts for fixed navbar height (~80px).
         * -85% bottom means only the top 5% of viewport (below nav) triggers.
         * This makes "active" = "section whose header just passed the navbar".
         */
        rootMargin: "-10% 0px -85% 0px",
        threshold:  0,
      }
    );

    const sections = document.querySelectorAll("section[id]");
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  /* ============================================================
     BODY SCROLL LOCK when mobile menu is open
     ============================================================ */
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMobileMenuOpen]);

  /* ============================================================
     CLOSE MOBILE MENU on desktop resize
     ============================================================ */
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 768) setIsMobileMenuOpen(false);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* ============================================================
     ESCAPE KEY closes mobile menu
     ============================================================ */
  useEffect(() => {
    if (!isMobileMenuOpen) return;

    function handleEscape(e) {
      if (e.key === "Escape") setIsMobileMenuOpen(false);
    }

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isMobileMenuOpen]);

  /* ============================================================
     CLICK OUTSIDE closes mobile menu
     ============================================================ */
  useEffect(() => {
    function handleOutsideClick(e) {
      if (!isMobileMenuOpen) return;
      if (mobileMenuRef.current?.contains(e.target))   return;
      if (mobileButtonRef.current?.contains(e.target)) return;
      setIsMobileMenuOpen(false);
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isMobileMenuOpen]);

  /* ============================================================
     FOCUS TRAP inside mobile menu (accessibility)
     ============================================================ */
  useEffect(() => {
    if (!isMobileMenuOpen || !mobileMenuRef.current) return;

    const focusable = mobileMenuRef.current.querySelectorAll(
      'a, button, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusable.length) return;

    const first = focusable[0];
    const last  = focusable[focusable.length - 1];

    /* Focus first element when menu opens */
    first.focus();

    function trapFocus(e) {
      if (e.key !== "Tab") return;

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
      if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", trapFocus);
    return () => document.removeEventListener("keydown", trapFocus);
  }, [isMobileMenuOpen]);

  /* ============================================================
     HELPER — is a nav link "active"?
     "projects" is also active when user is in "platforms-built" section
     ============================================================ */
  const isLinkActive = useCallback((linkHref) => {
    if (activeSection === linkHref) return true;
    /* platforms-built sits between projects & skills — count it as projects */
    if (linkHref === "projects" && activeSection === "platforms-built") return true;
    return false;
  }, [activeSection]);

  /* ============================================================
     RENDER
     ============================================================ */
  return (
    <header
      className="
        fixed inset-x-0 top-0 z-50
        flex justify-center
        px-4 pt-4
        pointer-events-none
      "
    >
      {/* ===========================================================
          MAIN NAV BAR
          =========================================================== */}
      <motion.div
        ref={navRef}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0,   opacity: 1 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className={`
          pointer-events-auto
          flex w-full max-w-6xl
          items-center justify-between
          rounded-full
          px-4 py-2.5
          transition-all duration-300
          ${isScrolled
            ? "glass-nav-pill"
            : "border border-transparent bg-transparent"
          }
        `}
      >
        {/* ---------------------------------------------------------
            LOGO — scrolls to hero section
            "hero" must match id="hero" in Hero.jsx
            --------------------------------------------------------- */}
        <button
          type="button"
          onClick={() => scrollToSection("hero")}
          aria-label="Scroll to top"
          className="
            rounded-full px-2 py-2
            font-heading text-lg font-bold tracking-wide
            transition-all duration-300
            hover:-translate-y-0.5 hover:text-accent
            focus-visible:outline-none
          "
          style={{ color: "var(--text-primary)" }}
        >
          SKAND
        </button>

        {/* ---------------------------------------------------------
            DESKTOP NAV
            --------------------------------------------------------- */}
        <nav
          aria-label="Primary Navigation"
          className="hidden items-center gap-1 md:flex"
        >
          {NAV_LINKS.map((link) => {
            const isActive = isLinkActive(link.href);

            return (
              <button
                key={link.href}
                type="button"
                onClick={() => scrollToSection(link.href)}
                aria-current={isActive ? "location" : undefined}
                className="
                  relative isolate
                  overflow-hidden
                  rounded-full px-4 py-2
                  text-sm font-medium
                  transition-colors duration-200
                  focus-visible:outline-none
                "
              >
                {/* -----------------------------------------------
                    GLASS ACTIVE PILL
                    
                    layoutId="nav-pill" makes Framer Motion smoothly
                    animate the pill sliding between nav items.
                    
                    Glass treatment:
                    - bg-accent/20    → translucent accent tint
                    - backdrop-blur   → frosted glass effect
                    - border          → subtle accent border
                    - ring            → inner highlight
                    ----------------------------------------------- */}
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    transition={{
                      type:      "spring",
                      stiffness: 450,
                      damping:   36,
                    }}
                    className="
                      absolute inset-0
                      rounded-full
                      border border-accent/30
                      ring-1 ring-white/15
                    "
                    style={{
                      /*
                       * Glass pill:
                       * Light mode → accent/15 tint + blur
                       * Dark mode  → slightly stronger tint
                       * backdrop-filter via inline style so it always works
                       * regardless of Tailwind's purge of arbitrary values
                       */
                      background: "color-mix(in srgb, var(--accent) 18%, transparent)",
                      backdropFilter: "blur(12px) saturate(150%)",
                      WebkitBackdropFilter: "blur(12px) saturate(150%)",
                      boxShadow: "0 2px 12px color-mix(in srgb, var(--accent) 20%, transparent), inset 0 1px 0 rgba(255,255,255,0.15)",
                    }}
                  />
                )}

                {/* Label — white when active (on the colored pill) */}
                <span
                  className={`
                    relative z-10
                    transition-colors duration-200
                    ${isActive
                      ? "font-semibold text-white"
                      : "text-secondary hover:text-primary"
                    }
                  `}
                  style={isActive ? { color: "var(--accent)" } : {}}
                >
                  {link.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* ---------------------------------------------------------
            RIGHT CONTROLS — theme toggle + resume button
            --------------------------------------------------------- */}
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />

          <a
            href="/resume.pdf"
            download
            className="btn-primary hidden md:inline-flex"
          >
            <FontAwesomeIcon icon={faDownload} aria-hidden="true" />
            Resume
          </a>

          {/* Hamburger — mobile only */}
          <button
            ref={mobileButtonRef}
            type="button"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            className="
              flex h-10 w-10 items-center justify-center
              rounded-full glass-nav-pill
              md:hidden
              transition-all duration-200
              hover:border-accent/30
            "
          >
            <motion.div
              animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <FontAwesomeIcon
                icon={isMobileMenuOpen ? faXmark : faBars}
                style={{ color: "var(--text-primary)" }}
              />
            </motion.div>
          </button>
        </div>
      </motion.div>

      {/* =============================================================
          MOBILE MENU
          ============================================================= */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            ref={mobileMenuRef}
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0,   scale: 1    }}
            exit={{    opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="
              pointer-events-auto
              absolute left-4 right-4 top-20
              md:hidden
            "
          >
            <div className="glass-card rounded-3xl p-4">
              <nav
                aria-label="Mobile Navigation"
                className="flex flex-col gap-1"
              >
                {NAV_LINKS.map((link) => {
                  const isActive = isLinkActive(link.href);

                  return (
                    <button
                      key={link.href}
                      type="button"
                      onClick={() => scrollToSection(link.href)}
                      aria-current={isActive ? "location" : undefined}
                      className={`
                        flex items-center justify-between
                        rounded-2xl px-4 py-3
                        text-sm font-medium
                        transition-all duration-200
                        ${isActive
                          ? "bg-accent/10 text-accent"
                          : "hover:bg-accent/5 hover:text-accent"
                        }
                      `}
                      style={!isActive ? { color: "var(--text-secondary)" } : {}}
                    >
                      <span>{link.label}</span>

                      {/* Active dot indicator */}
                      {isActive && (
                        <motion.span
                          layoutId="mobile-active-dot"
                          className="h-2 w-2 rounded-full bg-accent"
                          transition={{
                            type:      "spring",
                            stiffness: 420,
                            damping:   32,
                          }}
                        />
                      )}
                    </button>
                  );
                })}

                {/* Divider */}
                <div className="my-2 h-px bg-current/10" />

                {/* Resume button */}
                <a
                  href="/resume.pdf"
                  download
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="btn-primary w-full justify-center"
                >
                  <FontAwesomeIcon icon={faDownload} aria-hidden="true" />
                  Resume
                </a>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}