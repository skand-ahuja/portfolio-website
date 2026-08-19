/**
 * AdminProjectForm.jsx
 *
 * Form used by the admin to create or edit portfolio projects.
 *
 * Features:
 * - Create project
 * - Edit project
 * - Client-side validation
 * - Dark admin interface
 * - Loading state
 * - SweetAlert2 error handling
 * - Success callback with action type
 * - Accessible form controls
 */

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faFloppyDisk,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

import {
  createProject,
  updateProject,
} from "../services/adminApi";

import {
  showError,
} from "../utils/alerts";

/* ============================================================
   DEFAULT FORM
   ============================================================ */

const EMPTY_FORM = {
  title: "",
  description: "",
  github_url: "",
  live_url: "",
  tech_stack: "",
  image_url: "",
  category: "web_app",
  featured: false,
  display_order: 0,
};

/* ============================================================
   COMPONENT
   ============================================================ */

export default function AdminProjectForm({
  project = null,
  onSuccess,
  onCancel,
}) {
  const [formData, setFormData] =
    useState(EMPTY_FORM);

  const [isSaving, setIsSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  /* ==========================================================
     LOAD PROJECT INTO FORM
     ========================================================== */

  useEffect(() => {
    if (project) {
      setFormData({
        title:
          project.title || "",

        description:
          project.description || "",

        github_url:
          project.github_url || "",

        live_url:
          project.live_url || "",

        tech_stack:
          project.tech_stack || "",

        image_url:
          project.image_url || "",

        category:
          project.category ||
          "web_app",

        featured:
          Boolean(project.featured),

        display_order:
          project.display_order ?? 0,
      });
    } else {
      setFormData({
        ...EMPTY_FORM,
      });
    }

    setError("");
  }, [project]);

  /* ==========================================================
     INPUT HANDLER
     ========================================================== */

  function handleChange(event) {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setFormData((previous) => ({
      ...previous,

      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));

    if (error) {
      setError("");
    }
  }

  /* ==========================================================
     URL VALIDATION
     ========================================================== */

  function isValidUrl(value) {
    if (!value.trim()) {
      return true;
    }

    try {
      const url = new URL(
        value.trim()
      );

      return (
        url.protocol === "http:" ||
        url.protocol === "https:"
      );
    } catch {
      return false;
    }
  }

  /* ==========================================================
     SUBMIT
     ========================================================== */

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    /* --------------------------------------------------------
       Required field validation
       -------------------------------------------------------- */

    if (!formData.title.trim()) {
      setError(
        "Project title is required."
      );

      return;
    }

    if (
      !formData.description.trim()
    ) {
      setError(
        "Project description is required."
      );

      return;
    }

    if (
      !formData.tech_stack.trim()
    ) {
      setError(
        "Please enter the technology stack."
      );

      return;
    }

    /* --------------------------------------------------------
       URL validation
       -------------------------------------------------------- */

    const urlsToValidate = [
      {
        label: "GitHub URL",
        value:
          formData.github_url,
      },
      {
        label: "Live URL",
        value:
          formData.live_url,
      },
      {
        label: "Image URL",
        value:
          formData.image_url,
      },
    ];

    for (
      const item of urlsToValidate
    ) {
      if (
        !isValidUrl(item.value)
      ) {
        setError(
          `${item.label} must be a valid HTTP or HTTPS URL.`
        );

        return;
      }
    }

    /* --------------------------------------------------------
       Start saving
       -------------------------------------------------------- */

    setIsSaving(true);

    try {
      const payload = {
        title:
          formData.title.trim(),

        description:
          formData.description.trim(),

        github_url:
          formData.github_url.trim() ||
          null,

        live_url:
          formData.live_url.trim() ||
          null,

        tech_stack:
          formData.tech_stack.trim(),

        image_url:
          formData.image_url.trim() ||
          null,

        category:
          formData.category,

        featured:
          Boolean(
            formData.featured
          ),

        display_order:
          Number(
            formData.display_order
          ) || 0,
      };

      /* ------------------------------------------------------
         CREATE
         ------------------------------------------------------ */

      if (!project) {
        await createProject(
          payload
        );

        /*
         * Tell AdminDashboard that a new
         * project was created.
         */
        if (onSuccess) {
          await onSuccess(
            "created"
          );
        }

        return;
      }

      /* ------------------------------------------------------
         UPDATE
         ------------------------------------------------------ */

      await updateProject(
        project.id,
        payload
      );

      /*
       * Tell AdminDashboard that an
       * existing project was updated.
       */
      if (onSuccess) {
        await onSuccess(
          "updated"
        );
      }
    } catch (requestError) {
      console.error(
        "Project save failed:",
        requestError
      );

      const message =
        requestError.message ||
        "Unable to save project.";

      setError(message);

      /*
       * Show a professional error popup.
       *
       * Backend/internal details should ideally
       * remain generic in production.
       */
      await showError(
        "Unable to save project",
        message
      );
    } finally {
      setIsSaving(false);
    }
  }

  /* ==========================================================
     RENDER
     ========================================================== */

  return (
    <section
      className="
        rounded-3xl
        border
        p-5
        sm:p-6
      "
      style={{
        background:
          "var(--surface-elevated)",

        borderColor:
          "var(--border)",

        boxShadow:
          "0 16px 50px rgba(0, 0, 0, 0.25)",
      }}
      aria-labelledby="project-form-title"
    >
      {/* ======================================================
          HEADER
          ====================================================== */}

      <div
        className="
          mb-6
          flex
          items-start
          justify-between
          gap-4
        "
      >
        <div>
          <p
            className="
              mb-1
              font-mono
              text-[9px]
              font-semibold
              uppercase
              tracking-[0.14em]
            "
            style={{
              color:
                "var(--accent)",
            }}
          >
            Project Management
          </p>

          <h2
            id="project-form-title"
            className="
              font-heading
              text-xl
              font-bold
            "
          >
            {project
              ? "Edit Project"
              : "Add Project"}
          </h2>

          <p
            className="
              mt-1
              text-xs
            "
            style={{
              color:
                "var(--text-secondary)",
            }}
          >
            {project
              ? "Update the project details below."
              : "Add a new project to your portfolio."}
          </p>
        </div>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSaving}
            aria-label="Close project form"
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-lg
              transition-all
              hover:bg-white/5
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-[var(--accent)]
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
            style={{
              color:
                "var(--text-muted)",
            }}
          >
            <FontAwesomeIcon
              icon={faXmark}
              className="h-4 w-4"
              aria-hidden="true"
            />
          </button>
        )}
      </div>

      {/* ======================================================
          INLINE ERROR
          ====================================================== */}

      {error && (
        <div
          className="
            mb-5
            rounded-xl
            border
            px-4
            py-3
            text-sm
          "
          role="alert"
          aria-live="assertive"
          style={{
            color: "#f87171",

            background:
              "rgba(239, 68, 68, 0.06)",

            borderColor:
              "rgba(239, 68, 68, 0.20)",
          }}
        >
          {error}
        </div>
      )}

      {/* ======================================================
          FORM
          ====================================================== */}

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
        noValidate
      >
        {/* Title */}

        <FormField
          label="Project title"
          name="title"
          value={
            formData.title
          }
          onChange={
            handleChange
          }
          placeholder="e.g. Portfolio Website"
          required
          disabled={isSaving}
        />

        {/* Description */}

        <div>
          <label
            htmlFor="project-description"
            className="
              mb-2
              block
              text-sm
              font-semibold
            "
          >
            Description
          </label>

          <textarea
            id="project-description"
            name="description"
            value={
              formData.description
            }
            onChange={
              handleChange
            }
            placeholder="Describe what this project does..."
            rows={5}
            maxLength={2000}
            required
            disabled={isSaving}
            className="
              w-full
              resize-y
              rounded-xl
              border
              px-4
              py-3
              text-sm
              leading-6
              outline-none
              transition-all
              placeholder:text-zinc-600
              focus:border-[var(--accent)]
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
            style={{
              color:
                "var(--text-primary)",

              background:
                "var(--surface-solid)",

              borderColor:
                "var(--border)",
            }}
          />
        </div>

        {/* URLs */}

        <div
          className="
            grid
            grid-cols-1
            gap-5
            md:grid-cols-2
          "
        >
          <FormField
            label="GitHub URL"
            name="github_url"
            type="url"
            value={
              formData.github_url
            }
            onChange={
              handleChange
            }
            placeholder="https://github.com/..."
            disabled={isSaving}
          />

          <FormField
            label="Live URL"
            name="live_url"
            type="url"
            value={
              formData.live_url
            }
            onChange={
              handleChange
            }
            placeholder="https://example.com"
            disabled={isSaving}
          />
        </div>

        {/* Tech stack */}

        <FormField
          label="Tech stack"
          name="tech_stack"
          value={
            formData.tech_stack
          }
          onChange={
            handleChange
          }
          placeholder="React, Node.js, PostgreSQL, Tailwind CSS"
          required
          disabled={isSaving}
        />

        <p
          className="
            -mt-3
            text-[11px]
          "
          style={{
            color:
              "var(--text-muted)",
          }}
        >
          Separate technologies
          with commas.
        </p>

        {/* Image */}

        <FormField
          label="Image URL"
          name="image_url"
          type="url"
          value={
            formData.image_url
          }
          onChange={
            handleChange
          }
          placeholder="https://..."
          disabled={isSaving}
        />

        {/* Category + display order */}

        <div
          className="
            grid
            grid-cols-1
            gap-5
            md:grid-cols-2
          "
        >
          <div>
            <label
              htmlFor="project-category"
              className="
                mb-2
                block
                text-sm
                font-semibold
              "
            >
              Category
            </label>

            <select
              id="project-category"
              name="category"
              value={
                formData.category
              }
              onChange={
                handleChange
              }
              disabled={isSaving}
              className="
                h-12
                w-full
                rounded-xl
                border
                px-4
                text-sm
                outline-none
                transition-all
                focus:border-[var(--accent)]
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
              style={{
                color:
                  "var(--text-primary)",

                background:
                  "var(--surface-solid)",

                borderColor:
                  "var(--border)",
              }}
            >
              <option value="web_app">
                Web App
              </option>

              <option value="automation">
                Automation
              </option>

              <option value="data_dashboard">
                Data Dashboard
              </option>

              <option value="other">
                Other
              </option>
            </select>
          </div>

          <FormField
            label="Display order"
            name="display_order"
            type="number"
            value={
              formData.display_order
            }
            onChange={
              handleChange
            }
            min="0"
            disabled={isSaving}
          />
        </div>

        {/* Featured */}

        <label
          className="
            flex
            cursor-pointer
            items-center
            gap-3
            rounded-xl
            border
            p-4
            transition-colors
            hover:bg-white/[0.02]
          "
          style={{
            borderColor:
              "var(--border)",
          }}
        >
          <input
            type="checkbox"
            name="featured"
            checked={
              formData.featured
            }
            onChange={
              handleChange
            }
            disabled={isSaving}
            className="
              h-4
              w-4
              accent-[var(--accent)]
            "
          />

          <span>
            <span
              className="
                block
                text-sm
                font-semibold
              "
            >
              Featured project
            </span>

            <span
              className="
                mt-0.5
                block
                text-xs
              "
              style={{
                color:
                  "var(--text-secondary)",
              }}
            >
              Display this project
              as a featured project.
            </span>
          </span>
        </label>

        {/* ====================================================
            ACTIONS
            ==================================================== */}

        <div
          className="
            flex
            flex-col-reverse
            gap-3
            pt-2
            sm:flex-row
            sm:justify-end
          "
        >
          {onCancel && (
            <button
              type="button"
              onClick={
                onCancel
              }
              disabled={isSaving}
              className="
                h-11
                rounded-xl
                border
                px-5
                text-sm
                font-semibold
                transition-all
                hover:bg-white/5
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-[var(--accent)]
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
              style={{
                color:
                  "var(--text-primary)",

                borderColor:
                  "var(--border)",

                background:
                  "var(--surface-solid)",
              }}
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            disabled={isSaving}
            className="
              inline-flex
              h-11
              items-center
              justify-center
              gap-2
              rounded-xl
              px-5
              text-sm
              font-semibold
              text-white
              transition-all
              hover:-translate-y-0.5
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-[var(--accent)]
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
            style={{
              background:
                "var(--accent)",

              boxShadow:
                "0 8px 24px rgba(129, 140, 248, 0.18)",
            }}
          >
            <FontAwesomeIcon
              icon={faFloppyDisk}
              className="h-3.5 w-3.5"
              aria-hidden="true"
            />

            {isSaving
              ? "Saving..."
              : project
                ? "Update Project"
                : "Save Project"}
          </button>
        </div>
      </form>
    </section>
  );
}

/* ============================================================
   REUSABLE INPUT
   ============================================================ */

function FormField({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  min,
}) {
  const id = `project-${name}`;

  return (
    <div>
      <label
        htmlFor={id}
        className="
          mb-2
          block
          text-sm
          font-semibold
        "
      >
        {label}
      </label>

      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        min={min}
        maxLength={
          type === "url"
            ? 255
            : 150
        }
        className="
          h-12
          w-full
          rounded-xl
          border
          px-4
          text-sm
          outline-none
          transition-all
          placeholder:text-zinc-600
          focus:border-[var(--accent)]
          disabled:cursor-not-allowed
          disabled:opacity-60
        "
        style={{
          color:
            "var(--text-primary)",

          background:
            "var(--surface-solid)",

          borderColor:
            "var(--border)",
        }}
      />
    </div>
  );
}