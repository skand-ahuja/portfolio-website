/**
 * Education.jsx
 *
 * Education degrees + certifications section.
 *
 * FUTURE-PROOFING GUIDE:
 * ──────────────────────
 * 1. To SHOW/HIDE section entirely  → SHOW_EDUCATION_SECTION = false
 * 2. To SHOW/HIDE education only    → SHOW_EDUCATION = false
 * 3. To SHOW/HIDE certs only        → SHOW_CERTIFICATIONS = false
 * 4. To ADD a degree                → add object to EDUCATION array
 * 5. To ADD a certification         → add object to CERTIFICATIONS array
 * 6. certificateUrl optional        → leave "" if no public URL
 * 7. credentialId optional          → leave "" if not applicable
 *
 * Fixes applied:
 * 1. group-hover:bg-accent/text-white → useState + onMouseEnter/Leave
 * 2. border-current/[0.08], bg-current/[0.015] → var(--border) + color-mix()
 * 3. hover:border-accent/25, hover:bg-accent/[0.035] → onMouseEnter/Leave
 * 4. text-primary/secondary/muted/accent → inline CSS var styles
 * 5. bg-accent/[0.08] → color-mix(in srgb, var(--accent) 8%, transparent)
 * 6. sharedClassName string hover → replaced with onMouseEnter/Leave
 * 7. group-hover:text-accent on h4 → ref-based hover color change
 * 8. Glass card on education items for premium feel
 * 9. SECTION_CONFIG for easy text updates
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpRightFromSquare,
  faAward,
  faCalendarDays,
  faGraduationCap,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";

/* ============================================================
   SECTION CONTROLS
   Toggle entire section or individual sub-sections here.
   ============================================================ */
const SHOW_EDUCATION_SECTION = true;
const SHOW_EDUCATION         = true;
const SHOW_CERTIFICATIONS    = true;

/* ============================================================
   SECTION CONFIG
   ============================================================ */
const SECTION_CONFIG = {
  label:         "Education & Credentials",
  heading:       "Learning that supports",
  headingAccent: "the work.",
  subtext:       "Formal education and certifications that complement hands-on experience.",
};

/* ============================================================
   EDUCATION DATA
   
   TO ADD: copy one object and fill in your details.
   description is optional — only add if it adds real context.
   ============================================================ */
const EDUCATION = [
  {
    id:          "education-1",
    degree:      "Your Degree / Qualification",
    field:       "Your Specialization",
    institution: "Your University / College",
    location:    "City, State",
    startYear:   "20XX",
    endYear:     "20XX",
    description: "Add a short description only if it adds useful context to your professional story.",
  },
  /* ── ADD MORE DEGREES HERE ────────────────────────────────
  {
    id:          "education-2",
    degree:      "Another Degree",
    field:       "Specialization",
    institution: "University Name",
    location:    "City, State",
    startYear:   "20XX",
    endYear:     "20XX",
    description: "",
  },
  ─────────────────────────────────────────────────────────── */
];

/* ============================================================
   CERTIFICATIONS DATA
   
   certificateUrl — public URL to verify credential (optional).
   credentialId   — credential ID shown as "ID: ABC123" (optional).
   ============================================================ */
const CERTIFICATIONS = [
  {
    id:             "certificate-1",
    name:           "Your Certification Name",
    issuer:         "Issuing Organization",
    year:           "20XX",
    credentialId:   "",
    certificateUrl: "",
  },
  /* ── ADD MORE CERTIFICATIONS HERE ────────────────────────
  {
    id:             "certificate-2",
    name:           "Certification Name",
    issuer:         "Organization",
    year:           "2026",
    credentialId:   "ABC123",
    certificateUrl: "https://example.com/certificate",
  },
  ─────────────────────────────────────────────────────────── */
];

/* ============================================================
   ANIMATION VARIANTS
   ============================================================ */
const fadeUp = (delay = 0) => ({
  initial:     { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0  },
  viewport:    { once: true, margin: "-50px" },
  transition:  { duration: 0.45, delay, ease: [0.16, 1, 0.3, 1] },
});

/* ============================================================
   COLUMN HEADER
   Reusable "Education / Certifications" label row with count.
   ============================================================ */
function ColumnHeader({ label, count }) {
  return (
    <div
      className="mb-6 flex items-center justify-between gap-4 pb-3"
      style={{ borderBottom: "1px solid var(--border)" }}
    >
      <span
        className="font-mono-tag font-semibold uppercase"
        style={{
          fontSize:      "0.5625rem",
          letterSpacing: "0.15em",
          color:         "var(--text-muted)",
        }}
      >
        {label}
      </span>
      <span
        className="font-mono-tag"
        style={{
          fontSize: "0.5625rem",
          color:    "var(--text-muted)",
        }}
      >
        {String(count).padStart(2, "0")}
      </span>
    </div>
  );
}

/* ============================================================
   EDUCATION ITEM
   ============================================================ */
function EducationItem({ education, index, isLast }) {
  const [iconHovered, setIconHovered] = useState(false);

  return (
    <motion.article
      {...fadeUp(index * 0.06)}
      className="group relative py-6"
      style={{
        borderBottom: isLast ? "none" : "1px solid var(--border)",
        paddingTop:   index === 0 ? "0" : undefined,
        paddingBottom: isLast ? "0" : undefined,
      }}
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">

        {/* ── MAIN INFO ──────────────────────────────────── */}
        <div className="flex min-w-0 gap-4">

          {/* Icon bubble — accent always, white on hover */}
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-300"
            style={{
              background: iconHovered
                ? "var(--accent)"
                : "color-mix(in srgb, var(--accent) 8%, transparent)",
              color:     iconHovered ? "#ffffff" : "var(--accent)",
              transform: iconHovered ? "translateY(-2px)" : "translateY(0)",
            }}
            onMouseEnter={() => setIconHovered(true)}
            onMouseLeave={() => setIconHovered(false)}
          >
            <FontAwesomeIcon icon={faGraduationCap} className="h-4 w-4" />
          </span>

          <div>
            {/* "Education" mini label */}
            <span
              className="font-mono-tag font-semibold uppercase"
              style={{
                fontSize:      "0.5625rem",
                letterSpacing: "0.15em",
                color:         "var(--accent)",
              }}
            >
              Education
            </span>

            {/* Degree */}
            <h3
              className="mt-1.5 text-lg font-semibold leading-snug sm:text-xl"
              style={{
                letterSpacing: "-0.02em",
                color:         "var(--text-primary)",
              }}
            >
              {education.degree}
            </h3>

            {/* Field of study */}
            {education.field && (
              <p
                className="mt-1 text-sm font-medium"
                style={{ color: "var(--text-secondary)" }}
              >
                {education.field}
              </p>
            )}

            {/* Institution */}
            <p
              className="mt-2 text-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              {education.institution}
            </p>

            {/* Optional description */}
            {education.description && (
              <p
                className="mt-3 max-w-xl text-xs leading-6"
                style={{ color: "var(--text-muted)" }}
              >
                {education.description}
              </p>
            )}
          </div>
        </div>

        {/* ── META / DATES ───────────────────────────────── */}
        <div className="flex shrink-0 flex-wrap gap-x-4 gap-y-2 pl-14 sm:flex-col sm:items-end sm:pl-0">
          <span
            className="font-mono-tag flex items-center gap-2"
            style={{ fontSize: "0.625rem", color: "var(--text-muted)" }}
          >
            <FontAwesomeIcon
              icon={faCalendarDays}
              className="h-3 w-3"
              style={{ color: "var(--accent)" }}
            />
            {education.startYear} — {education.endYear}
          </span>

          {education.location && (
            <span
              className="font-mono-tag flex items-center gap-2"
              style={{ fontSize: "0.625rem", color: "var(--text-muted)" }}
            >
              <FontAwesomeIcon
                icon={faLocationDot}
                className="h-3 w-3"
                style={{ color: "var(--accent)" }}
              />
              {education.location}
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
}

/* ============================================================
   CERTIFICATION CARD CONTENT
   Shared between <a> and <div> variants.
   ============================================================ */
function CertCardContent({ certification, titleHovered }) {
  return (
    <>
      {/* Award icon */}
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-all duration-300"
        style={{
          background: "color-mix(in srgb, var(--accent) 8%, transparent)",
          color:      "var(--accent)",
        }}
      >
        <FontAwesomeIcon icon={faAward} className="h-3.5 w-3.5" />
      </span>

      {/* Info */}
      <div className="min-w-0 flex-1">
        {/* Name — turns accent on card hover */}
        <h4
          className="text-sm font-semibold leading-snug transition-colors duration-200"
          style={{ color: titleHovered ? "var(--accent)" : "var(--text-primary)" }}
        >
          {certification.name}
        </h4>

        {/* Issuer */}
        <p
          className="mt-1 text-xs"
          style={{ color: "var(--text-secondary)" }}
        >
          {certification.issuer}
        </p>

        {/* Year + Credential ID */}
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
          <span
            className="font-mono-tag"
            style={{ fontSize: "0.5625rem", color: "var(--text-muted)" }}
          >
            {certification.year}
          </span>
          {certification.credentialId && (
            <span
              className="font-mono-tag"
              style={{ fontSize: "0.5625rem", color: "var(--text-muted)" }}
            >
              ID: {certification.credentialId}
            </span>
          )}
        </div>
      </div>

      {/* External link arrow */}
      {certification.certificateUrl && (
        <FontAwesomeIcon
          icon={faArrowUpRightFromSquare}
          className="mt-1 h-3 w-3 shrink-0 transition-all duration-200"
          style={{
            color:     titleHovered ? "var(--accent)" : "var(--text-muted)",
            transform: titleHovered ? "translate(2px, -2px)" : "translate(0, 0)",
          }}
        />
      )}
    </>
  );
}

/* ============================================================
   CERTIFICATION ITEM
   Renders as <a> if certificateUrl exists, else <div>.
   ============================================================ */
function CertificationItem({ certification, index }) {
  const [hovered, setHovered] = useState(false);

  const hoverStyles = {
    transform:    hovered ? "translateY(-2px)" : "translateY(0)",
    borderColor:  hovered
      ? "color-mix(in srgb, var(--accent) 30%, transparent)"
      : "var(--border)",
    background:   hovered
      ? "color-mix(in srgb, var(--accent) 4%, transparent)"
      : "color-mix(in srgb, var(--surface-solid) 15%, transparent)",
  };

  const sharedProps = {
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
    style: {
      border:     "1px solid var(--border)",
      transition: "all 0.25s ease",
      ...hoverStyles,
    },
    className: "flex items-start gap-3 rounded-xl p-4",
  };

  const animProps = {
    ...fadeUp(index * 0.05),
  };

  const content = (
    <CertCardContent
      certification={certification}
      titleHovered={hovered}
    />
  );

  if (certification.certificateUrl) {
    return (
      <motion.a
        {...animProps}
        href={certification.certificateUrl}
        target="_blank"
        rel="noopener noreferrer"
        {...sharedProps}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.div {...animProps} {...sharedProps}>
      {content}
    </motion.div>
  );
}

/* ============================================================
   EDUCATION — MAIN EXPORT
   ============================================================ */
export default function Education() {
  /* Master switch — hide entire section */
  if (!SHOW_EDUCATION_SECTION) return null;

  const showEdu  = SHOW_EDUCATION      && EDUCATION.length      > 0;
  const showCert = SHOW_CERTIFICATIONS && CERTIFICATIONS.length > 0;

  /* Nothing to show */
  if (!showEdu && !showCert) return null;

  return (
    <section id="education" className="relative px-6 py-20 md:px-12 md:py-24">
      <div className="mx-auto max-w-6xl">

        {/* ── SECTION HEADER ──────────────────────────────── */}
        <motion.div
          {...fadeUp(0)}
          className="mb-12 md:mb-14"
        >
          {/* Label */}
          <div className="mb-4 flex items-center gap-3">
            <span
              className="block h-px w-7 shrink-0"
              style={{ background: "var(--accent)" }}
            />
            <span
              className="font-mono-tag font-semibold uppercase"
              style={{
                fontSize:      "0.625rem",
                letterSpacing: "0.16em",
                color:         "var(--accent)",
              }}
            >
              {SECTION_CONFIG.label}
            </span>
          </div>

          {/* Heading + subtext */}
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <h2
              className="max-w-2xl font-bold text-3xl sm:text-4xl lg:text-5xl"
              style={{
                lineHeight:    "1.08",
                letterSpacing: "-0.04em",
                color:         "var(--text-primary)",
              }}
            >
              {SECTION_CONFIG.heading}{" "}
              <span style={{ color: "var(--accent)" }}>
                {SECTION_CONFIG.headingAccent}
              </span>
            </h2>

            <p
              className="max-w-sm text-sm leading-6 md:text-right"
              style={{ color: "var(--text-secondary)" }}
            >
              {SECTION_CONFIG.subtext}
            </p>
          </div>
        </motion.div>

        {/* ── CONTENT GRID ────────────────────────────────── */}
        <div
          className={`grid grid-cols-1 gap-12 ${
            showEdu && showCert
              ? "lg:grid-cols-[1.05fr_0.95fr] lg:gap-16"
              : ""
          }`}
        >

          {/* Education Column */}
          {showEdu && (
            <div>
              <ColumnHeader label="Education" count={EDUCATION.length} />
              <div>
                {EDUCATION.map((edu, index) => (
                  <EducationItem
                    key={edu.id}
                    education={edu}
                    index={index}
                    isLast={index === EDUCATION.length - 1}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Certifications Column */}
          {showCert && (
            <div>
              <ColumnHeader label="Certifications" count={CERTIFICATIONS.length} />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
                {CERTIFICATIONS.map((cert, index) => (
                  <CertificationItem
                    key={cert.id}
                    certification={cert}
                    index={index}
                  />
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}