/**
 * Skills.jsx
 *
 * Four-category skills section with expandable skill items.
 * Click a skill to see where it's been used in real projects.
 *
 * FUTURE-PROOFING GUIDE:
 * ──────────────────────
 * 1. To ADD a skill       → add object to relevant category's skills array
 * 2. To ADD a category    → add new object to SKILL_CATEGORIES array
 * 3. To CHANGE heading    → edit SECTION_CONFIG
 * 4. To ADD logo          → add SVG to /public/skills/ folder
 *                           filename must match `logo` field value
 * 5. Logo fallback        → shows first 2 letters if SVG missing/broken
 *
 * Fixes applied:
 * 1. border-accent/30, bg-accent/[0.06] → color-mix() with CSS vars
 * 2. border-current/[0.08], bg-current/[0.015] → var(--border) token
 * 3. text-primary/secondary/muted/accent → inline CSS var styles
 * 4. bg-accent/[0.08], bg-accent/10 → color-mix()
 * 5. border-accent/25 in "Used in" → color-mix()
 * 6. hover states → onMouseEnter/Leave with CSS vars
 * 7. border-b border-current/[0.08] → var(--border)
 * 8. SECTION_CONFIG for easy text updates
 * 9. Glass card on category info panel (left column)
 */

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faCode,
  faDatabase,
  faGear,
  faChartColumn,
} from "@fortawesome/free-solid-svg-icons";

/* ============================================================
   SECTION CONFIG
   ============================================================ */
const SECTION_CONFIG = {
  label:         "Skills & Tools",
  heading:       "The tools behind",
  headingAccent: "the systems I build.",
  subtext:       "Not just a list of technologies. Select a skill to see where I've actually used it.",
};

/* ============================================================
   SKILLS DATA
   
   TO ADD A SKILL: add object { name, logo, usedIn } to skills array.
   TO ADD A CATEGORY: add new object with id, number, label, title,
                      description, icon, skills.
   Logo path: /public/skills/<filename>.svg
   ============================================================ */
const SKILL_CATEGORIES = [
  {
    id:          "build",
    number:      "01",
    label:       "BUILD",
    title:       "Development",
    description: "Frontend, backend and database tools I use to turn ideas into working applications.",
    icon:        faCode,
    skills: [
      { name: "React.js",     logo: "/skills/react.svg",      usedIn: "AMC Tracking, Finance Tracker"    },
      { name: "Node.js",      logo: "/skills/nodejs.svg",     usedIn: "AMC Tracking, Finance Tracker"    },
      { name: "Flask",        logo: "/skills/flask.svg",      usedIn: "Monthly Review Platform"          },
      { name: "Tailwind CSS", logo: "/skills/tailwind.svg",   usedIn: "Web applications"                 },
      { name: "JavaScript",   logo: "/skills/javascript.svg", usedIn: "Monthly Review Platform"          },
      { name: "HTML5",        logo: "/skills/html5.svg",      usedIn: "Web applications"                 },
      { name: "MySQL",        logo: "/skills/mysql.svg",      usedIn: "Monthly Review, AMC Tracking"     },
      { name: "PostgreSQL",   logo: "/skills/postgresql.svg", usedIn: "Finance Cost Tracker"             },
      /* ── ADD MORE SKILLS HERE ─────────────────────────────── */
    ],
  },
  {
    id:          "automate",
    number:      "02",
    label:       "AUTOMATE",
    title:       "Automation",
    description: "Tools I use to remove repetitive work, connect systems and automate operational workflows.",
    icon:        faGear,
    skills: [
      { name: "Python",         logo: "/skills/python.svg",        usedIn: "Monthly Review, Care Dashboard"           },
      { name: "Selenium",       logo: "/skills/selenium.svg",      usedIn: "Monthly Care Dashboard"                   },
      { name: "Power Automate", logo: "/skills/powerautomate.svg", usedIn: "Review Platform, PMO, Care Dashboard"     },
      { name: "Power Apps",     logo: "/skills/powerapps.svg",     usedIn: "PMO Dashboard"                            },
      { name: "REST APIs",      logo: "/skills/api.svg",           usedIn: "Monthly Review, AMC Tracking"             },
    ],
  },
  {
    id:          "visualize",
    number:      "03",
    label:       "VISUALIZE",
    title:       "Data & BI",
    description: "Analysis and visualization tools for turning raw data into useful business information.",
    icon:        faChartColumn,
    skills: [
      { name: "Power BI",   logo: "/skills/powerbi.svg",   usedIn: "PMO Dashboard, Care Dashboard" },
      { name: "Excel",      logo: "/skills/excel.svg",     usedIn: "Coffee Shop Dashboard"         },
      { name: "Pandas",     logo: "/skills/pandas.svg",    usedIn: "Data analysis projects"        },
      { name: "Matplotlib", logo: "/skills/matplotlib.svg",usedIn: "Data analysis projects"        },
      { name: "NumPy",      logo: "/skills/numpy.svg",     usedIn: "Data analysis projects"        },
    ],
  },
  {
    id:          "manage",
    number:      "04",
    label:       "MANAGE",
    title:       "Domain & Platforms",
    description: "Business systems and domain knowledge that connect the technical work to real operational needs.",
    icon:        faDatabase,
    skills: [
      { name: "PMO Reporting",    logo: "/skills/pmo.svg",        usedIn: "Monthly Review, PMO Dashboard"     },
      { name: "Finance Tracking", logo: "/skills/finance.svg",    usedIn: "Finance Cost Tracker"              },
      { name: "Risk Management",  logo: "/skills/risk.svg",       usedIn: "Monthly Review Platform"           },
      { name: "Salesforce",       logo: "/skills/salesforce.svg", usedIn: "Monthly Care Dashboard"            },
      { name: "SharePoint",       logo: "/skills/sharepoint.svg", usedIn: "PMO Dashboard, Care Dashboard"     },
    ],
  },
];

/* ============================================================
   ANIMATION VARIANTS
   ============================================================ */
const fadeUp = (delay = 0) => ({
  initial:     { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0  },
  viewport:    { once: true, margin: "-60px" },
  transition:  { duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] },
});

/* ============================================================
   SKILL LOGO
   Shows SVG logo with graceful 2-letter fallback on error.
   ============================================================ */
function SkillLogo({ skill, isActive }) {
  const [imageError, setImageError] = useState(false);

  /* Reset error when skill changes */
  useEffect(() => { setImageError(false); }, [skill.logo]);

  /* Fallback: first 2 letters in accent bubble */
  if (imageError) {
    return (
      <span
        aria-hidden="true"
        className="font-mono-tag flex h-9 w-9 items-center justify-center rounded-lg text-[10px] font-bold"
        style={{
          background: "color-mix(in srgb, var(--accent) 10%, transparent)",
          color:      "var(--accent)",
        }}
      >
        {skill.name.substring(0, 2).toUpperCase()}
      </span>
    );
  }

  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center">
      <img
        src={skill.logo}
        alt=""
        aria-hidden="true"
        onError={() => setImageError(true)}
        className="h-7 w-7 object-contain transition-all duration-300"
        style={{
          filter:  isActive ? "grayscale(0)" : "grayscale(1)",
          opacity: isActive ? 1 : 0.6,
        }}
      />
    </span>
  );
}

/* ============================================================
   SKILL ITEM
   Expandable button showing where the skill was used.
   ============================================================ */
function SkillItem({ skill, isActive, onToggle }) {
  return (
    <div className="relative">

      {/* Toggle button */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isActive}
        className="group relative flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-all duration-200"
        style={{
          border:     isActive
            ? "1px solid color-mix(in srgb, var(--accent) 30%, transparent)"
            : "1px solid var(--border)",
          background: isActive
            ? "color-mix(in srgb, var(--accent) 6%, transparent)"
            : "color-mix(in srgb, var(--surface-solid) 15%, transparent)",
        }}
        onMouseEnter={(e) => {
          if (!isActive) {
            e.currentTarget.style.transform   = "translateY(-2px)";
            e.currentTarget.style.borderColor = "color-mix(in srgb, var(--accent) 25%, transparent)";
            e.currentTarget.style.background  = "color-mix(in srgb, var(--accent) 4%, transparent)";
          }
        }}
        onMouseLeave={(e) => {
          if (!isActive) {
            e.currentTarget.style.transform   = "";
            e.currentTarget.style.borderColor = "var(--border)";
            e.currentTarget.style.background  = "color-mix(in srgb, var(--surface-solid) 15%, transparent)";
          }
        }}
      >
        {/* Logo */}
        <SkillLogo skill={skill} isActive={isActive} />

        {/* Skill name */}
        <span
          className="min-w-0 flex-1 font-medium transition-colors duration-200"
          style={{
            fontSize: "0.8125rem",   /* 13px */
            color:    isActive ? "var(--text-primary)" : "var(--text-secondary)",
          }}
        >
          {skill.name}
        </span>

        {/* Arrow indicator — rotates 90° when active */}
        <span
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-all duration-200"
          style={isActive ? {
            background: "var(--accent)",
            color:      "#ffffff",
          } : {
            background: "color-mix(in srgb, currentColor 4%, transparent)",
            color:      "var(--text-muted)",
          }}
        >
          <FontAwesomeIcon
            icon={faArrowRight}
            className="h-2.5 w-2.5 transition-transform duration-200"
            style={{ transform: isActive ? "rotate(90deg)" : "rotate(0deg)" }}
          />
        </span>
      </button>

      {/* "Used in" expandable panel */}
      <AnimatePresence initial={false}>
        {isActive && skill.usedIn && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{    opacity: 0, height: 0    }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div
              className="ml-3 pb-1 pl-4 pt-3"
              style={{
                borderLeft: "1px solid color-mix(in srgb, var(--accent) 25%, transparent)",
              }}
            >
              <span
                className="font-mono-tag font-semibold uppercase"
                style={{
                  fontSize:      "0.5625rem",   /* 9px */
                  letterSpacing: "0.14em",
                  color:         "var(--accent)",
                }}
              >
                Used in
              </span>
              <p
                className="mt-1 leading-5"
                style={{
                  fontSize: "0.6875rem",   /* 11px */
                  color:    "var(--text-secondary)",
                }}
              >
                {skill.usedIn}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ============================================================
   SKILL CATEGORY
   One row: left = category info, right = skill grid.
   ============================================================ */
function SkillCategory({ category, categoryIndex }) {
  /* Only one skill expanded at a time per category */
  const [activeSkill, setActiveSkill] = useState(null);

  const handleToggle = (skillName) => {
    setActiveSkill((current) => current === skillName ? null : skillName);
  };

  return (
    <motion.article
      {...fadeUp(categoryIndex * 0.07)}
      className="grid grid-cols-1 gap-7 pb-12 md:grid-cols-[0.34fr_0.66fr] md:gap-12 lg:grid-cols-[0.3fr_0.7fr] lg:gap-16"
      style={{
        /* Bottom border between categories */
        borderBottom: "1px solid var(--border)",
      }}
      /* Remove border on last category */
      ref={(el) => {
        if (el) {
          const isLast = categoryIndex === SKILL_CATEGORIES.length - 1;
          el.style.borderBottom = isLast ? "none" : "1px solid var(--border)";
          el.style.paddingBottom = isLast ? "0" : "3rem";
        }
      }}
    >
      {/* ── LEFT: Category info ─────────────────────────────── */}
      <div>
        {/* Icon + number label */}
        <div className="mb-4 flex items-center gap-3">
          <span
            className="flex h-9 w-9 items-center justify-center rounded-lg"
            style={{
              background: "color-mix(in srgb, var(--accent) 8%, transparent)",
              color:      "var(--accent)",
            }}
          >
            <FontAwesomeIcon icon={category.icon} className="h-3.5 w-3.5" />
          </span>

          <span
            className="font-mono-tag font-semibold uppercase"
            style={{
              fontSize:      "0.5625rem",
              letterSpacing: "0.16em",
              color:         "var(--accent)",
            }}
          >
            {category.number} · {category.label}
          </span>
        </div>

        {/* Category title */}
        <h3
          className="text-xl font-semibold sm:text-2xl"
          style={{
            letterSpacing: "-0.025em",
            color:         "var(--text-primary)",
          }}
        >
          {category.title}
        </h3>

        {/* Category description */}
        <p
          className="mt-3 max-w-xs text-xs leading-6"
          style={{ color: "var(--text-secondary)" }}
        >
          {category.description}
        </p>
      </div>

      {/* ── RIGHT: Skills grid ──────────────────────────────── */}
      <div className="grid content-start grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {category.skills.map((skill, index) => (
          <motion.div
            key={skill.name}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: index * 0.025 }}
          >
            <SkillItem
              skill={skill}
              isActive={activeSkill === skill.name}
              onToggle={() => handleToggle(skill.name)}
            />
          </motion.div>
        ))}
      </div>
    </motion.article>
  );
}

/* ============================================================
   SKILLS — MAIN EXPORT
   ============================================================ */
export default function Skills() {
  return (
    <section id="skills" className="relative px-6 py-20 md:px-12 md:py-24">
      <div className="mx-auto max-w-6xl">

        {/* ── SECTION HEADER ──────────────────────────────────── */}
        <motion.div
          {...fadeUp(0)}
          className="mb-12 md:mb-16"
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

          {/* Heading + subtext */}
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <h2
              className="max-w-2xl font-bold text-3xl sm:text-4xl lg:text-5xl"
              style={{
                lineHeight:    "1.08",
                letterSpacing: "-0.04em",
                color:         "var(--text-primary)",
              }}
            >
              {SECTION_CONFIG.heading}{" "}
              <span style={{ color: "var(--accent)" }}>
                {SECTION_CONFIG.headingAccent}
              </span>
            </h2>

            <p
              className="max-w-sm text-sm leading-6 md:text-right"
              style={{ color: "var(--text-secondary)" }}
            >
              {SECTION_CONFIG.subtext}
            </p>
          </div>
        </motion.div>

        {/* ── CATEGORY LIST ───────────────────────────────────── */}
        <div className="space-y-12">
          {SKILL_CATEGORIES.map((category, index) => (
            <SkillCategory
              key={category.id}
              category={category}
              categoryIndex={index}
            />
          ))}
        </div>

      </div>
    </section>
  );
}