import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faCircleXmark, faXmark } from "@fortawesome/free-solid-svg-icons";

export default function Toast({ message, type = "success", onClose, duration = 4000 }) {
  useEffect(() => { if (!message) return; const t = setTimeout(onClose, duration); return () => clearTimeout(t); }, [message, onClose, duration]);
  const progressKey = useRef(0); if (message) progressKey.current += 1;

  const config = { success: { icon: faCircleCheck, color: "var(--color-success)" }, error: { icon: faCircleXmark, color: "var(--color-error)" } };
  const { icon, color } = config[type] ?? config.success;

  return (
    <AnimatePresence>
      {message && (
        <motion.div initial={{ opacity: 0, y: -20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -20, scale: 0.95 }} className="fixed left-0 right-0 top-24 z-[200] mx-auto w-[90%] max-w-sm overflow-hidden rounded-2xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--surface-solid)_80%,transparent)] shadow-2xl backdrop-blur-2xl">
          <div className="flex items-start gap-3 p-4">
            <span className="mt-0.5 flex shrink-0 items-center justify-center text-[18px]" style={{ color }}><FontAwesomeIcon icon={icon} /></span>
            <p className="flex-1 pt-0.5 text-[13px] font-medium text-[var(--text-primary)]">{message}</p>
            <button onClick={onClose} className="flex h-6 w-6 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--text-primary)_10%,transparent)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"><FontAwesomeIcon icon={faXmark} className="h-3 w-3" /></button>
          </div>
          <div className="h-[2px] w-full bg-[var(--border)]">
            <motion.div key={progressKey.current} initial={{ scaleX: 1 }} animate={{ scaleX: 0 }} transition={{ duration: duration / 1000, ease: "linear" }} className="h-full origin-left" style={{ background: color }} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}