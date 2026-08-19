import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBolt, faChartLine, faCode } from "@fortawesome/free-solid-svg-icons";
import { aboutNarrative, aboutHighlight, aboutClosing } from "../data/about";

// -----------------------------------------------------------------------------
// DATA: Journey Timeline
// -----------------------------------------------------------------------------
// NOTE: If this array grows or requires internationalization in the future, 
// move it to a dedicated file (e.g., `../data/journey.js`) and import it.
const JOURNEY = [
  {
    id: "engineering",
    number: "01",
    period: "Feb 2023 — Apr 2025",
    title: "Project Engineer",
    subtitle: "Electrical & Electronics",
    skills: ["Field execution", "Technical documentation", "Project coordination"],
    icon: faBolt,
  },
  {
    id: "analytics",
    number: "02",
    period: "May 2025 — Present",
    title: "Data Analytics",
    subtitle: "Power BI · Python · Power Platform",
    skills: ["Dashboards", "Reporting systems", "Workflow automation"],
    icon: faChartLine,
  },
  {
    id: "development",
    number: "03",
    period: "Growing alongside analytics",
    title: "Full-Stack Development",
    subtitle: "React · Node.js · Flask",
    skills: ["Web applications", "APIs & databases", "Data-driven systems"],
    icon: faCode,
  },
];

// -----------------------------------------------------------------------------
// COMPONENT: JourneyItem
// -----------------------------------------------------------------------------
/**
 * Renders an individual node in the journey timeline.
 * Engineered to handle dynamic spacing and timeline connection lines via `isLast`.
 */
function JourneyItem({ stage, index, isLast }) {
  return (
    <motion.article
      initial={{ opacity: 0, x: 16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      className="relative grid grid-cols-[42px_1fr] gap-4"
    >
      {/* TIMELINE RAIL: Contains the icon and the vertical connection line */}
      <div className="relative flex justify-center">
        {/* Connection line spans down to the next item, omitted on the last item */}
        {!isLast && (
          <span
            aria-hidden="true"
            className="absolute left-1/2 top-10 h-[calc(100%-0.5rem)] w-px -translate-x-1/2 bg-current/[0.1]"
          />
        )}

        {/* Icon wrapper with unified design tokens */}
        <span className="relative z-10 flex h-9 w-9 items-center justify-center rounded-lg border border-accent/15 bg-accent/[0.08] text-accent">
          <FontAwesomeIcon icon={stage.icon} className="h-3.5 w-3.5" />
        </span>
      </div>

      {/* CONTENT: Node metadata, title, and skills */}
      <div className={isLast ? "pb-0" : "pb-8"}>
        {/* Meta: Number & Period */}
        <div className="mb-1.5 flex flex-wrap items-center gap-2">
          <span className="font-mono-tag text-[9px] font-semibold tracking-[0.14em] text-accent">
            {stage.number}
          </span>
          <span aria-hidden="true" className="h-px w-3 bg-current/15" />
          <span className="font-mono-tag text-[9px] tracking-[0.06em] text-muted">
            {stage.period}
          </span>
        </div>

        <h3 className="text-lg font-semibold tracking-[-0.02em] text-primary">
          {stage.title}
        </h3>

        <p className="mt-1 text-xs font-medium text-accent">
          {stage.subtitle}
        </p>

        {/* Skills Mapping: Includes dynamic bullet separators */}
        <div className="mt-3 flex flex-wrap gap-x-2 gap-y-1">
          {stage.skills.map((skill, skillIndex) => (
            <span key={skill} className="flex items-center gap-2 text-[11px] text-secondary">
              {skill}
              {skillIndex < stage.skills.length - 1 && (
                <span aria-hidden="true" className="h-1 w-1 rounded-full bg-accent/50" />
              )}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  );
}

// -----------------------------------------------------------------------------
// MAIN COMPONENT: About
// -----------------------------------------------------------------------------
/**
 * The About section serves as the "Origin Story".
 * Intentionally minimal: utilizes only the first two paragraphs of the narrative
 * to prevent text fatigue, driving the user's focus to the journey timeline.
 */
export default function About() {
  const shortNarrative = aboutNarrative.slice(0, 2);

  return (
    <section id="about" className="relative px-6 py-20 md:px-12 md:py-24">
      <div className="mx-auto max-w-6xl">
        
        {/* SECTION LABEL */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.4 }}
          className="mb-5 flex items-center gap-3"
        >
          <span className="block h-px w-7 bg-accent" />
          <span className="font-mono-tag text-[10px] font-semibold uppercase tracking-[0.16em] text-accent">
            &gt; ORIGIN_STORY.MD
          </span>
        </motion.div>

        {/* MAIN GRID: Two-column layout on large screens */}
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20 xl:gap-24">
          
          {/* LEFT COLUMN: Narrative & Philosophy */}
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45 }}
              className="max-w-xl text-3xl font-bold leading-[1.08] tracking-[-0.04em] text-primary sm:text-4xl lg:text-5xl"
            >
              From wiring circuits to wiring{" "}
              <span className="text-accent">systems.</span>
            </motion.h2>

            {/* Narrative Paragraphs */}
            <div className="mt-6 max-w-xl space-y-4">
              {shortNarrative.map((paragraph, index) => (
                <motion.p
                  key={`${index}-${paragraph.substring(0, 10)}`}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: index * 0.05 }}
                  className="text-sm leading-7 text-secondary sm:text-[15px]"
                >
                  {paragraph}
                </motion.p>
              ))}
            </div>

            {/* Personal Philosophy Blockquote */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="relative mt-7 max-w-xl border-l-2 border-accent pl-5"
            >
              <span aria-hidden="true" className="absolute -left-[5px] top-2 h-2 w-2 rounded-full bg-accent" />
              <p className="text-sm leading-7 text-secondary">
                <span className="font-semibold text-primary">{aboutHighlight}</span>
                {aboutClosing && ` ${aboutClosing}`}
              </p>
            </motion.div>
          </div>

          {/* RIGHT COLUMN: Journey Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, delay: 0.06 }}
            className="lg:pt-1"
          >
            {/* Timeline Header */}
            <div className="mb-7 flex items-center justify-between gap-4 border-b border-current/[0.08] pb-3">
              <span className="font-mono-tag text-[9px] font-semibold uppercase tracking-[0.15em] text-muted">
                Journey
              </span>
              <span className="hidden font-mono-tag text-[9px] tracking-[0.08em] text-muted sm:block">
                ENGINEERING {" → "} DATA {" → "} SOFTWARE
              </span>
            </div>

            {/* Timeline Item Render */}
            <div>
              {JOURNEY.map((stage, index) => (
                <JourneyItem
                  key={stage.id}
                  stage={stage}
                  index={index}
                  isLast={index === JOURNEY.length - 1}
                />
              ))}
            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}