/**
 * InquiryDropdown.jsx
 *
 * NOTE: This file is currently NOT used directly.
 * Contact.jsx has an inline InquiryDropdown component.
 * 
 * You can safely DELETE this file.
 * 
 * If you want to use this as a standalone component in future,
 * it has been fixed for CSS var compatibility below.
 *
 * Fixes applied:
 * 1. border-current/10, bg-[var(--surface)] → CSS var inline styles
 * 2. hover:border-accent/30, focus:ring-accent/10 → onMouseEnter/Leave/Focus/Blur
 * 3. bg-accent/10, text-accent → color-mix() inline styles
 * 4. hover:bg-current/[0.04] → inline style on hover
 * 5. bg-accent/10 on icon span → color-mix()
 * 6. text-primary, text-muted → inline CSS var styles
 */

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBriefcase,
  faChevronDown,
  faEnvelope,
  faHandshake,
} from "@fortawesome/free-solid-svg-icons";

const OPTIONS = [
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
];

export default function InquiryDropdown({ value, onChange, error }) {
  const [isOpen,      setIsOpen]      = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const wrapperRef = useRef(null);

  const selectedOption = OPTIONS.find((o) => o.value === value);

  /* Close on outside click */
  useEffect(() => {
    function handleOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target))
        setIsOpen(false);
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  function selectOption(option) {
    onChange({ target: { name: "inquiryType", value: option.value } });
    setIsOpen(false);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (!isOpen) setIsOpen(true);
      else selectOption(OPTIONS[activeIndex]);
      return;
    }
    if (e.key === "Escape") { setIsOpen(false); return; }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!isOpen) { setIsOpen(true); return; }
      setActiveIndex((c) => (c + 1) % OPTIONS.length);
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!isOpen) { setIsOpen(true); return; }
      setActiveIndex((c) => (c - 1 + OPTIONS.length) % OPTIONS.length);
    }
  }

  return (
    <div ref={wrapperRef} className="relative">

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen((c) => !c)}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls="inquiry-options"
        style={{
          display:         "flex",
          minHeight:       "50px",
          width:           "100%",
          alignItems:      "center",
          justifyContent:  "space-between",
          gap:             "0.75rem",
          borderRadius:    "0.75rem",
          border:          error
            ? "1px solid var(--color-error, #ef4444)"
            : "1px solid var(--border)",
          background:      "var(--surface)",
          padding:         "0.625rem 1rem",
          textAlign:       "left",
          outline:         "none",
          transition:      "border-color 0.2s ease, box-shadow 0.2s ease",
          cursor:          "pointer",
          boxShadow:       error
            ? "0 0 0 3px rgba(239, 68, 68, 0.12)"
            : "none",
        }}
        onMouseEnter={(e) => {
          if (!error) e.currentTarget.style.borderColor =
            "color-mix(in srgb, var(--accent) 30%, transparent)";
        }}
        onMouseLeave={(e) => {
          if (!error && document.activeElement !== e.currentTarget)
            e.currentTarget.style.borderColor = "var(--border)";
        }}
        onFocus={(e) => {
          if (!error) {
            e.currentTarget.style.borderColor = "var(--accent)";
            e.currentTarget.style.boxShadow   =
              "0 0 0 3px color-mix(in srgb, var(--accent) 14%, transparent)";
          }
        }}
        onBlur={(e) => {
          if (!error) {
            e.currentTarget.style.borderColor = "var(--border)";
            e.currentTarget.style.boxShadow   = "none";
          }
        }}
      >
        {/* Selected option display */}
        {selectedOption ? (
          <span className="flex min-w-0 items-center gap-3">
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
              style={{
                background: "color-mix(in srgb, var(--accent) 10%, transparent)",
                color:      "var(--accent)",
              }}
            >
              <FontAwesomeIcon icon={selectedOption.icon} className="h-3.5 w-3.5" />
            </span>
            <span
              className="block truncate text-sm font-medium"
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
          className="shrink-0"
          style={{ color: "var(--text-muted)" }}
        >
          <FontAwesomeIcon icon={faChevronDown} className="h-3 w-3" />
        </motion.span>
      </button>

      {/* Dropdown */}
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
              top:        "calc(100% + 8px)",
              background: "var(--surface-solid)",
              border:     "1px solid var(--border)",
              boxShadow:  "var(--shadow-lg)",
              backdropFilter: "blur(20px)",
            }}
          >
            {OPTIONS.map((option, index) => {
              const isSelected = option.value === value;
              const isActive   = activeIndex === index;

              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => selectOption(option)}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition-colors duration-150"
                  style={{
                    background: isSelected || isActive
                      ? "color-mix(in srgb, var(--accent) 10%, transparent)"
                      : "transparent",
                  }}
                >
                  {/* Icon */}
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                    style={{
                      background: isSelected ? "var(--accent)" : "color-mix(in srgb, var(--accent) 10%, transparent)",
                      color:      isSelected ? "#ffffff" : "var(--accent)",
                    }}
                  >
                    <FontAwesomeIcon icon={option.icon} className="h-3.5 w-3.5" />
                  </span>

                  {/* Label + description */}
                  <span>
                    <span
                      className="block text-sm font-medium"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {option.label}
                    </span>
                    <span
                      className="mt-0.5 block text-xs"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {option.description}
                    </span>
                  </span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}