/**
 * skills.js — content data for the Skills section.
 *
 * Structured as "Build / Automate / Visualize / Manage" per the
 * finalized plan: this framing tells a narrative (what the person
 * DOES) rather than a flat list of buzzwords.
 *
 * To add/remove a skill, just edit the arrays below — no component
 * code needs to change.
 */

export const skillCategories = [
  {
    id: "build",
    title: "Build",
    description: "Turning ideas into working applications",
    icon: "faHammer",
    skills: [
      { name: "HTML5", usedIn: ["AMC Tracking Platform", "Finance Cost Tracker"] },
      { name: "CSS3 / Tailwind CSS", usedIn: ["AMC Tracking Platform", "Finance Cost Tracker"] },
      { name: "JavaScript", usedIn: ["Monthly Review Platform"] },
      { name: "React.js", usedIn: ["AMC Tracking Platform", "Finance Cost Tracker"] },
      { name: "Node.js / Express.js", usedIn: ["AMC Tracking Platform", "Finance Cost Tracker"] },
      { name: "Flask (Python)", usedIn: ["Monthly Review Platform"] },
      { name: "MySQL", usedIn: ["Monthly Review Platform", "AMC Tracking Platform"] },
      { name: "PostgreSQL", usedIn: ["Finance Cost Tracker"] },
    ],
  },
  {
    id: "automate",
    title: "Automate",
    description: "Eliminating repetitive manual work",
    icon: "faGears",
    skills: [
      { name: "Python", usedIn: ["Monthly Review Platform", "Monthly Care Dashboard"] },
      { name: "Selenium", usedIn: ["Monthly Care Dashboard"] },
      { name: "Power Automate", usedIn: ["Monthly Review Platform", "PMO Dashboard", "Monthly Care Dashboard"] },
      { name: "REST APIs", usedIn: ["Monthly Review Platform", "AMC Tracking Platform"] },
      { name: "Auto-mailer systems", usedIn: ["Monthly Review Platform", "AMC Tracking Platform"] },
    ],
  },
  {
    id: "visualize",
    title: "Visualize",
    description: "Turning raw data into decisions",
    icon: "faChartPie",
    skills: [
      { name: "Power BI", usedIn: ["PMO Dashboard", "Monthly Care Dashboard"] },
      { name: "Power Apps", usedIn: ["PMO Dashboard"] },
      { name: "Interactive dashboards", usedIn: ["Monthly Review Platform"] },
      { name: "Drill-down reporting", usedIn: ["Monthly Review Platform"] },
    ],
  },
  {
    id: "manage",
    title: "Manage",
    description: "Domain knowledge that shapes how I build",
    icon: "faClipboardList",
    skills: [
      { name: "Project Management & PMO Reporting", usedIn: ["Monthly Review Platform", "PMO Dashboard"] },
      { name: "Financial Tracking & Cost Analysis", usedIn: ["Finance Cost Tracker"] },
      { name: "Risk Management", usedIn: ["Monthly Review Platform"] },
      { name: "Stakeholder Reporting (MOM, KPIs)", usedIn: ["Monthly Review Platform"] },
    ],
  },
];