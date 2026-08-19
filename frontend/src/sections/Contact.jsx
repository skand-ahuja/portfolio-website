/**
 * Contact.jsx
 *
 * Contact form section with inquiry type dropdown, validation,
 * and toast notifications.
 *
 * FUTURE-PROOFING GUIDE:
 * ──────────────────────
 * 1. To ADD an inquiry type  → add object to INQUIRY_TYPES array
 * 2. To ADD a social link    → add object to SOCIAL_LINKS array
 * 3. To CHANGE API endpoint  → set VITE_API_URL in .env file
 * 4. To CHANGE validation    → edit validate() function
 * 5. To CHANGE heading       → edit SECTION_CONFIG
 *
 * Fixes applied:
 * 1. hover:bg-accent-hover → onMouseEnter/Leave with var(--accent-hover)
 * 2. text-primary/secondary/muted/accent → inline CSS var styles
 * 3. border-current/10, bg-current/[0.025] → var(--border) + color-mix()
 * 4. bg-accent/10, bg-accent/[0.08] → color-mix()
 * 5. dark:bg-accent/[0.04] → removed (CSS vars handle dark mode auto)
 * 6. inputClass() → plain inline styles, no Tailwind arbitrary color values
 * 7. GlassCard as={motion.div} → replaced with motion.div + glass-card class
 * 8. Social links hoverClass → onMouseEnter/Leave with CSS vars
 * 9. InquiryDropdown border-current/10 → var(--border)
 * 10. focus:shadow arbitrary → simple box-shadow via onFocus
 * 11. Honeypot input moved outside absolute-positioned wrapper
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import {
  faArrowRight,
  faArrowUpRightFromSquare,
  faBriefcase,
  faCheck,
  faChevronDown,
  faEnvelope,
  faHandshake,
  faLocationDot,
  faPaperPlane,
  faSpinner,
  faCode,
} from "@fortawesome/free-solid-svg-icons";
import Toast from "../components/Toast";

/* ============================================================
   SECTION CONFIG
   ============================================================ */
const SECTION_CONFIG = {
  label:        "Contact",
  heading:      "Have something worth",
  headingAccent:"building?",
  subtext:      "Whether it's a role, collaboration, web application, data problem or automation idea, send me the context and I'll get back to you.",
  availability: "Open to meaningful opportunities",
  location:     "India",
  response:     "Usually within a day",
  formTitle:    "Send a quick note",
  formSubtext:  "Tell me what you're working on.",
  privacyNote:  "No spam. Your message goes directly to me.",
};

/* ============================================================
   INQUIRY TYPES
   ============================================================ */
const INQUIRY_TYPES = [
  {
    value:       "job_opportunity",
    label:       "Job Opportunity",
    description: "Roles, interviews and hiring",
    icon:        faBriefcase,
  },
  {
    value:       "collaboration",
    label:       "Collaboration",
    description: "Projects and partnerships",
    icon:        faHandshake,
  },
  {
    value:       "general",
    label:       "General Inquiry",
    description: "Questions or conversations",
    icon:        faEnvelope,
  },
  {
    value: "freelance",
    label: "Freelance Project",
    description: "Websites, apps and custom builds",
    icon: faCode,
  },
];

/* ============================================================
   SOCIAL LINKS
   Add brand-specific hover colors as CSS values (not Tailwind).
   ============================================================ */
const SOCIAL_LINKS = [
  {
    id:         "linkedin",
    label:      "LinkedIn",
    icon:       faLinkedin,
    href:       "https://linkedin.com/in/skand-ahuja",
    hoverColor: "#0A66C2",   /* LinkedIn brand blue */
    hoverBg:    "rgba(10, 102, 194, 0.10)",
  },
  {
    id:         "github",
    label:      "GitHub",
    icon:       faGithub,
    href:       "https://github.com/skand-ahuja",
    hoverColor: "var(--text-primary)",
    hoverBg:    "color-mix(in srgb, var(--text-primary) 5%, transparent)",
  },
];

/* ============================================================
   INITIAL FORM STATE
   ============================================================ */
const INITIAL_FORM = {
  name:        "",
  email:       "",
  inquiryType: "",
  company:     "",
  message:     "",
  website:     "",   /* honeypot — never shown to user */
};

/* ============================================================
   VALIDATION
   ============================================================ */
function validate(form) {
  const errors = {};

  if (!form.name.trim())
    errors.name = "Name is required";

  if (!form.email.trim())
    errors.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    errors.email = "Enter a valid email address";

  if (!form.inquiryType)
    errors.inquiryType = "Please select a reason";

  if (!form.message.trim())
    errors.message = "Message is required";
  else if (form.message.trim().length < 20)
    errors.message = "Please write at least 20 characters";
  else if (form.message.trim().length > 1000)
    errors.message = "Message must be under 1000 characters";

  return errors;
}

/* ============================================================
   FIELD ERROR
   ============================================================ */
function FieldError({ message }) {
  if (!message) return null;
  return (
    <motion.p
      initial={{ opacity: 0, y: -3 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-1.5 text-xs font-medium"
      style={{ color: "var(--color-error, #ef4444)" }}
    >
      {message}
    </motion.p>
  );
}

/* ============================================================
   INPUT STYLES
   Returns a style object — no Tailwind arbitrary color values.
   Called with field name to conditionally apply error styles.
   ============================================================ */
function getInputStyle(hasError) {
  return {
    width:           "100%",
    minHeight:       "48px",
    borderRadius:    "0.75rem",
    border:          hasError
      ? "1px solid var(--color-error, #ef4444)"
      : "1px solid var(--border)",
    background:      "color-mix(in srgb, var(--surface-solid) 40%, transparent)",
    backdropFilter:  "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    color:           "var(--text-primary)",
    padding:         "0.75rem 1rem",
    fontSize:        "0.875rem",
    outline:         "none",
    transition:      "border-color 0.2s ease, box-shadow 0.2s ease",
    boxShadow:       hasError
      ? "0 0 0 3px rgba(239, 68, 68, 0.12)"
      : "none",
  };
}

/* ============================================================
   INQUIRY DROPDOWN
   Accessible custom select with keyboard navigation.
   ============================================================ */
function InquiryDropdown({ value, onChange, error }) {
  const [isOpen,       setIsOpen]       = useState(false);
  const [activeIndex,  setActiveIndex]  = useState(0);
  const dropdownRef = useRef(null);

  const selectedOption = INQUIRY_TYPES.find((o) => o.value === value);

  /* Close on outside click */
  useEffect(() => {
    function handleOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setIsOpen(false);
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  /* Sync activeIndex when value changes */
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
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (!isOpen) setIsOpen(true);
      else chooseOption(INQUIRY_TYPES[activeIndex]);
      return;
    }
    if (e.key === "Escape") { setIsOpen(false); return; }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!isOpen) { setIsOpen(true); return; }
      setActiveIndex((c) => (c + 1) % INQUIRY_TYPES.length);
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!isOpen) { setIsOpen(true); return; }
      setActiveIndex((c) => (c - 1 + INQUIRY_TYPES.length) % INQUIRY_TYPES.length);
    }
  }

  return (
    <div ref={dropdownRef} className="relative">

      {/* Trigger button */}
      <button
        id="inquiryType"
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls="inquiry-options"
        onClick={() => setIsOpen((c) => !c)}
        onKeyDown={handleKeyDown}
        style={{
          ...getInputStyle(error),
          minHeight:  "48px",
          display:    "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap:        "0.75rem",
          cursor:     "pointer",
        }}
        onMouseEnter={(e) => {
          if (!error) e.currentTarget.style.borderColor = "color-mix(in srgb, var(--accent) 30%, transparent)";
        }}
        onMouseLeave={(e) => {
          if (!error) e.currentTarget.style.borderColor = "var(--border)";
        }}
        onFocus={(e) => {
          if (!error) {
            e.currentTarget.style.borderColor = "var(--accent)";
            e.currentTarget.style.boxShadow   = "0 0 0 3px color-mix(in srgb, var(--accent) 14%, transparent)";
          }
        }}
        onBlur={(e) => {
          if (!error) {
            e.currentTarget.style.borderColor = "var(--border)";
            e.currentTarget.style.boxShadow   = "none";
          }
        }}
      >
        {/* Selected option or placeholder */}
        {selectedOption ? (
          <span className="flex min-w-0 items-center gap-2.5">
            <span
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
              style={{
                background: "color-mix(in srgb, var(--accent) 10%, transparent)",
                color:      "var(--accent)",
              }}
            >
              <FontAwesomeIcon icon={selectedOption.icon} className="h-3 w-3" />
            </span>
            <span
              className="truncate text-sm font-medium"
              style={{ color: "var(--text-primary)" }}
            >
              {selectedOption.label}
            </span>
          </span>
        ) : (
          <span className="text-sm" style={{ color: "var(--text-muted)" }}>
            Select a reason...
          </span>
        )}

        {/* Chevron */}
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          style={{ color: "var(--text-muted)", flexShrink: 0 }}
        >
          <FontAwesomeIcon icon={faChevronDown} className="h-3 w-3" />
        </motion.span>
      </button>

      {/* Dropdown options */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="inquiry-options"
            role="listbox"
            initial={{ opacity: 0, y: -6,  scale: 0.98 }}
            animate={{ opacity: 1, y: 0,   scale: 1    }}
            exit={{    opacity: 0, y: -4,   scale: 0.98 }}
            transition={{ duration: 0.16 }}
            className="absolute left-0 right-0 z-50 overflow-hidden rounded-xl p-1.5"
            style={{
              top:             "calc(100% + 8px)",
              background:      "var(--surface-solid)",
              border:          "1px solid var(--border)",
              backdropFilter:  "blur(20px)",
              boxShadow:       "var(--shadow-lg)",
            }}
          >
            {INQUIRY_TYPES.map((option, index) => {
              const isSelected = value === option.value;
              const isActive   = activeIndex === index;

              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => chooseOption(option)}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors duration-150"
                  style={{
                    background: isActive || isSelected
                      ? "color-mix(in srgb, var(--accent) 10%, transparent)"
                      : "transparent",
                  }}
                >
                  {/* Icon */}
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                    style={{
                      background: isSelected ? "var(--accent)" : "color-mix(in srgb, var(--accent) 10%, transparent)",
                      color:      isSelected ? "#ffffff" : "var(--accent)",
                    }}
                  >
                    <FontAwesomeIcon icon={option.icon} className="h-3 w-3" />
                  </span>

                  {/* Label + description */}
                  <span className="min-w-0 flex-1">
                    <span
                      className="block text-sm font-semibold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {option.label}
                    </span>
                    <span
                      className="mt-0.5 block"
                      style={{ fontSize: "0.6875rem", color: "var(--text-muted)" }}
                    >
                      {option.description}
                    </span>
                  </span>

                  {/* Selected check */}
                  {isSelected && (
                    <FontAwesomeIcon
                      icon={faCheck}
                      className="h-3 w-3 shrink-0"
                      style={{ color: "var(--accent)" }}
                    />
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ============================================================
   CONTACT — MAIN EXPORT
   ============================================================ */
export default function Contact() {
  const [form,         setForm]         = useState(INITIAL_FORM);
  const [errors,       setErrors]       = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast,        setToast]        = useState({ message: "", type: "success" });

  const dismissToast = useCallback(() => {
    setToast({ message: "", type: "success" });
  }, []);

  /* Generic field change handler */
  function handleChange(e) {
    const { name, value } = e.target;
    setForm((c) => ({ ...c, [name]: value }));
    if (errors[name]) setErrors((c) => ({ ...c, [name]: undefined }));
  }

  /* Form submit */
  async function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate(form);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/contact`,
        {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({
            name:        form.name.trim(),
            email:       form.email.trim(),
            inquiryType: form.inquiryType,
            company:     form.company.trim() || undefined,
            message:     form.message.trim(),
            website:     form.website,   /* honeypot */
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setToast({ message: "Message sent! I'll get back to you soon.", type: "success" });
        setForm(INITIAL_FORM);
        setErrors({});
      } else {
        setToast({ message: data.message || "Something went wrong. Please try again.", type: "error" });
      }
    } catch {
      setToast({ message: "Could not reach the server. Please try again later.", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  }

  /* ============================================================
     INPUT EVENT HANDLERS
     Shared across all text inputs for hover/focus/blur
     ============================================================ */
  const inputHandlers = (field) => ({
    style:       getInputStyle(Boolean(errors[field])),
    onMouseEnter:(e) => {
      if (!errors[field]) e.currentTarget.style.borderColor = "color-mix(in srgb, var(--accent) 25%, transparent)";
    },
    onMouseLeave:(e) => {
      if (!errors[field] && document.activeElement !== e.currentTarget)
        e.currentTarget.style.borderColor = "var(--border)";
    },
    onFocus:(e) => {
      if (!errors[field]) {
        e.currentTarget.style.borderColor = "var(--accent)";
        e.currentTarget.style.boxShadow   = "0 0 0 3px color-mix(in srgb, var(--accent) 14%, transparent)";
      }
    },
    onBlur:(e) => {
      if (!errors[field]) {
        e.currentTarget.style.borderColor = "var(--border)";
        e.currentTarget.style.boxShadow   = "none";
      }
    },
  });

  return (
    <section id="contact" className="relative overflow-hidden px-6 py-20 md:px-12 md:py-24">

      {/* ── BACKGROUND GLOWS ──────────────────────────────────── */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div
          className="absolute -right-48 top-1/3 h-[400px] w-[400px] rounded-full blur-[110px]"
          style={{ background: "color-mix(in srgb, var(--accent) 8%, transparent)" }}
        />
        <div
          className="absolute -left-40 top-20 h-[280px] w-[280px] rounded-full blur-[100px]"
          style={{ background: "color-mix(in srgb, var(--accent) 6%, transparent)" }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start lg:gap-16 xl:gap-20">

          {/* ── LEFT: INFO COLUMN ─────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-70px" }}
            transition={{ duration: 0.5 }}
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

            {/* Heading */}
            <h2
              className="max-w-xl font-bold text-3xl leading-[1.05] sm:text-4xl lg:text-5xl"
              style={{
                letterSpacing: "-0.04em",
                color:         "var(--text-primary)",
              }}
            >
              {SECTION_CONFIG.heading}{" "}
              <span style={{ color: "var(--accent)" }}>
                {SECTION_CONFIG.headingAccent}
              </span>
            </h2>

            {/* Subtext */}
            <p
              className="mt-5 max-w-md text-sm leading-7 sm:text-base"
              style={{ color: "var(--text-secondary)" }}
            >
              {SECTION_CONFIG.subtext}
            </p>

            {/* Availability */}
            <div className="mt-6 flex items-center gap-3">
              <span className="relative flex h-2 w-2">
                <span
                  className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
                  style={{ background: "#34d399" }}
                />
                <span
                  className="relative inline-flex h-2 w-2 rounded-full"
                  style={{ background: "#10b981" }}
                />
              </span>
              <span
                className="text-sm font-medium"
                style={{ color: "var(--text-primary)" }}
              >
                {SECTION_CONFIG.availability}
              </span>
            </div>

            {/* Location + Response */}
            <div
              className="mt-8 grid grid-cols-2 gap-6 pt-6"
              style={{ borderTop: "1px solid var(--border)" }}
            >
              {/* Location */}
              <div>
                <div className="mb-1.5 flex items-center gap-2" style={{ color: "var(--accent)" }}>
                  <FontAwesomeIcon icon={faLocationDot} className="h-3 w-3 shrink-0" />
                  <span
                    className="font-mono-tag uppercase"
                    style={{ fontSize: "0.5625rem", letterSpacing: "0.12em" }}
                  >
                    Location
                  </span>
                </div>
                <p
                  className="ml-5 text-sm font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  {SECTION_CONFIG.location}
                </p>
              </div>

              {/* Response time */}
              <div>
                <div className="mb-1.5 flex items-center gap-2" style={{ color: "var(--accent)" }}>
                  <FontAwesomeIcon icon={faPaperPlane} className="h-3 w-3 shrink-0" />
                  <span
                    className="font-mono-tag uppercase"
                    style={{ fontSize: "0.5625rem", letterSpacing: "0.12em" }}
                  >
                    Response
                  </span>
                </div>
                <p
                  className="ml-5 text-sm font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  {SECTION_CONFIG.response}
                </p>
              </div>
            </div>

            {/* Social links */}
            <div className="pt-8">
              <p
                className="mb-3 font-mono-tag uppercase"
                style={{
                  fontSize:      "0.5625rem",
                  letterSpacing: "0.14em",
                  color:         "var(--text-muted)",
                }}
              >
                Elsewhere
              </p>

              <div className="flex flex-wrap gap-3">
                {SOCIAL_LINKS.map((social) => (
                  <SocialLink key={social.id} social={social} />
                ))}
              </div>
            </div>
          </motion.div>

          {/* ── RIGHT: CONTACT FORM ───────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-70px" }}
            transition={{ duration: 0.5, delay: 0.06 }}
            className="glass-card rounded-2xl p-6"
          >
            {/* Form header */}
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h3
                  className="text-lg font-semibold sm:text-xl"
                  style={{ color: "var(--text-primary)" }}
                >
                  {SECTION_CONFIG.formTitle}
                </h3>
                <p
                  className="mt-1 text-xs leading-relaxed sm:text-sm"
                  style={{ color: "var(--text-muted)" }}
                >
                  {SECTION_CONFIG.formSubtext}
                </p>
              </div>

              {/* Decorative icon */}
              <span
                className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl sm:flex"
                style={{
                  border:     "1px solid var(--border)",
                  background: "color-mix(in srgb, var(--surface-solid) 50%, transparent)",
                  color:      "var(--accent)",
                }}
              >
                <FontAwesomeIcon icon={faPaperPlane} className="h-4 w-4" />
              </span>
            </div>

            {/* FORM */}
            <form
              onSubmit={handleSubmit}
              noValidate
              aria-label="Contact form"
              className="space-y-4"
            >
              {/* Honeypot — hidden from real users, catches bots */}
              <div
                aria-hidden="true"
                style={{ position: "absolute", left: "-9999px", opacity: 0 }}
              >
                <input
                  id="website"
                  name="website"
                  type="text"
                  value={form.website}
                  onChange={handleChange}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              {/* Name + Email */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <FormLabel htmlFor="name" text="Name" />
                  <input
                    id="name" name="name" type="text"
                    autoComplete="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    aria-invalid={Boolean(errors.name)}
                    {...inputHandlers("name")}
                  />
                  <FieldError message={errors.name} />
                </div>

                <div>
                  <FormLabel htmlFor="email" text="Email" />
                  <input
                    id="email" name="email" type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@company.com"
                    aria-invalid={Boolean(errors.email)}
                    {...inputHandlers("email")}
                  />
                  <FieldError message={errors.email} />
                </div>
              </div>

              {/* Inquiry type + Company */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <FormLabel htmlFor="inquiryType" text="Reason" />
                  <InquiryDropdown
                    value={form.inquiryType}
                    onChange={handleChange}
                    error={errors.inquiryType}
                  />
                  <FieldError message={errors.inquiryType} />
                </div>

                <div>
                  <FormLabel htmlFor="company" text="Company" optional />
                  <input
                    id="company" name="company" type="text"
                    autoComplete="organization"
                    value={form.company}
                    onChange={handleChange}
                    placeholder="Organization"
                    {...inputHandlers("company")}
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <div className="mb-1.5 flex items-center justify-between gap-3">
                  <FormLabel htmlFor="message" text="Message" asSpan />
                  <span
                    className="font-mono-tag"
                    style={{
                      fontSize: "0.5625rem",
                      color: form.message.length > 900
                        ? "var(--color-error, #ef4444)"
                        : "var(--text-muted)",
                    }}
                  >
                    {form.message.length}/1000
                  </span>
                </div>
                <textarea
                  id="message" name="message"
                  rows={4}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell me a bit about what you're working on..."
                  aria-invalid={Boolean(errors.message)}
                  style={{
                    ...getInputStyle(Boolean(errors.message)),
                    minHeight: "105px",
                    resize:    "vertical",
                    width:     "100%",
                  }}
                  onMouseEnter={(e) => {
                    if (!errors.message) e.currentTarget.style.borderColor = "color-mix(in srgb, var(--accent) 25%, transparent)";
                  }}
                  onMouseLeave={(e) => {
                    if (!errors.message && document.activeElement !== e.currentTarget)
                      e.currentTarget.style.borderColor = "var(--border)";
                  }}
                  onFocus={(e) => {
                    if (!errors.message) {
                      e.currentTarget.style.borderColor = "var(--accent)";
                      e.currentTarget.style.boxShadow   = "0 0 0 3px color-mix(in srgb, var(--accent) 14%, transparent)";
                    }
                  }}
                  onBlur={(e) => {
                    if (!errors.message) {
                      e.currentTarget.style.borderColor = "var(--border)";
                      e.currentTarget.style.boxShadow   = "none";
                    }
                  }}
                />
                <FieldError message={errors.message} />
              </div>

              {/* Submit button */}
              <div className="pt-1">
                <SubmitButton isSubmitting={isSubmitting} />
              </div>

              {/* Privacy note */}
              <p
                className="text-center"
                style={{
                  fontSize: "0.625rem",
                  color:    "var(--text-muted)",
                  lineHeight: 1.6,
                }}
              >
                {SECTION_CONFIG.privacyNote}
              </p>
            </form>
          </motion.div>

        </div>
      </div>

      {/* Toast notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={dismissToast}
      />
    </section>
  );
}

/* ============================================================
   SOCIAL LINK
   Extracted to manage hover state cleanly per-item.
   ============================================================ */
function SocialLink({ social }) {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={social.href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2.5 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200"
      style={{
        border:     "1px solid var(--border)",
        color:      hovered ? social.hoverColor : "var(--text-secondary)",
        background: hovered ? social.hoverBg : "transparent",
        transform:  hovered ? "translateY(-2px)" : "translateY(0)",
        borderColor: hovered
          ? social.hoverColor
          : "var(--border)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <FontAwesomeIcon icon={social.icon} className="h-4 w-4" />
      {social.label}
      <FontAwesomeIcon
        icon={faArrowUpRightFromSquare}
        className="h-2.5 w-2.5 transition-all duration-200"
        style={{
          opacity:   hovered ? 1 : 0.4,
          transform: hovered ? "translate(2px, -2px)" : "translate(0, 0)",
        }}
      />
    </a>
  );
}

/* ============================================================
   FORM LABEL
   Consistent label styling across all form fields.
   ============================================================ */
function FormLabel({ htmlFor, text, optional = false, asSpan = false }) {
  const style = {
    display:       "block",
    marginBottom:  "0.375rem",
    fontFamily:    "var(--font-mono)",
    fontSize:      "0.5625rem",
    fontWeight:    600,
    textTransform: "uppercase",
    letterSpacing: "0.13em",
    color:         "var(--text-secondary)",
  };

  if (asSpan) {
    return (
      <label htmlFor={htmlFor} style={style}>
        {text}
        {optional && (
          <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0, color: "var(--text-muted)", marginLeft: "0.25rem" }}>
            (optional)
          </span>
        )}
      </label>
    );
  }

  return (
    <label htmlFor={htmlFor} style={style}>
      {text}
      {optional && (
        <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0, color: "var(--text-muted)", marginLeft: "0.25rem" }}>
          (optional)
        </span>
      )}
    </label>
  );
}

/* ============================================================
   SUBMIT BUTTON
   Extracted to manage hover state cleanly.
   ============================================================ */
function SubmitButton({ isSubmitting }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className="group flex h-12 w-full items-center justify-center gap-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200"
      style={{
        background: hovered && !isSubmitting
          ? "var(--accent-hover)"
          : "var(--accent)",
        transform:  hovered && !isSubmitting
          ? "translateY(-2px)"
          : "translateY(0)",
        boxShadow: hovered && !isSubmitting
          ? "0 8px 24px color-mix(in srgb, var(--accent) 32%, transparent)"
          : "0 4px 16px color-mix(in srgb, var(--accent) 25%, transparent)",
        opacity:    isSubmitting ? 0.6 : 1,
        cursor:     isSubmitting ? "not-allowed" : "pointer",
      }}
      onMouseEnter={() => { if (!isSubmitting) setHovered(true); }}
      onMouseLeave={() => setHovered(false)}
    >
      {isSubmitting ? (
        <>
          <FontAwesomeIcon icon={faSpinner} className="h-3.5 w-3.5 animate-spin" />
          Sending...
        </>
      ) : (
        <>
          Send message
          <FontAwesomeIcon
            icon={faArrowRight}
            className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-1"
          />
        </>
      )}
    </button>
  );
}