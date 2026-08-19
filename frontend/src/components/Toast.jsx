/**
 * Toast.jsx
 *
 * Lightweight glassmorphic notification popup.
 *
 * Fixes applied:
 * 1. Progress bar added — shows time remaining before auto-dismiss
 * 2. Mobile positioning fixed — centered on mobile, right-aligned on desktop
 * 3. aria-live="assertive" for errors, "polite" for success (WCAG)
 * 4. Explicit text color using CSS var (not relying on inheritance)
 * 5. Better z-index (z-[200]) — above navbar (z-50) and modals (z-100)
 * 6. Icon background tinted to match type (success/error)
 * 7. Dismiss button has focus-visible ring for keyboard accessibility
 * 8. top-24 instead of top-20 — clears the fixed navbar safely
 *
 * PROPS:
 *   message  — string to display (falsy = hidden)
 *   type     — "success" | "error"
 *   onClose  — callback to clear the message
 *   duration — ms before auto-dismiss (default 4000)
 */

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faCircleXmark,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

export default function Toast({
  message,
  type     = "success",
  onClose,
  duration = 4000,
}) {
  const isSuccess = type === "success";

  /* ============================================================
     AUTO-DISMISS TIMER
     Resets whenever message or duration changes.
     ============================================================ */
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [message, onClose, duration]);

  /* ============================================================
     PROGRESS BAR REF
     We animate the progress bar width using a CSS animation
     instead of JS interval — smoother, no re-renders.
     Key prop on the bar resets animation when new toast appears.
     ============================================================ */
  const progressKey = useRef(0);
  if (message) progressKey.current += 1;

  /* ============================================================
     TYPE CONFIG
     Centralised so success/error styles stay consistent.
     ============================================================ */
  const config = {
    success: {
      icon:        faCircleCheck,
      iconColor:   "#10b981",                              /* emerald-500 */
      iconBg:      "rgba(16, 185, 129, 0.10)",
      progressBg:  "#10b981",
      ariaLive:    "polite",                               /* non-urgent  */
    },
    error: {
      icon:        faCircleXmark,
      iconColor:   "#ef4444",                              /* red-500     */
      iconBg:      "rgba(239, 68, 68, 0.10)",
      progressBg:  "#ef4444",
      ariaLive:    "assertive",                            /* urgent!     */
    },
  };

  const { icon, iconColor, iconBg, progressBg, ariaLive } =
    config[type] ?? config.success;

  /* ============================================================
     RENDER
     ============================================================ */
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          key="toast"
          role="alert"
          aria-live={ariaLive}
          aria-atomic="true"

          initial={{ opacity: 0, y: -16, scale: 0.95 }}
          animate={{ opacity: 1, y: 0,   scale: 1    }}
          exit={{    opacity: 0, y: -16, scale: 0.95 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}

          /*
           * Positioning:
           * Mobile  — centered horizontally (left-4 right-4)
           * Desktop — right-aligned (sm:left-auto sm:right-6)
           * top-24  — safely below fixed navbar (navbar ~80px + gap)
           * z-[200] — above navbar (z-50) and project modal (z-[100])
           */
          className="
            glass-card
            fixed z-[200]
            top-24
            left-4 right-4
            sm:left-auto sm:right-6 sm:w-auto sm:max-w-sm
            overflow-hidden
            p-0
          "
        >
          {/* ====================================================
              CONTENT ROW
              ==================================================== */}
          <div className="flex items-start gap-3 p-4">

            {/* Icon with tinted background */}
            <span
              className="
                mt-0.5 flex h-8 w-8 shrink-0
                items-center justify-center
                rounded-lg
              "
              style={{ background: iconBg }}
            >
              <FontAwesomeIcon
                icon={icon}
                aria-hidden="true"
                className="h-4 w-4"
                style={{ color: iconColor }}
              />
            </span>

            {/* Message text */}
            <p
              className="flex-1 text-sm font-medium leading-5 pt-1"
              style={{ color: "var(--text-primary)" }}
            >
              {message}
            </p>

            {/* Dismiss button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Dismiss notification"
              className="
                flex h-7 w-7 shrink-0
                items-center justify-center
                rounded-full
                transition-colors duration-150
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-offset-1
              "
              style={{
                background:        "color-mix(in srgb, var(--text-primary) 8%, transparent)",
                color:             "var(--text-muted)",
                "--tw-ring-color": "var(--accent)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background =
                  "color-mix(in srgb, var(--text-primary) 15%, transparent)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background =
                  "color-mix(in srgb, var(--text-primary) 8%, transparent)";
              }}
            >
              <FontAwesomeIcon
                icon={faXmark}
                className="h-3 w-3"
                aria-hidden="true"
              />
            </button>
          </div>

          {/* ====================================================
              PROGRESS BAR
              Animates from 100% → 0% over `duration` ms.
              Tells user how long before auto-dismiss.
              `key` prop resets animation on each new toast.
              ==================================================== */}
          <div
            className="h-[2px] w-full"
            style={{ background: "var(--border)" }}
          >
            <motion.div
              key={progressKey.current}
              className="h-full origin-left"
              style={{ background: progressBg }}
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{
                duration: duration / 1000,
                ease:     "linear",
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}