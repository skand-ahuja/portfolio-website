/**
 * alerts.js
 *
 * Centralized SweetAlert2 helpers.
 *
 * Why?
 * Instead of configuring SweetAlert2 differently in every
 * component, we keep all notification behaviour here.
 *
 * This gives the admin panel a consistent visual language.
 */

import Swal from "sweetalert2";

/* ============================================================
   COMMON CONFIGURATION
   ============================================================ */

const baseConfig = {
  background: "#11111a",
  color: "#f4f4f5",
  confirmButtonColor: "#818cf8",
};

/* ============================================================
   SUCCESS
   ============================================================ */

/**
 * Shows a successful operation message.
 */
export function showSuccess(
  title,
  text = ""
) {
  return Swal.fire({
    ...baseConfig,

    icon: "success",

    title,

    text,

    confirmButtonText: "Done",

    buttonsStyling: true,
  });
}

/* ============================================================
   ERROR
   ============================================================ */

/**
 * Shows an error message.
 */
export function showError(
  title = "Something went wrong",
  text = "Please try again."
) {
  return Swal.fire({
    ...baseConfig,

    icon: "error",

    title,

    text,

    confirmButtonText: "Close",

    confirmButtonColor: "#ef4444",
  });
}

/* ============================================================
   WARNING
   ============================================================ */

/**
 * Shows a warning message.
 */
export function showWarning(
  title,
  text
) {
  return Swal.fire({
    ...baseConfig,

    icon: "warning",

    title,

    text,

    confirmButtonText: "OK",
  });
}

/* ============================================================
   DELETE CONFIRMATION
   ============================================================ */

/**
 * Asks the administrator to confirm a permanent deletion.
 *
 * Returns:
 * {
 *   isConfirmed: true / false
 * }
 */
export function confirmDelete(
  projectTitle
) {
  return Swal.fire({
    ...baseConfig,

    icon: "warning",

    title: "Delete project?",

    html: `
      <p style="margin: 0; line-height: 1.6;">
        <strong>${escapeHtml(
          projectTitle
        )}</strong>
        will be permanently deleted.
      </p>

      <p style="
        margin: 10px 0 0;
        font-size: 0.85rem;
        opacity: 0.7;
      ">
        This action cannot be undone.
      </p>
    `,

    showCancelButton: true,

    confirmButtonText:
      "Yes, delete it",

    cancelButtonText:
      "Cancel",

    reverseButtons: true,

    focusCancel: true,

    confirmButtonColor:
      "#22a906",

    cancelButtonColor: "#ef4444",
  });
}

/* ============================================================
   LOGOUT CONFIRMATION
   ============================================================ */

/**
 * Asks before ending the admin session.
 */
export function confirmLogout() {
  return Swal.fire({
    ...baseConfig,

    icon: "question",

    title: "Logout?",

    text:
      "You will need to sign in again to access the admin panel.",

    showCancelButton: true,

    confirmButtonText:
      "Yes, logout",

    cancelButtonText:
      "Stay logged in",

    reverseButtons: true,

    focusCancel: true,
  });
}

/* ============================================================
   HTML ESCAPE
   ============================================================ */

/**
 * Prevents user-controlled project titles from being
 * interpreted as HTML inside SweetAlert.
 */
function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}