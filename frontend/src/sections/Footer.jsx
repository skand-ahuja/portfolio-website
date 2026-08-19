/**
 * Footer.jsx
 *
 * Site footer with brand, navigation, social links and back-to-top.
 *
 * FUTURE-PROOFING GUIDE:
 * ──────────────────────
 * 1. To ADD a nav link    → add object to NAV_LINKS array
 * 2. To ADD a social link → add object to SOCIAL_LINKS array
 * 3. To CHANGE brand text → edit BRAND_CONFIG
 * 4. To CHANGE email      → edit SOCIAL_LINKS email href
 * 5. Glass card wraps the entire footer content — consistent with
 *    the glass system in index.css (Tier 2)
 *
 * Fixes applied:
 * 1. hover:text-accent, hover:bg-accent/10, hover:border-accent/30
 *    → onMouseEnter/Leave with CSS vars (Tailwind hover unreliable)
 * 2. border-current/10, bg-current/[0.03] → var(--border) + color-mix()
 * 3. text-primary/secondary/muted/accent → inline CSS var styles
 * 4. glass-card + duplicate border → removed extra border class
 * 5. Nav link hover → SocialIconLink component with useState
 * 6. Social icons → SocialIconLink with proper CSS var hover
 * 7. Back-to-top → BackToTop component with useState hover
 * 8. BRAND_CONFIG for easy brand text updates
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faArrowUp, faEnvelope } from "@fortawesome/free-solid-svg-icons";

/* ============================================================
   BRAND CONFIG
   ============================================================ */
const BRAND_CONFIG = {
  name:     "SKAND",
  tagline:  ["Engineering.", "Data.", "Software."],
  subline:  "Building systems that solve real operational problems.",
  logoHref: "#hero",
};

/* ============================================================
   NAV LINKS
   ============================================================ */
const NAV_LINKS = [
  { label: "About",      href: "#about"      },
  { label: "Experience", href: "#experience" },
  { label: "Projects",   href: "#projects"   },
  { label: "Skills",     href: "#skills"     },
  { label: "Contact",    href: "#contact"    },
  /* ── ADD MORE NAV LINKS HERE ──────────────────────────────
  { label: "Blog",  href: "#blog"  },
  ─────────────────────────────────────────────────────────── */
];

/* ============================================================
   SOCIAL LINKS
   id: "email" gets special treatment (no target="_blank")
   ============================================================ */
const SOCIAL_LINKS = [
  {
    id:    "linkedin",
    icon:  faLinkedin,
    href:  "https://linkedin.com/in/skand-ahuja",
    label: "LinkedIn",
  },
  {
    id:    "github",
    icon:  faGithub,
    href:  "https://github.com/skand-ahuja",
    label: "GitHub",
  },
  {
    id:    "email",
    icon:  faEnvelope,
    href:  "mailto:your@email.com",   /* ← Update this */
    label: "Email",
  },
  /* ── ADD MORE SOCIAL LINKS HERE ───────────────────────────
  {
    id:    "twitter",
    icon:  faXTwitter,   // import from free-brands-svg-icons
    href:  "https://x.com/yourusername",
    label: "X / Twitter",
  },
  ─────────────────────────────────────────────────────────── */
];

/* ============================================================
   ANIMATION VARIANTS
   ============================================================ */
const fadeUp = (delay = 0) => ({
  initial:     { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0  },
  viewport:    { once: true },
  transition:  { duration: 0.45, delay },
});

/* ============================================================
   NAV LINK ITEM
   Hover managed via useState — reliable with CSS vars.
   ============================================================ */
function NavLinkItem({ link }) {
  const [hovered, setHovered] = useState(false);

  return (
    <li>
      <a
        href={link.href}
        className="text-sm transition-colors duration-200"
        style={{ color: hovered ? "var(--accent)" : "var(--text-secondary)" }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {link.label}
      </a>
    </li>
  );
}

/* ============================================================
   SOCIAL ICON BUTTON
   Square icon button with hover lift + accent color.
   ============================================================ */
function SocialIconButton({ social }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.a
      href={social.href}
      target={social.id === "email" ? undefined : "_blank"}
      rel={social.id === "email" ? undefined : "noopener noreferrer"}
      aria-label={social.label}
      /* Framer Motion handles the lift */
      whileTap={{ scale: 0.96 }}
      animate={{ y: hovered ? -3 : 0 }}
      transition={{ duration: 0.2 }}
      className="flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-300"
      style={{
        border:     "1px solid var(--border)",
        background: hovered
          ? "color-mix(in srgb, var(--accent) 10%, transparent)"
          : "color-mix(in srgb, var(--surface-solid) 15%, transparent)",
        color:      hovered ? "var(--accent)" : "var(--text-secondary)",
        borderColor: hovered
          ? "color-mix(in srgb, var(--accent) 30%, transparent)"
          : "var(--border)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <FontAwesomeIcon icon={social.icon} className="h-4 w-4" />
    </motion.a>
  );
}

/* ============================================================
   BACK TO TOP BUTTON
   ============================================================ */
function BackToTopButton({ onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.96 }}
      animate={{ y: hovered ? -3 : 0 }}
      transition={{ duration: 0.2 }}
      className="mt-8 inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm transition-all duration-300"
      style={{
        border:      "1px solid var(--border)",
        background:  hovered
          ? "color-mix(in srgb, var(--accent) 10%, transparent)"
          : "transparent",
        color:       hovered ? "var(--accent)" : "var(--text-secondary)",
        borderColor: hovered
          ? "color-mix(in srgb, var(--accent) 30%, transparent)"
          : "var(--border)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <FontAwesomeIcon icon={faArrowUp} className="h-3 w-3" />
      <span>Back to top</span>
    </motion.button>
  );
}

/* ============================================================
   FOOTER — MAIN EXPORT
   ============================================================ */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <footer className="px-6 pb-8 md:px-12 md:pb-10">
      <div className="mx-auto max-w-6xl">

        {/*
          glass-card wraps the entire footer content.
          No extra border class needed — glass-card already has
          border: 1px solid var(--border-glass-accent)
        */}
        <div className="glass-card rounded-3xl p-8 md:p-10 lg:p-12">

          {/* ── THREE COLUMN GRID ─────────────────────────── */}
          <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">

            {/* ── BRAND COLUMN ────────────────────────────── */}
            <motion.div {...fadeUp(0)}>

              {/* Logo */}
              <a
                href={BRAND_CONFIG.logoHref}
                className="inline-flex items-center gap-2 text-2xl font-bold tracking-tight transition-colors duration-200"
                style={{ color: "var(--text-primary)" }}
              >
                <span style={{ color: "var(--accent)" }}>&gt;</span>
                {BRAND_CONFIG.name}
              </a>

              {/* Tagline */}
              <p
                className="mt-4 max-w-sm text-sm leading-7"
                style={{ color: "var(--text-secondary)" }}
              >
                {BRAND_CONFIG.tagline.map((line, i) => (
                  <span key={i}>
                    {line}
                    {i < BRAND_CONFIG.tagline.length - 1 && <br />}
                  </span>
                ))}
              </p>

              {/* Subline */}
              <p
                className="mt-6 max-w-sm text-sm leading-7"
                style={{ color: "var(--text-muted)" }}
              >
                {BRAND_CONFIG.subline}
              </p>
            </motion.div>

            {/* ── NAVIGATION COLUMN ───────────────────────── */}
            <motion.div {...fadeUp(0.05)}>
              <p
                className="mb-5 font-mono-tag font-semibold uppercase"
                style={{
                  fontSize:      "0.625rem",
                  letterSpacing: "0.16em",
                  color:         "var(--accent)",
                }}
              >
                Navigation
              </p>

              <nav aria-label="Footer navigation">
                <ul className="space-y-3">
                  {NAV_LINKS.map((link) => (
                    <NavLinkItem key={link.href} link={link} />
                  ))}
                </ul>
              </nav>
            </motion.div>

            {/* ── CONNECT COLUMN ──────────────────────────── */}
            <motion.div {...fadeUp(0.10)}>
              <p
                className="mb-5 font-mono-tag font-semibold uppercase"
                style={{
                  fontSize:      "0.625rem",
                  letterSpacing: "0.16em",
                  color:         "var(--accent)",
                }}
              >
                Connect
              </p>

              {/* Social icon buttons */}
              <div className="flex flex-wrap gap-3">
                {SOCIAL_LINKS.map((social) => (
                  <SocialIconButton key={social.id} social={social} />
                ))}
              </div>

              {/* Back to top */}
              <BackToTopButton onClick={scrollToTop} />
            </motion.div>

          </div>

          {/* ── BOTTOM BAR ────────────────────────────────── */}
          <div
            className="mt-12 flex flex-col items-center justify-between gap-4 pt-6 sm:flex-row"
            style={{ borderTop: "1px solid var(--border)" }}
          >
            {/* Copyright */}
            <p
              className="text-xs"
              style={{ color: "var(--text-muted)" }}
            >
              © {currentYear} Skand Ahuja. All rights reserved.
            </p>

            {/* Built with */}
            <p
              className="text-center font-mono-tag uppercase"
              style={{
                fontSize:      "0.625rem",
                letterSpacing: "0.14em",
                color:         "var(--text-muted)",
              }}
            >
              Built with React • Tailwind CSS • Framer Motion
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
}