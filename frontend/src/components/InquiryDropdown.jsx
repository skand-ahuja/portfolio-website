// InquiryDropdown.jsx - Standalone Standalone Custom Select
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBriefcase, faChevronDown, faEnvelope, faHandshake, faCode, faCheck } from "@fortawesome/free-solid-svg-icons";

const OPTIONS = [
  { value: "job_opportunity", label: "Job Opportunity", description: "Roles, interviews and hiring", icon: faBriefcase },
  { value: "collaboration", label: "Collaboration", description: "Projects and partnerships", icon: faHandshake },
  { value: "freelance", label: "Freelance Project", description: "Websites, apps and custom builds", icon: faCode },
  { value: "general", label: "General Inquiry", description: "Questions or conversations", icon: faEnvelope },
];

export default function InquiryDropdown({ value, onChange, error }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const dropdownRef = useRef(null);
  const selectedOption = OPTIONS.find((o) => o.value === value);

  useEffect(() => {
    function handleOutside(e) { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false); }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  useEffect(() => {
    if (!value) return;
    const i = OPTIONS.findIndex((o) => o.value === value);
    if (i >= 0) setActiveIndex(i);
  }, [value]);

  function chooseOption(option) { onChange({ target: { name: "inquiryType", value: option.value } }); setIsOpen(false); }
  function handleKeyDown(e) {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); if (!isOpen) setIsOpen(true); else chooseOption(OPTIONS[activeIndex]); return; }
    if (e.key === "Escape") { setIsOpen(false); return; }
    if (e.key === "ArrowDown") { e.preventDefault(); if (!isOpen) { setIsOpen(true); return; } setActiveIndex((c) => (c + 1) % OPTIONS.length); return; }
    if (e.key === "ArrowUp") { e.preventDefault(); if (!isOpen) { setIsOpen(true); return; } setActiveIndex((c) => (c - 1 + OPTIONS.length) % OPTIONS.length); }
  }

  return (
    <div ref={dropdownRef} className="relative">
      <button type="button" aria-haspopup="listbox" aria-expanded={isOpen} onClick={() => setIsOpen(!isOpen)} onKeyDown={handleKeyDown} className={`form-control flex items-center justify-between ${error ? "form-control-error" : ""}`} style={{ minHeight: "48px", cursor: "pointer", padding: "0.75rem 1rem" }}>
        {selectedOption ? (
          <span className="flex min-w-0 items-center gap-2.5">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] text-[var(--accent)]"><FontAwesomeIcon icon={selectedOption.icon} className="h-3 w-3" /></span>
            <span className="truncate text-[13.5px] font-medium text-[var(--text-primary)]">{selectedOption.label}</span>
          </span>
        ) : <span className="text-[13.5px] text-[var(--text-muted)]">Select a reason...</span>}
        <motion.span animate={{ rotate: isOpen ? 180 : 0 }} className="text-[var(--text-muted)]"><FontAwesomeIcon icon={faChevronDown} className="h-3 w-3" /></motion.span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, y: -6, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -4, scale: 0.98 }} transition={{ duration: 0.16 }} className="absolute left-0 right-0 z-50 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface-solid)] p-1.5 shadow-[var(--shadow-lg)] backdrop-blur-xl" style={{ top: "calc(100% + 8px)" }}>
            {OPTIONS.map((option, index) => {
              const isSelected = value === option.value;
              const isActive = activeIndex === index;
              return (
                <button key={option.value} type="button" role="option" aria-selected={isSelected} onMouseEnter={() => setActiveIndex(index)} onClick={() => chooseOption(option)} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors duration-150" style={{ background: isActive || isSelected ? "color-mix(in srgb, var(--accent) 10%, transparent)" : "transparent" }}>
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${isSelected ? "bg-[var(--accent)] text-white" : "bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] text-[var(--accent)]"}`}><FontAwesomeIcon icon={option.icon} className="h-3 w-3" /></span>
                  <span className="min-w-0 flex-1"><span className="block text-[13.5px] font-semibold text-[var(--text-primary)]">{option.label}</span><span className="mt-0.5 block text-[11px] text-[var(--text-muted)]">{option.description}</span></span>
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