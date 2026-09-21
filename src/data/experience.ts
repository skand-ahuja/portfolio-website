export const jobTimeline = {
  role: "Data Analyst",
  company: "Confidential (current employer)",
  duration: "May 2025 – Present",
  previousRole: {
    title: "Project Engineer (Electrical & Electronics)",
    duration: "Feb 2023 – Apr 2025",
  },
};

export const experiencePlatforms = [
  {
    id: "monthly-review-platform",
    title: "Monthly Review Platform",
    tagline: "Replaced a 20-source manual reporting chain with a zero-touch automated platform.",
    badge: "Enterprise Scale",
    problem: "Monthly business reviews required manually extracting data from SharePoint, Excel, SQL, and Salesforce. It took 4+ days of repetitive manual work to consolidate pivot tables and build leadership decks, with a high risk of human error.",
    solution: "Architected an end-to-end reporting pipeline. Python and Power Automate extract and clean data, landing it securely in a SQL database. A Flask REST API serves this to a fast, responsive JavaScript frontend. It features an auto-mailer engine that detects KPI drops and instantly alerts stakeholders for remarks.",
    techStack: ["Python", "Flask", "REST APIs", "MySQL", "Power Automate", "JavaScript", "HTML5", "CSS3"],
    impact: "Reduced monthly review preparation time by 85% (from 4 days to near real-time), saving 40+ man-hours per month and eliminating data-entry errors.",
  },
  {
    id: "amc-tracking-platform",
    title: "AMC Tracking Platform",
    tagline: "Centralized scattered Excel trackers into a single, automated full-stack application.",
    badge: "Full-Stack System",
    problem: "Multiple departments used disconnected, fragile Excel sheets to track AMC (Annual Maintenance Contracts) and warranties. Data was frequently out of sync, leading to missed renewals and lost revenue.",
    solution: "Built a centralized React and Node.js web application functioning as a Single Source of Truth. Features include a real-time dashboard, automated AMC renewal workflows, and a visual roadmap for project lifecycles. Integrated a chron-job system for automated email reminders.",
    techStack: ["React.js", "Node.js", "Express.js", "MySQL", "Tailwind CSS"],
    impact: "Completely eliminated Excel dependency across departments and recovered lost revenue by ensuring 100% on-time renewal alerts via automated emails.",
  },
  {
    id: "monthly-care-dashboard",
    title: "Monthly Care Dashboard",
    tagline: "An automated Salesforce-to-boardroom pipeline with zero human intervention.",
    badge: "Data Automation",
    problem: "Leadership needed recurring performance visibility for the Care division, but source data was locked inside Salesforce with no direct API export pipeline to reporting tools.",
    solution: "Developed a Python-Selenium automation script that mimics human interaction to securely extract Salesforce data. The data flows into SharePoint, is transformed via Power BI, and Power Automate handles the final PDF snapshot delivery to executives.",
    techStack: ["Python", "Selenium", "Power BI", "SharePoint", "Power Automate"],
    impact: "Achieved 100% automation of a critical monthly reporting task. The system now runs flawlessly in the background, requiring zero manual hours.",
  },
];

export const platformsBuilt = [
  {
    id: "pmo-dashboard",
    title: "PMO Dashboard",
    tagline: "Transformed a 27-source data mess into a live, color-coded executive view.",
    problem: "PMO reporting was bottlenecked by 27+ disparate data sources scattered across SharePoint, requiring days of manual consolidation.",
    solution: "Built a Power BI dashboard fueled by Power Query dataflows. Integrated Power Apps directly inside the dashboard, allowing managers to input remarks against underperforming KPIs without leaving the interface. Auto-mailers notify stakeholders instantly.",
    techStack: ["Power BI", "Power Query", "Power Apps", "Power Automate", "SharePoint"],
    impact: "Slashed the data preparation cycle from 7 days to under 48 hours, vastly improving executive decision-making speed.",
  },
  {
    id: "finance-cost-tracker",
    title: "Finance Cost Tracker",
    tagline: "Real-time baseline-vs-actual tracking to prevent project budget overruns.",
    problem: "Project finances were tracked in error-prone spreadsheets, causing delayed visibility into budget overruns and timeline delays.",
    solution: "Developed a web app that tracks actual spending against set baselines in real-time. The dashboard instantly flags cost or schedule deviations, providing project managers with early-warning signals.",
    techStack: ["React.js", "Node.js", "Express.js", "PostgreSQL", "Tailwind CSS"],
    impact: "Provided real-time financial visibility, enabling managers to course-correct budget overruns before they impacted the company's bottom line.",
  },
];