// alerts.js - Apple-Grade Alerts with High Contrast Buttons & Timer
import Swal from "sweetalert2";

const baseConfig = {
  background: "rgba(28, 28, 30, 0.75)",
  color: "#f5f5f7",
  backdrop: "rgba(0, 0, 0, 0.7)",
  customClass: {
    popup: "backdrop-blur-2xl border border-white/10 rounded-[1.5rem] shadow-2xl",
    title: "text-xl font-bold tracking-tight",
    htmlContainer: "text-[14px] text-gray-400",
    actions: "gap-3 w-full justify-center mt-6",
    // 🍏 FIXED: Added !text-black and !text-white to force high contrast
    confirmButton: "flex h-11 items-center justify-center rounded-full bg-white px-6 text-[14px] font-bold !text-black transition-transform hover:scale-105 shadow-[0_0_15px_rgba(255,255,255,0.15)]",
    cancelButton: "flex h-11 items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 text-[14px] font-semibold !text-white transition-all hover:bg-white/10",
  },
  buttonsStyling: false,
};

// 🍏 NEW: Added timer support for auto-closing (like the 5-sec logout)
export const showSuccess = (title, text = "", timer = null) => Swal.fire({ 
  ...baseConfig, icon: "success", title, text, confirmButtonText: "Done",
  timer: timer, timerProgressBar: !!timer 
});

export const showError = (title = "Something went wrong", text = "Please try again.") => Swal.fire({ ...baseConfig, icon: "error", title, text, confirmButtonText: "Close" });

export const showWarning = (title, text) => Swal.fire({ ...baseConfig, icon: "warning", title, text, confirmButtonText: "OK" });

export const confirmDelete = (projectTitle) => Swal.fire({
  ...baseConfig, icon: "warning", title: "Delete project?",
  html: `<p style="margin:0;line-height:1.6;"><strong>${escapeHtml(projectTitle)}</strong> will be permanently deleted.</p><p style="margin:10px 0 0;font-size:0.85rem;opacity:0.7;">This action cannot be undone.</p>`,
  showCancelButton: true, confirmButtonText: "Yes, delete it", cancelButtonText: "Cancel", reverseButtons: true, focusCancel: true,
  customClass: { 
    ...baseConfig.customClass, 
    // Red button for destructive actions
    confirmButton: "flex h-11 items-center justify-center rounded-full bg-red-500 px-6 text-[14px] font-bold !text-white transition-transform hover:scale-105 shadow-[0_0_15px_rgba(239,68,68,0.3)]" 
  }
});

export const confirmLogout = () => Swal.fire({
  ...baseConfig, icon: "question", title: "Logout?", text: "You will need to sign in again to access the admin panel.",
  showCancelButton: true, confirmButtonText: "Yes, logout", cancelButtonText: "Stay logged in", reverseButtons: true, focusCancel: true
});

function escapeHtml(value) {
  return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}