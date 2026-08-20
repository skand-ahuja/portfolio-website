// Skills.jsx - Interactive Matrix with Original Color Glow
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faCode, faDatabase, faGear, faChartColumn } from "@fortawesome/free-solid-svg-icons";

const SECTION_CONFIG = { label: "Skills & Tools", heading: "The tools behind", headingAccent: "the systems I build.", subtext: "Not just a list of technologies. Select a skill to see where I've actually used it." };
const fadeUp = (delay = 0) => ({ initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-60px" }, transition: { duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] } });

const SKILL_CATEGORIES = [
  { id: "build", number: "01", label: "BUILD", title: "Development", description: "Frontend, backend and database tools I use to turn ideas into working applications.", icon: faCode, skills: [{ name: "React.js", logo: "/skills/react.svg", usedIn: "AMC Tracking, Finance Tracker" }, { name: "Node.js", logo: "/skills/nodejs.svg", usedIn: "AMC Tracking, Finance Tracker" }, { name: "Flask", logo: "/skills/flask.svg", usedIn: "Monthly Review Platform" }, { name: "Tailwind CSS", logo: "/skills/tailwind.svg", usedIn: "Web applications" }, { name: "JavaScript", logo: "/skills/javascript.svg", usedIn: "Monthly Review Platform" }, { name: "HTML5", logo: "/skills/html5.svg", usedIn: "Web applications" }, { name: "MySQL", logo: "/skills/mysql.svg", usedIn: "Monthly Review, AMC Tracking" }, { name: "PostgreSQL", logo: "/skills/postgresql.svg", usedIn: "Finance Cost Tracker" }] },
  { id: "automate", number: "02", label: "AUTOMATE", title: "Automation", description: "Tools I use to remove repetitive work, connect systems and automate operational workflows.", icon: faGear, skills: [{ name: "Python", logo: "/skills/python.svg", usedIn: "Monthly Review, Care Dashboard" }, { name: "Selenium", logo: "/skills/selenium.svg", usedIn: "Monthly Care Dashboard" }, { name: "Power Automate", logo: "/skills/powerautomate.svg", usedIn: "Review Platform, PMO, Care Dashboard" }, { name: "Power Apps", logo: "/skills/powerapps.svg", usedIn: "PMO Dashboard" }, { name: "REST APIs", logo: "/skills/api.svg", usedIn: "Monthly Review, AMC Tracking" }] },
  { id: "visualize", number: "03", label: "VISUALIZE", title: "Data & BI", description: "Analysis and visualization tools for turning raw data into useful business information.", icon: faChartColumn, skills: [{ name: "Power BI", logo: "/skills/powerbi.svg", usedIn: "PMO Dashboard, Care Dashboard" }, { name: "Excel", logo: "/skills/excel.svg", usedIn: "Coffee Shop Dashboard" }, { name: "Pandas", logo: "/skills/pandas.svg", usedIn: "Data analysis projects" }, { name: "Matplotlib", logo: "/skills/matplotlib.svg", usedIn: "Data analysis projects" }, { name: "NumPy", logo: "/skills/numpy.svg", usedIn: "Data analysis projects" }] },
  { id: "manage", number: "04", label: "MANAGE", title: "Domain & Platforms", description: "Business systems and domain knowledge that connect the technical work to real operational needs.", icon: faDatabase, skills: [{ name: "PMO Reporting", logo: "/skills/pmo.svg", usedIn: "Monthly Review, PMO Dashboard" }, { name: "Finance Tracking", logo: "/skills/finance.svg", usedIn: "Finance Cost Tracker" }, { name: "Risk Management", logo: "/skills/risk.svg", usedIn: "Monthly Review Platform" }, { name: "Salesforce", logo: "/skills/salesforce.svg", usedIn: "Monthly Care Dashboard" }, { name: "SharePoint", logo: "/skills/sharepoint.svg", usedIn: "PMO Dashboard, Care Dashboard" }] }
];

// ORIGINAL COLOR GLOW LOGIC
function SkillLogo({ skill, isActive, isHovered }) {
  const [imageError, setImageError] = useState(false);
  useEffect(() => setImageError(false), [skill.logo]);

  if (imageError) return <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] font-mono text-[9px] font-bold text-[var(--accent)]">{skill.name.substring(0, 2).toUpperCase()}</span>;
  
  const showColor = isActive || isHovered;
  
  return (
    <img 
      src={skill.logo} alt="" onError={() => setImageError(true)} 
      className="h-6 w-6 object-contain transition-all duration-300"
      style={{
        filter: showColor ? "grayscale(0) drop-shadow(0px 2px 4px rgba(255,255,255,0.1))" : "grayscale(100%) opacity(0.6)",
      }} 
    />
  );
}

function SkillItem({ skill, isActive, onToggle }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <button 
        onClick={onToggle} 
        className="group relative flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]" 
        style={{ 
          borderColor: isActive || isHovered ? "color-mix(in srgb, var(--accent) 30%, transparent)" : "var(--border)", 
          background: isActive || isHovered ? "color-mix(in srgb, var(--accent) 4%, transparent)" : "color-mix(in srgb, var(--surface-solid) 15%, transparent)",
          transform: isHovered && !isActive ? "translateY(-2px)" : "none"
        }}
      >
        <SkillLogo skill={skill} isActive={isActive} isHovered={isHovered} />
        <span className="min-w-0 flex-1 text-[13px] font-medium transition-colors" style={{ color: isActive || isHovered ? "var(--text-primary)" : "var(--text-secondary)" }}>
          {skill.name}
        </span>
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-all duration-200" style={{ background: isActive ? "var(--accent)" : "color-mix(in srgb, currentColor 5%, transparent)", color: isActive ? "#ffffff" : "var(--text-muted)" }}>
          <FontAwesomeIcon icon={faArrowRight} className="h-2.5 w-2.5 transition-transform duration-200" style={{ transform: isActive ? "rotate(90deg)" : "rotate(0deg)" }} />
        </span>
      </button>
      
      {/* Restored exact original "Used In" layout */}
      <AnimatePresence>
        {isActive && skill.usedIn && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }} className="overflow-hidden">
            <div className="ml-3 pb-1 pl-4 pt-3" style={{ borderLeft: "1px solid color-mix(in srgb, var(--accent) 25%, transparent)" }}>
              <span className="font-mono text-[9px] font-semibold uppercase tracking-widest text-[var(--accent)]">Used in</span>
              <p className="mt-1 text-[11px] leading-5 text-[var(--text-secondary)]">{skill.usedIn}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SkillCategory({ category, categoryIndex }) {
  const [activeSkill, setActiveSkill] = useState(null);
  const handleToggle = (name) => setActiveSkill(cur => cur === name ? null : name);

  return (
    <motion.article {...fadeUp(categoryIndex * 0.07)} className={`grid grid-cols-1 gap-7 pb-12 md:grid-cols-[0.34fr_0.66fr] md:gap-12 lg:grid-cols-[0.3fr_0.7fr] lg:gap-16 ${categoryIndex !== SKILL_CATEGORIES.length - 1 ? "border-b border-[var(--border)]" : ""}`}>
      <div>
        <div className="mb-4 flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[color-mix(in_srgb,var(--accent)_8%,transparent)] text-[var(--accent)]"><FontAwesomeIcon icon={category.icon} className="h-3.5 w-3.5" /></span><span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[var(--accent)]">{category.number} &middot; {category.label}</span></div>
        <h3 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">{category.title}</h3>
        <p className="mt-3 text-[14px] leading-relaxed text-[var(--text-secondary)]">{category.description}</p>
      </div>
      <div className="grid content-start grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {category.skills.map((skill) => <SkillItem key={skill.name} skill={skill} isActive={activeSkill === skill.name} onToggle={() => handleToggle(skill.name)} />)}
      </div>
    </motion.article>
  );
}

export default function Skills() {
  return (
    <section id="skills" className="relative px-6 py-20 md:px-12 md:py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div {...fadeUp(0)} className="mb-12 md:mb-16">
          <div className="mb-4 flex items-center gap-3"><span className="block h-px w-7 bg-[var(--accent)]" /><span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[var(--accent)]">{SECTION_CONFIG.label}</span></div>
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <h2 className="text-4xl font-bold tracking-tight text-[var(--text-primary)] lg:text-5xl">{SECTION_CONFIG.heading} <span className="text-[var(--accent)]">{SECTION_CONFIG.headingAccent}</span></h2>
            <p className="max-w-sm text-[14px] leading-relaxed text-[var(--text-secondary)] md:text-right">{SECTION_CONFIG.subtext}</p>
          </div>
        </motion.div>
        <div className="space-y-12">
          {SKILL_CATEGORIES.map((category, index) => <SkillCategory key={category.id} category={category} categoryIndex={index} />)}
        </div>
      </div>
    </section>
  );
}