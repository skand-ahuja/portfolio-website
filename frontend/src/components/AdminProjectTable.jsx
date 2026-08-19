/**
 * AdminProjectTable.jsx
 *
 * Displays portfolio projects inside the admin dashboard.
 *
 * Features:
 * - Responsive desktop table
 * - Mobile project cards
 * - Featured status
 * - Category badge
 * - Technology tags
 * - GitHub link
 * - Edit action
 * - Permanent delete action
 * - Loading state during deletion
 * - Accessible controls
 * - Dark admin interface
 */

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faPen,
  faTrash,
  faStar,
  faCodeBranch,
  faArrowUpRightFromSquare,
} from "@fortawesome/free-solid-svg-icons";

/* ============================================================
   COMPONENT
   ============================================================ */

export default function AdminProjectTable({
  projects = [],
  onEdit,
  onDelete,
  deletingId = null,
}) {
  /* ----------------------------------------------------------
     EMPTY STATE
     ---------------------------------------------------------- */

  if (projects.length === 0) {
    return (
      <div
        className="
          rounded-2xl
          border
          px-6
          py-14
          text-center
        "
        role="status"
        style={{
          background:
            "var(--surface-elevated)",

          borderColor:
            "var(--border)",
        }}
      >
        <div
          className="
            mx-auto
            mb-4
            flex
            h-14
            w-14
            items-center
            justify-center
            rounded-2xl
          "
          style={{
            background:
              "rgba(129, 140, 248, 0.08)",

            border:
              "1px solid rgba(129, 140, 248, 0.12)",
          }}
        >
          <FontAwesomeIcon
            icon={faCodeBranch}
            className="h-6 w-6"
            style={{
              color:
                "var(--accent)",
            }}
            aria-hidden="true"
          />
        </div>

        <h3
          className="
            text-lg
            font-semibold
          "
        >
          No projects yet
        </h3>

        <p
          className="
            mx-auto
            mt-2
            max-w-sm
            text-sm
            leading-6
          "
          style={{
            color:
              "var(--text-secondary)",
          }}
        >
          Your portfolio does not
          have any projects yet.
          Add your first project
          from the dashboard.
        </p>
      </div>
    );
  }

  return (
    <div
      className="
        overflow-hidden
        rounded-2xl
        border
      "
      style={{
        background:
          "var(--surface-elevated)",

        borderColor:
          "var(--border)",
      }}
      aria-label="Portfolio projects"
    >
      {/* ======================================================
          DESKTOP TABLE
          ====================================================== */}

      <div
        className="
          hidden
          overflow-x-auto
          md:block
        "
      >
        <table
          className="
            w-full
            border-collapse
          "
        >
          <caption
            className="sr-only"
          >
            Portfolio projects
            managed by the
            administrator
          </caption>

          {/* ------------------------------------------------
              TABLE HEADER
              ------------------------------------------------ */}

          <thead>
            <tr
              style={{
                background:
                  "rgba(255, 255, 255, 0.015)",

                borderBottom:
                  "1px solid var(--border)",
              }}
            >
              <TableHeader>
                Project
              </TableHeader>

              <TableHeader>
                Category
              </TableHeader>

              <TableHeader>
                Tech Stack
              </TableHeader>

              <TableHeader>
                Status
              </TableHeader>

              <TableHeader align="right">
                Actions
              </TableHeader>
            </tr>
          </thead>

          {/* ------------------------------------------------
              TABLE BODY
              ------------------------------------------------ */}

          <tbody>
            {projects.map(
              (project) => (
                <ProjectRow
                  key={project.id}
                  project={project}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  deletingId={
                    deletingId
                  }
                />
              )
            )}
          </tbody>
        </table>
      </div>

      {/* ======================================================
          MOBILE CARDS
          ====================================================== */}

      <div
        className="
          space-y-3
          p-3
          md:hidden
        "
      >
        {projects.map(
          (project) => (
            <ProjectMobileCard
              key={project.id}
              project={project}
              onEdit={onEdit}
              onDelete={onDelete}
              deletingId={
                deletingId
              }
            />
          )
        )}
      </div>
    </div>
  );
}

/* ============================================================
   TABLE HEADER
   ============================================================ */

function TableHeader({
  children,
  align = "left",
}) {
  return (
    <th
      scope="col"
      className={`
        px-5
        py-4
        text-${align}
        text-[10px]
        font-semibold
        uppercase
        tracking-[0.08em]
      `}
      style={{
        color:
          "var(--text-muted)",
      }}
    >
      {children}
    </th>
  );
}

/* ============================================================
   DESKTOP PROJECT ROW
   ============================================================ */

function ProjectRow({
  project,
  onEdit,
  onDelete,
  deletingId,
}) {
  const techStack =
    getTechStack(
      project.tech_stack
    );

  return (
    <tr
      className="
        group
        transition-colors
        duration-200
      "
      style={{
        borderBottom:
          "1px solid var(--border)",
      }}
    >
      {/* ====================================================
          PROJECT
          ==================================================== */}

      <td className="px-5 py-4">
        <div
          className="
            flex
            min-w-[240px]
            items-center
            gap-3
          "
        >
          <ProjectThumbnail
            project={project}
          />

          <div className="min-w-0">
            <div
              className="
                flex
                items-center
                gap-2
              "
            >
              <h3
                className="
                  truncate
                  text-sm
                  font-semibold
                "
                style={{
                  color:
                    "var(--text-primary)",
                }}
              >
                {project.title}
              </h3>

              {project.featured && (
                <FontAwesomeIcon
                  icon={faStar}
                  className="
                    h-3
                    w-3
                    shrink-0
                  "
                  style={{
                    color:
                      "var(--accent)",
                  }}
                  title="Featured project"
                  aria-label="Featured project"
                />
              )}
            </div>

            <p
              className="
                mt-1
                max-w-xs
                truncate
                text-xs
              "
              style={{
                color:
                  "var(--text-muted)",
              }}
            >
              {project.description}
            </p>
          </div>
        </div>
      </td>

      {/* ====================================================
          CATEGORY
          ==================================================== */}

      <td className="px-5 py-4">
        <CategoryBadge
          category={
            project.category
          }
        />
      </td>

      {/* ====================================================
          TECH STACK
          ==================================================== */}

      <td className="px-5 py-4">
        <div
          className="
            flex
            max-w-xs
            flex-wrap
            gap-1.5
          "
        >
          {techStack
            .slice(0, 3)
            .map(
              (tech) => (
                <span
                  key={tech}
                  className="
                    rounded-md
                    border
                    px-2
                    py-1
                    text-[10px]
                    font-medium
                  "
                  style={{
                    color:
                      "var(--text-secondary)",

                    background:
                      "rgba(255, 255, 255, 0.025)",

                    borderColor:
                      "var(--border)",
                  }}
                >
                  {tech}
                </span>
              )
            )}

          {techStack.length >
            3 && (
            <span
              className="
                rounded-md
                px-2
                py-1
                text-[10px]
              "
              style={{
                color:
                  "var(--text-muted)",
              }}
            >
              +
              {techStack.length -
                3}
            </span>
          )}
        </div>
      </td>

      {/* ====================================================
          STATUS
          ==================================================== */}

      <td className="px-5 py-4">
        {project.featured ? (
          <span
            className="
              inline-flex
              items-center
              gap-1.5
              rounded-full
              border
              px-2.5
              py-1
              text-[10px]
              font-semibold
            "
            style={{
              background:
                "rgba(129, 140, 248, 0.08)",

              color:
                "var(--accent)",

              borderColor:
                "rgba(129, 140, 248, 0.15)",
            }}
          >
            <FontAwesomeIcon
              icon={faStar}
              className="h-2.5 w-2.5"
              aria-hidden="true"
            />

            Featured
          </span>
        ) : (
          <span
            className="
              inline-flex
              items-center
              rounded-full
              border
              px-2.5
              py-1
              text-[10px]
              font-medium
            "
            style={{
              color:
                "var(--text-muted)",

              borderColor:
                "var(--border)",
            }}
          >
            Standard
          </span>
        )}
      </td>

      {/* ====================================================
          ACTIONS
          ==================================================== */}

      <td className="px-5 py-4">
        <ActionButtons
          project={project}
          onEdit={onEdit}
          onDelete={onDelete}
          deletingId={
            deletingId
          }
        />
      </td>
    </tr>
  );
}

/* ============================================================
   MOBILE PROJECT CARD
   ============================================================ */

function ProjectMobileCard({
  project,
  onEdit,
  onDelete,
  deletingId,
}) {
  return (
    <article
      className="
        rounded-xl
        border
        p-4
      "
      style={{
        background:
          "var(--surface-solid)",

        borderColor:
          "var(--border)",
      }}
    >
      {/* Project information */}

      <div className="flex gap-3">
        <ProjectThumbnail
          project={project}
        />

        <div
          className="
            min-w-0
            flex-1
          "
        >
          <div
            className="
              flex
              items-start
              justify-between
              gap-2
            "
          >
            <h3
              className="
                text-sm
                font-semibold
              "
              style={{
                color:
                  "var(--text-primary)",
              }}
            >
              {project.title}
            </h3>

            {project.featured && (
              <FontAwesomeIcon
                icon={faStar}
                className="
                  h-3
                  w-3
                  shrink-0
                "
                style={{
                  color:
                    "var(--accent)",
                }}
                aria-label="Featured project"
              />
            )}
          </div>

          <p
            className="
              mt-1
              line-clamp-2
              text-xs
              leading-5
            "
            style={{
              color:
                "var(--text-secondary)",
            }}
          >
            {project.description}
          </p>

          <div className="mt-3">
            <CategoryBadge
              category={
                project.category
              }
            />
          </div>
        </div>
      </div>

      {/* Mobile actions */}

      <div
        className="
          mt-4
          border-t
          pt-3
        "
        style={{
          borderColor:
            "var(--border)",
        }}
      >
        <ActionButtons
          project={project}
          onEdit={onEdit}
          onDelete={onDelete}
          deletingId={
            deletingId
          }
          fullWidth
        />
      </div>
    </article>
  );
}

/* ============================================================
   ACTION BUTTONS
   ============================================================ */

function ActionButtons({
  project,
  onEdit,
  onDelete,
  deletingId,
  fullWidth = false,
}) {
  const isDeleting =
    deletingId === project.id;

  return (
    <div
      className={`
        flex
        items-center
        justify-end
        gap-2
        ${fullWidth ? "w-full" : ""}
      `}
    >
      {/* ==================================================
          LIVE PROJECT
          ================================================== */}

      {project.live_url && (
        <a
          href={
            project.live_url
          }
          target="_blank"
          rel="noopener noreferrer"
          className="
            inline-flex
            h-9
            w-9
            items-center
            justify-center
            rounded-lg
            border
            transition-all
            duration-200
            hover:-translate-y-0.5
            hover:bg-white/5
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-[var(--accent)]
          "
          style={{
            color:
              "var(--text-secondary)",

            borderColor:
              "var(--border)",
          }}
          aria-label={`Open live project: ${project.title}`}
          title="Open live project"
        >
          <FontAwesomeIcon
            icon={
              faArrowUpRightFromSquare
            }
            className="h-3.5 w-3.5"
            aria-hidden="true"
          />
        </a>
      )}

      {/* ==================================================
          GITHUB
          ================================================== */}

      {project.github_url && (
        <a
          href={
            project.github_url
          }
          target="_blank"
          rel="noopener noreferrer"
          className="
            inline-flex
            h-9
            w-9
            items-center
            justify-center
            rounded-lg
            border
            transition-all
            duration-200
            hover:-translate-y-0.5
            hover:bg-white/5
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-[var(--accent)]
          "
          style={{
            color:
              "var(--text-secondary)",

            borderColor:
              "var(--border)",
          }}
          aria-label={`Open GitHub repository for ${project.title}`}
          title="GitHub repository"
        >
          <FontAwesomeIcon
            icon={faCodeBranch}
            className="h-3.5 w-3.5"
            aria-hidden="true"
          />
        </a>
      )}

      {/* ==================================================
          EDIT
          ================================================== */}

      <button
        type="button"
        onClick={() =>
          onEdit(project)
        }
        disabled={isDeleting}
        className="
          inline-flex
          h-9
          items-center
          gap-2
          rounded-lg
          border
          px-3
          text-xs
          font-semibold
          transition-all
          duration-200
          hover:-translate-y-0.5
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-[var(--accent)]
          disabled:cursor-not-allowed
          disabled:opacity-50
        "
        style={{
          color:
            "var(--accent)",

          background:
            "rgba(129, 140, 248, 0.06)",

          borderColor:
            "rgba(129, 140, 248, 0.20)",
        }}
        aria-label={`Edit ${project.title}`}
      >
        <FontAwesomeIcon
          icon={faPen}
          className="h-3 w-3"
          aria-hidden="true"
        />

        <span>Edit</span>
      </button>

      {/* ==================================================
          DELETE
          ================================================== */}

      <button
        type="button"
        onClick={() =>
          onDelete(project)
        }
        disabled={isDeleting}
        className="
          inline-flex
          h-9
          items-center
          gap-2
          rounded-lg
          border
          px-3
          text-xs
          font-semibold
          transition-all
          duration-200
          hover:-translate-y-0.5
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-red-500
          disabled:cursor-not-allowed
          disabled:opacity-50
        "
        style={{
          color: "#f87171",

          background:
            "rgba(239, 68, 68, 0.05)",

          borderColor:
            "rgba(239, 68, 68, 0.18)",
        }}
        aria-label={`Delete ${project.title}`}
      >
        <FontAwesomeIcon
          icon={faTrash}
          className="h-3 w-3"
          spin={isDeleting}
          aria-hidden="true"
        />

        <span>
          {isDeleting
            ? "Deleting..."
            : "Delete"}
        </span>
      </button>
    </div>
  );
}

/* ============================================================
   PROJECT THUMBNAIL
   ============================================================ */

function ProjectThumbnail({
  project,
}) {
  if (project.image_url) {
    return (
      <img
        src={project.image_url}
        alt=""
        loading="lazy"
        className="
          h-12
          w-16
          shrink-0
          rounded-lg
          border
          object-cover
        "
        style={{
          borderColor:
            "var(--border)",
        }}
      />
    );
  }

  return (
    <div
      className="
        flex
        h-12
        w-16
        shrink-0
        items-center
        justify-center
        rounded-lg
        border
      "
      style={{
        background:
          "rgba(129, 140, 248, 0.06)",

        borderColor:
          "var(--border)",
      }}
      aria-hidden="true"
    >
      <FontAwesomeIcon
        icon={faCodeBranch}
        className="h-4 w-4"
        style={{
          color:
            "var(--accent)",
        }}
      />
    </div>
  );
}

/* ============================================================
   CATEGORY BADGE
   ============================================================ */

function CategoryBadge({
  category,
}) {
  const labels = {
    web_app: "Web App",

    automation:
      "Automation",

    data_dashboard:
      "Data Dashboard",

    other: "Other",
  };

  return (
    <span
      className="
        inline-flex
        rounded-full
        border
        px-2.5
        py-1
        text-[10px]
        font-semibold
      "
      style={{
        background:
          "rgba(129, 140, 248, 0.06)",

        color:
          "var(--accent)",

        borderColor:
          "rgba(129, 140, 248, 0.15)",
      }}
    >
      {labels[category] ||
        category}
    </span>
  );
}

/* ============================================================
   TECH STACK HELPER
   ============================================================ */

function getTechStack(
  techStack
) {
  if (
    Array.isArray(
      techStack
    )
  ) {
    return techStack;
  }

  if (
    typeof techStack ===
    "string"
  ) {
    return techStack
      .split(",")
      .map(
        (item) =>
          item.trim()
      )
      .filter(Boolean);
  }

  return [];
}