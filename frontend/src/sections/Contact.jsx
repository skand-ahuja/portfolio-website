// Contact.jsx - Restored Original Structure + Apple Aesthetic
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faArrowRight, faArrowUpRightFromSquare, faBriefcase, faCheck, faChevronDown, faEnvelope, faHandshake, faLocationDot, faPaperPlane, faSpinner, faCode } from "@fortawesome/free-solid-svg-icons";
import Toast from "../components/Toast";

const SECTION_CONFIG = { label: "Contact", heading: "Have something worth", headingAccent: "building?", subtext: "Whether it's a role, collaboration, web application, data problem or automation idea, send me the context and I'll get back to you.", availability: "Open to meaningful opportunities", location: "India", response: "Usually within a day", formTitle: "Send a quick note", formSubtext: "Tell me what you're working on.", privacyNote: "No spam. Your message goes directly to me." };

const INQUIRY_TYPES = [
  { value: "job_opportunity", label: "Job Opportunity", description: "Roles, interviews and hiring", icon: faBriefcase },
  { value: "collaboration", label: "Collaboration", description: "Projects and partnerships", icon: faHandshake },
  { value: "freelance", label: "Freelance Project", description: "Websites, apps and custom builds", icon: faCode },
  { value: "general", label: "General Inquiry", description: "Questions or conversations", icon: faEnvelope }
];

const SOCIAL_LINKS = [
  { id: "linkedin", label: "LinkedIn", icon: faLinkedin, href: "https://linkedin.com/in/skand-ahuja", hoverColor: "#0A66C2", hoverBg: "rgba(10, 102, 194, 0.10)" },
  { id: "github", label: "GitHub", icon: faGithub, href: "https://github.com/skand-ahuja", hoverColor: "var(--text-primary)", hoverBg: "color-mix(in srgb, var(--text-primary) 5%, transparent)" },
];

const INITIAL_FORM = { name: "", email: "", inquiryType: "", company: "", message: "", website: "" };

function validate(form) {
  const errors = {};
  if (!form.name.trim()) errors.name = "Name is required";
  if (!form.email.trim()) errors.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = "Enter a valid email address";
  if (!form.inquiryType) errors.inquiryType = "Please select a reason";
  if (!form.message.trim()) errors.message = "Message is required";
  // else if (form.message.trim().length < 20) errors.message = "Please write at least 20 characters";    // Message limit
  return errors;
}

// RESTORED ORIGINAL CUSTOM DROPDOWN
function InquiryDropdown({ value, onChange, error }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const dropdownRef = useRef(null);
  const selectedOption = INQUIRY_TYPES.find((o) => o.value === value);

  useEffect(() => {
    function handleOutside(e) { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false); }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  useEffect(() => {
    if (!value) return;
    const i = INQUIRY_TYPES.findIndex((o) => o.value === value);
    if (i >= 0) setActiveIndex(i);
  }, [value]);

  function chooseOption(option) {
    onChange({ target: { name: "inquiryType", value: option.value } });
    setIsOpen(false);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); if (!isOpen) setIsOpen(true); else chooseOption(INQUIRY_TYPES[activeIndex]); return; }
    if (e.key === "Escape") { setIsOpen(false); return; }
    if (e.key === "ArrowDown") { e.preventDefault(); if (!isOpen) { setIsOpen(true); return; } setActiveIndex((c) => (c + 1) % INQUIRY_TYPES.length); return; }
    if (e.key === "ArrowUp") { e.preventDefault(); if (!isOpen) { setIsOpen(true); return; } setActiveIndex((c) => (c - 1 + INQUIRY_TYPES.length) % INQUIRY_TYPES.length); }
  }

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button" aria-haspopup="listbox" aria-expanded={isOpen} onClick={() => setIsOpen(!isOpen)} onKeyDown={handleKeyDown}
        className={`form-control flex items-center justify-between ${error ? "form-control-error" : ""}`}
        style={{ minHeight: "48px", cursor: "pointer", padding: "0.75rem 1rem" }}
      >
        {selectedOption ? (
          <span className="flex min-w-0 items-center gap-2.5">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] text-[var(--accent)]"><FontAwesomeIcon icon={selectedOption.icon} className="h-3 w-3" /></span>
            <span className="truncate text-sm font-medium text-[var(--text-primary)]">{selectedOption.label}</span>
          </span>
        ) : <span className="text-sm text-[var(--text-muted)]">Select a reason...</span>}
        <motion.span animate={{ rotate: isOpen ? 180 : 0 }} className="text-[var(--text-muted)]"><FontAwesomeIcon icon={faChevronDown} className="h-3 w-3" /></motion.span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -4, scale: 0.98 }} transition={{ duration: 0.16 }}
            className="absolute left-0 right-0 z-50 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface-solid)] p-1.5 shadow-[var(--shadow-lg)] backdrop-blur-xl"
            style={{ top: "calc(100% + 8px)" }}
          >
            {INQUIRY_TYPES.map((option, index) => {
              const isSelected = value === option.value;
              const isActive = activeIndex === index;
              return (
                <button
                  key={option.value} type="button" role="option" aria-selected={isSelected} onMouseEnter={() => setActiveIndex(index)} onClick={() => chooseOption(option)}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors duration-150"
                  style={{ background: isActive || isSelected ? "color-mix(in srgb, var(--accent) 10%, transparent)" : "transparent" }}
                >
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${isSelected ? "bg-[var(--accent)] text-white" : "bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] text-[var(--accent)]"}`}>
                    <FontAwesomeIcon icon={option.icon} className="h-3 w-3" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-[var(--text-primary)]">{option.label}</span>
                    <span className="mt-0.5 block text-[11px] text-[var(--text-muted)]">{option.description}</span>
                  </span>
                  {isSelected && <FontAwesomeIcon icon={faCheck} className="h-3 w-3 shrink-0 text-[var(--accent)]" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// RESTORED SOCIAL LINKS
function SocialLink({ social }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={social.href} target="_blank" rel="noopener noreferrer"
      className="inline-flex items-center gap-2.5 rounded-full border px-5 py-2.5 text-sm font-medium transition-all duration-200"
      style={{ borderColor: hovered ? social.hoverColor : "var(--border)", color: hovered ? social.hoverColor : "var(--text-secondary)", background: hovered ? social.hoverBg : "transparent", transform: hovered ? "translateY(-2px)" : "translateY(0)" }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
    >
      <FontAwesomeIcon icon={social.icon} className="h-4 w-4" /> {social.label}
      <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="h-2.5 w-2.5 transition-all duration-200" style={{ opacity: hovered ? 1 : 0.4, transform: hovered ? "translate(2px, -2px)" : "translate(0, 0)" }} />
    </a>
  );
}

export default function Contact() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "success" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(c => ({ ...c, [name]: value }));
    if (errors[name]) setErrors(c => ({ ...c, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) return setErrors(validationErrors);

    setIsSubmitting(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/contact`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name.trim(), email: form.email.trim(), inquiryType: form.inquiryType, company: form.company.trim() || undefined, message: form.message.trim(), website: form.website })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setToast({ message: "Message sent! I'll get back to you soon.", type: "success" });
        setForm(INITIAL_FORM); setErrors({});
      } else setToast({ message: data.message || "Something went wrong.", type: "error" });
    } catch {
      setToast({ message: "Server unreachable. Please try again later.", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative overflow-hidden px-6 py-20 md:px-12 md:py-24">
      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          
          <motion.div initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-70px" }} transition={{ duration: 0.5 }}>
            <div className="mb-4 flex items-center gap-3">
              <span className="block h-px w-7 bg-[var(--accent)]" />
              <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[var(--accent)]">{SECTION_CONFIG.label}</span>
            </div>
            <h2 className="max-w-xl text-4xl font-bold tracking-tight text-[var(--text-primary)] sm:text-5xl lg:text-5xl">
              {SECTION_CONFIG.heading} <span className="text-[var(--accent)]">{SECTION_CONFIG.headingAccent}</span>
            </h2>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-[var(--text-secondary)]">{SECTION_CONFIG.subtext}</p>
            
            <div className="mt-6 flex items-center gap-3">
              <span className="relative flex h-2 w-2"><span className="absolute h-full w-full animate-ping rounded-full bg-[var(--color-success)] opacity-75" /><span className="relative h-2 w-2 rounded-full bg-[var(--color-success)]" /></span>
              <span className="text-sm font-medium text-[var(--text-primary)]">{SECTION_CONFIG.availability}</span>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-6 border-t border-[var(--border)] pt-6">
              <div>
                <div className="mb-1.5 flex items-center gap-2 text-[var(--accent)]"><FontAwesomeIcon icon={faLocationDot} className="h-3 w-3" /><span className="font-mono text-[9px] uppercase tracking-widest">Location</span></div>
                <p className="text-[13px] font-medium text-[var(--text-primary)]">{SECTION_CONFIG.location}</p>
              </div>
              <div>
                <div className="mb-1.5 flex items-center gap-2 text-[var(--accent)]"><FontAwesomeIcon icon={faPaperPlane} className="h-3 w-3" /><span className="font-mono text-[9px] uppercase tracking-widest">Response</span></div>
                <p className="text-[13px] font-medium text-[var(--text-primary)]">{SECTION_CONFIG.response}</p>
              </div>
            </div>

            {/* RESTORED SOCIAL LINKS SECTION */}
            <div className="pt-8">
              <p className="mb-3 font-mono text-[9px] uppercase tracking-widest text-[var(--text-muted)]">Elsewhere</p>
              <div className="flex flex-wrap gap-3">
                {SOCIAL_LINKS.map((social) => <SocialLink key={social.id} social={social} />)}
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-70px" }} transition={{ duration: 0.5, delay: 0.06 }} className="glass-card rounded-[1.5rem] p-6 sm:p-8">
            <div className="mb-6">
              <h3 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">{SECTION_CONFIG.formTitle}</h3>
              <p className="mt-1 text-[13px] text-[var(--text-secondary)]">{SECTION_CONFIG.formSubtext}</p>
            </div>
            
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <input type="text" name="website" value={form.website} onChange={handleChange} style={{ position: "absolute", left: "-9999px", opacity: 0 }} tabIndex={-1} />
              
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block font-mono text-[10px] font-semibold uppercase tracking-widest text-[var(--text-secondary)]">Name</label>
                  <input type="text" name="name" value={form.name} onChange={handleChange} className={`form-control ${errors.name ? "form-control-error" : ""}`} placeholder="Your name" />
                  {errors.name && <p className="mt-1.5 text-[11px] font-medium text-[var(--color-error)]">{errors.name}</p>}
                </div>
                <div>
                  <label className="mb-1.5 block font-mono text-[10px] font-semibold uppercase tracking-widest text-[var(--text-secondary)]">Email</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} className={`form-control ${errors.email ? "form-control-error" : ""}`} placeholder="you@company.com" />
                  {errors.email && <p className="mt-1.5 text-[11px] font-medium text-[var(--color-error)]">{errors.email}</p>}
                </div>
              </div>

              {/* 🍏 RESTORED REASON & COMPANY ROW */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block font-mono text-[10px] font-semibold uppercase tracking-widest text-[var(--text-secondary)]">Reason</label>
                  <InquiryDropdown value={form.inquiryType} onChange={handleChange} error={errors.inquiryType} />
                  {errors.inquiryType && <p className="mt-1.5 text-[11px] font-medium text-[var(--color-error)]">{errors.inquiryType}</p>}
                </div>
                <div>
                  <label className="mb-1.5 block font-mono text-[10px] font-semibold uppercase tracking-widest text-[var(--text-secondary)]">Company <span className="font-normal normal-case tracking-normal text-[var(--text-muted)]">(optional)</span></label>
                  <input type="text" name="company" value={form.company} onChange={handleChange} className="form-control" placeholder="Organization" />
                </div>
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between gap-3">
                  <label className="block font-mono text-[10px] font-semibold uppercase tracking-widest text-[var(--text-secondary)]">Message</label>
                  <span className="font-mono text-[9px]" style={{ color: form.message.length > 900 ? "var(--color-error)" : "var(--text-muted)" }}>{form.message.length}/1000</span>
                </div>
                <textarea name="message" value={form.message} onChange={handleChange} rows={4} className={`form-control min-h-[120px] resize-y ${errors.message ? "form-control-error" : ""}`} placeholder="Tell me about what you're working on..." />
                {errors.message && <p className="mt-1.5 text-[11px] font-medium text-[var(--color-error)]">{errors.message}</p>}
              </div>

              <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
                {isSubmitting ? <><FontAwesomeIcon icon={faSpinner} spin className="h-4 w-4" /> Sending...</> : <>Send Message <FontAwesomeIcon icon={faArrowRight} className="h-3.5 w-3.5" /></>}
              </button>
              
              <p className="text-center text-[10px] text-[var(--text-muted)]">{SECTION_CONFIG.privacyNote}</p>
            </form>
          </motion.div>
        </div>
      </div>
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: "", type: "success" })} />
    </section>
  );
}