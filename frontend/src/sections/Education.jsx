// Education.jsx - Bug Fixed + Toggles Restored + Foil Easter Egg
import { useState } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare, faAward, faCalendarDays, faGraduationCap, faLocationDot } from "@fortawesome/free-solid-svg-icons";

const SHOW_EDUCATION_SECTION = false;
const SHOW_EDUCATION         = false;
const SHOW_CERTIFICATIONS    = false;

const SECTION_CONFIG = { label: "Education & Credentials", heading: "Learning that supports", headingAccent: "the work.", subtext: "Formal education and certifications that complement hands-on experience." };
const EDUCATION = [{ id: "edu-1", degree: "Your Degree", field: "Specialization", institution: "University", location: "City, State", startYear: "20XX", endYear: "20XX", description: "Short description of what you learned." }];
const CERTIFICATIONS = [{ id: "cert-1", name: "Certification Name", issuer: "Organization", year: "2026", credentialId: "ABC123", certificateUrl: "https://example.com" }];
const fadeUp = (delay = 0) => ({ initial: { opacity: 0, y: 18 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-50px" }, transition: { duration: 0.45, delay, ease: [0.16, 1, 0.3, 1] } });

function ColumnHeader({ label, count }) {
  return <div className="mb-6 flex items-center justify-between border-b border-[var(--border)] pb-3"><span className="font-mono text-[9px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">{label}</span><span className="font-mono text-[9px] text-[var(--text-muted)]">{String(count).padStart(2, "0")}</span></div>;
}

function EducationItem({ education, index, isLast }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.article {...fadeUp(index * 0.06)} className="group relative py-6" style={{ borderBottom: isLast ? "none" : "1px solid var(--border)", paddingTop: index === 0 ? "0" : undefined }}>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 gap-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-300" style={{ background: hovered ? "var(--accent)" : "color-mix(in srgb, var(--accent) 8%, transparent)", color: hovered ? "#ffffff" : "var(--accent)", transform: hovered ? "translateY(-2px)" : "translateY(0)" }} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
            <FontAwesomeIcon icon={faGraduationCap} className="h-4 w-4" />
          </span>
          <div>
            <span className="font-mono text-[9px] font-semibold uppercase tracking-widest text-[var(--accent)]">Education</span>
            <h3 className="mt-1.5 text-[17px] font-bold tracking-tight text-[var(--text-primary)]">{education.degree}</h3>
            {education.field && <p className="mt-1 text-[13.5px] font-medium text-[var(--text-secondary)]">{education.field}</p>}
            <p className="mt-1 text-[13px] text-[var(--text-muted)]">{education.institution}</p>
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap gap-x-4 gap-y-2 pl-14 sm:flex-col sm:items-end sm:pl-0">
          <span className="font-mono flex items-center gap-2 text-[10px] uppercase tracking-wider text-[var(--text-muted)]"><FontAwesomeIcon icon={faCalendarDays} className="h-3 w-3 text-[var(--accent)]" />{education.startYear} — {education.endYear}</span>
          {education.location && <span className="font-mono flex items-center gap-2 text-[10px] uppercase tracking-wider text-[var(--text-muted)]"><FontAwesomeIcon icon={faLocationDot} className="h-3 w-3 text-[var(--accent)]" />{education.location}</span>}
        </div>
      </div>
    </motion.article>
  );
}

function CertificationItem({ cert, index }) {
  const [hovered, setHovered] = useState(false);
  const content = (
    <>
      <div className={`absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/10 dark:via-white/5 to-transparent transition-all duration-1000 ${hovered ? "translate-x-[200%]" : "-translate-x-[200%]"}`} />
      <span className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[color-mix(in_srgb,var(--accent)_8%,transparent)] text-[var(--accent)]"><FontAwesomeIcon icon={faAward} className="h-3.5 w-3.5" /></span>
      <div className="relative z-10 min-w-0 flex-1">
        <h4 className="text-[14px] font-semibold leading-snug transition-colors" style={{ color: hovered ? "var(--accent)" : "var(--text-primary)" }}>{cert.name}</h4>
        <p className="mt-0.5 text-[12px] text-[var(--text-secondary)]">{cert.issuer}</p>
        <div className="mt-2 flex gap-3"><span className="font-mono text-[9px] uppercase tracking-widest text-[var(--text-muted)]">{cert.year}</span>{cert.credentialId && <span className="font-mono text-[9px] tracking-widest text-[var(--text-muted)]">ID: {cert.credentialId}</span>}</div>
      </div>
      {cert.certificateUrl && <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="relative z-10 mt-1 h-3 w-3 shrink-0 transition-all duration-300" style={{ color: hovered ? "var(--accent)" : "var(--text-muted)", transform: hovered ? "translate(2px, -2px) scale(1.1)" : "translate(0,0)" }} />}
    </>
  );

  const props = { onMouseEnter: () => setHovered(true), onMouseLeave: () => setHovered(false), className: "relative overflow-hidden flex items-start gap-3 rounded-xl border px-4 py-4 transition-all duration-300", style: { borderColor: hovered ? "color-mix(in srgb, var(--accent) 30%, transparent)" : "var(--border)", background: hovered ? "color-mix(in srgb, var(--accent) 3%, transparent)" : "color-mix(in srgb, var(--surface-solid) 20%, transparent)", transform: hovered ? "translateY(-2px)" : "translateY(0)" } };

  return cert.certificateUrl ? <motion.a {...fadeUp(index * 0.05)} href={cert.certificateUrl} target="_blank" rel="noreferrer" {...props}>{content}</motion.a> : <motion.div {...fadeUp(index * 0.05)} {...props}>{content}</motion.div>;
}

export default function Education() {
  if (!SHOW_EDUCATION_SECTION) return null;
  const showEdu  = SHOW_EDUCATION      && EDUCATION.length      > 0;
  const showCert = SHOW_CERTIFICATIONS && CERTIFICATIONS.length > 0;
  if (!showEdu && !showCert) return null;

  return (
    <section id="education" className="relative px-6 py-20 md:px-12 md:py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div {...fadeUp(0)} className="mb-12 md:mb-14">
          <div className="mb-4 flex items-center gap-3"><span className="block h-px w-7 bg-[var(--accent)]" /><span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[var(--accent)]">{SECTION_CONFIG.label}</span></div>
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <h2 className="text-4xl font-bold tracking-tight text-[var(--text-primary)] lg:text-5xl">{SECTION_CONFIG.heading} <span className="text-[var(--accent)]">{SECTION_CONFIG.headingAccent}</span></h2>
            <p className="max-w-sm text-[14px] leading-relaxed text-[var(--text-secondary)] md:text-right">{SECTION_CONFIG.subtext}</p>
          </div>
        </motion.div>

        <div className={`grid grid-cols-1 gap-12 ${showEdu && showCert ? "lg:grid-cols-[1.05fr_0.95fr] lg:gap-16" : ""}`}>
          {showEdu && (
            <div>
              <ColumnHeader label="Education" count={EDUCATION.length} />
              <div>{EDUCATION.map((edu, i) => <EducationItem key={edu.id} education={edu} index={i} isLast={i === EDUCATION.length - 1} />)}</div>
            </div>
          )}
          {showCert && (
            <div>
              <ColumnHeader label="Certifications" count={CERTIFICATIONS.length} />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
                {/* 🍏 BUG FIXED HERE: cert={cert} passed instead of certification={cert} */}
                {CERTIFICATIONS.map((cert, i) => <CertificationItem key={cert.id} cert={cert} index={i} />)}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}