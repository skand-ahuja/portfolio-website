/**
 * experience.js — content data for the Experience and Platforms Built sections.
 *
 * "experience" = top 3 platforms (highest impact / coding-heavy), shown
 *   inline as expandable cards in the Experience timeline.
 * "platformsBuilt" = remaining 2 platforms (automation/BI-heavy), shown
 *   in a separate "Platforms Built" section.
 *
 * Editing this file is the ONLY thing needed to add, remove, or update
 * a platform entry — no component code needs to change.
 */

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
    tagline:
      "Replacing a 20+ source manual reporting chain with one automated, drillable platform.",
    badge: "Enterprise scale",
    problem:
      "Monthly business reviews depended on manually pulling data from SharePoint, Excel, SQL databases, and Salesforce, then consolidating everything into pivot tables, and finally rebuilding PowerPoint decks every month for managers and senior leadership. It was slow, repetitive, and prone to human error, and the entire cycle started over from zero every 30 days.",
    solution:
      "A full-stack platform that automates the entire reporting pipeline. Python scripts and Power Automate handle scheduled data extraction and preprocessing from all source systems, clean data lands in a SQL database, and a Flask REST API serves it to a responsive JavaScript frontend. The platform brings together six modules in one place: Account Highlights, Financial Reporting, PMO Dashboard, Risk Management, Multi-Project View, and Automated MOM capture with instant email distribution. The standout piece is the closed-loop automation: an auto-mailer engine detects non-compliant KPIs, notifies the responsible owner, and prompts them to log remarks directly in the portal.",
    techStack: ["Python", "Flask", "REST APIs", "MySQL", "Power Automate", "JavaScript", "HTML5", "CSS3"],
    impact: "Cut monthly review preparation time by roughly 85%, from 4+ days of manual data assembly down to near real-time rendering.",
  },
  {
    id: "amc-tracking-platform",
    title: "AMC Tracking Platform",
    tagline: "Replacing scattered AMC and warranty trackers with one centralized React app.",
    badge: "Modern full-stack",
    problem:
      "Every project and care department maintained separate Excel sheets to track AMC and warranty status for customer accounts. These were difficult to maintain, easy to break, and frequently out of sync with each other.",
    solution:
      "A React and Node.js web app that centralizes AMC and warranty tracking for all accounts. It includes a summary dashboard, an editable table view for AMC status updates, a form to add new AMC or warranty entries, an AMC renewal workflow, and a visual roadmap view showing a project's lifetime from kickoff to its current status. The system also sends automatic email reminders before an AMC is due to expire.",
    techStack: ["HTML", "Tailwind CSS", "React.js", "Node.js", "Express.js", "MySQL"],
    impact:
      "Eliminated fragmented, error-prone Excel tracking across departments with a single source of truth, and removed manual reminder tracking entirely through automated email alerts.",
  },
  {
    id: "monthly-care-dashboard",
    title: "Monthly Care Dashboard",
    tagline: "An automated Salesforce-to-boardroom pipeline, with zero manual data entry.",
    badge: "Automation engineering",
    problem:
      "Management needed a clear, recurring view of the Care division's performance, but the source data lived in Salesforce with no direct export pipeline into reporting tools.",
    solution:
      "A Python script using Selenium automates the data export from Salesforce by interacting with page elements the way a human would, since no direct API export was available. The exported CSV lands in a SharePoint folder, gets imported into Power BI, and is transformed into a detailed performance summary for the Care division. Power Automate handles the final step, automatically sending a PDF snapshot of the dashboard to management on the last day of every month.",
    techStack: ["Python", "Selenium", "Power BI", "SharePoint", "Power Automate"],
    impact:
      "Fully automated a previously manual, recurring reporting task end to end, from data extraction to final delivery, with no human intervention required each month.",
  },
];

export const platformsBuilt = [
  {
    id: "pmo-dashboard",
    title: "PMO Dashboard",
    tagline: "A 27-source data pipeline turned into a live, color-coded performance view.",
    problem:
      "PMO reporting required pulling data from 27+ different sources, all stored across SharePoint folders, with no automated way to clean or consolidate it before review.",
    solution:
      "A Power BI dashboard fed by a Power Query dataflow that automatically cleans and merges data from all 27+ sources. Each KPI is visualized with dynamic colors and thumbs-up or thumbs-down indicators based on performance criteria. Power Apps is embedded directly inside the dashboard, letting users enter remarks against each KPI without leaving the report. Auto-mailers notify stakeholders the moment data is processed and ready to view. This dashboard now runs as a module inside the broader Monthly Review Platform.",
    techStack: ["Power BI", "Power Query", "Power Apps", "Power Automate", "SharePoint"],
    impact: "Reduced the full data preparation cycle from approximately 7 days down to 1 to 2 days.",
  },
  {
    id: "finance-cost-tracker",
    title: "Finance Cost Tracker",
    tagline: "A baseline-vs-actual cost tracker that replaced error-prone Excel sheets.",
    problem:
      "Project finance costs and timelines were tracked manually in Excel, which led to frequent human error, wasted manpower, and lost time reconciling numbers.",
    solution:
      "A web application where teams set a cost baseline for a project and track actual spend against it in real time, alongside timeline tracking to flag cost or schedule overruns early. A summary dashboard gives a quick view of overall project finance health before drilling into individual project details.",
    techStack: ["HTML", "Tailwind CSS", "React.js", "Node.js", "Express.js", "PostgreSQL"],
    impact:
      "Eliminated manual Excel reconciliation, giving project managers real-time warning on budget overruns before they hit the balance sheet.",
  },
];
