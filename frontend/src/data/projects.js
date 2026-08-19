/**
 * projects.js — content data for the Projects section.
 *
 * Each project object supports dynamic buttons:
 * - github_url: shows GitHub button (null = no button shown)
 * - live_url: shows "Live Demo" button (null = no button shown)
 * - powerbi_url: shows "View Dashboard" button (null = no button shown)
 * - is_confidential: if true, shows a lock badge instead of source buttons
 *
 * To add/remove a project: just edit this array. No component code changes needed.
 * Category options: "data_analysis" | "web_app" | "automation" | "power_bi"
 */

export const projects = [
  {
    id: "job-market-trends",
    title: "Job Market Trends Analysis",
    summary:
      "Analyzed Data Science job market trends in India using real-world scraped job listings to uncover salary distributions, skill demand patterns, and hiring trends.",
    objective:
      "Help job seekers identify high-demand skills, benchmark salary trends, and understand the evolving Data Science job landscape in India.",
    problem:
      "No consolidated, data-driven view of the Indian Data Science job market existed. Salary ranges, required skills, and location preferences were scattered across multiple job portals with no easy way to compare.",
    solution:
      "Web-scraped real job postings using BeautifulSoup and built a complete EDA pipeline with hypothesis testing and A/B testing to validate findings. Key insight: skills matter more than experience for salary growth.",
    tech: ["Python", "Pandas", "NumPy", "Matplotlib", "Seaborn", "BeautifulSoup", "SciPy"],
    category: "data_analysis",
    github_url: "https://github.com/skand-ahuja/Job-Market-Trends-Analysis",
    live_url: "https://yoursite.com",
    website_url: "https://yoursite.com",  // ya "https://yoursite.com" agar hosted hai
    powerbi_url: null,
    is_confidential: false,
    thumbnail: "/images/job-market.png",
    featured: true,
  },
  {
    id: "coffee-shop-dashboard",
    title: "Coffee Shop Sales Dashboard",
    summary:
      "Built an interactive Excel dashboard to analyze coffee shop sales data, uncovering peak times, top products, and revenue trends across multiple store locations.",
    objective:
      "Give coffee shop management a clear, interactive view of sales performance to support data-driven decisions on staffing, promotions, and inventory.",
    problem:
      "Sales data was raw and unstructured across multiple spreadsheets. Management had no quick way to identify peak hours, best-selling products, or location-wise performance.",
    solution:
      "Used Power Query for data cleaning, Power Pivot for DAX calculations, and built an interactive dashboard with slicers, KPIs, and visualizations. Key finding: Barista Espresso is the top seller and early morning hours drive peak revenue.",
    tech: ["Microsoft Excel", "Power Query", "Power Pivot", "DAX", "Pivot Tables"],
    category: "data_analysis",
    github_url: "https://github.com/skand-ahuja/Coffee-Shop-Sales-Dashboard",
    live_url: null,
    powerbi_url: null,
    is_confidential: false,
    thumbnail:
      "https://opengraph.githubassets.com/e3e3a3b76f553969d21f3dab8b52dd80d7a0471d8b6e6c47279cd24a37c1c85c/skand-ahuja/Coffee-Shop-Sales-Dashboard",
    featured: true,
  },
  {
    id: "ola-booking-analysis",
    title: "Ola Booking Data Analysis",
    summary:
      "Performed in-depth analysis of Ola ride-booking data to identify booking patterns, cancellation trends, and revenue insights across time periods and vehicle types.",
    objective:
      "Uncover actionable patterns in booking behavior, peak demand windows, and cancellation reasons to help optimize fleet allocation and driver availability.",
    problem:
      "Ride booking data was unprocessed and hard to interpret. No structured analysis existed to identify which vehicle categories performed best or when cancellations spiked.",
    solution:
      "Cleaned and analyzed the dataset using Python and built visualizations to reveal booking trends, cancellation drivers, and revenue patterns by vehicle type and time slot.",
    tech: ["Python", "Pandas", "Matplotlib", "Seaborn", "NumPy"],
    category: "data_analysis",
    github_url: "https://github.com/skand-ahuja/Ola-Booking-Data-Analysis",
    live_url: null,
    powerbi_url: null,
    is_confidential: false,
    thumbnail:
      "https://opengraph.githubassets.com/1/skand-ahuja/Ola-Booking-Data-Analysis",
    featured: true,
  },
  {
    id: "zomato-data-analysis",
    title: "Zomato Data Analysis",
    summary:
      "Explored Zomato restaurant data to uncover patterns in customer ratings, cuisine preferences, price ranges, and restaurant performance across Indian cities.",
    objective:
      "Provide data-driven insights into restaurant trends, customer behavior, and what factors most influence ratings and popularity on Zomato.",
    problem:
      "Restaurant owners and analysts had no structured way to benchmark their performance or understand what drives high ratings and customer footfall on Zomato.",
    solution:
      "Performed comprehensive EDA on the Zomato dataset, identifying top cuisines, price-to-rating correlations, and city-wise trends using Python visualization libraries.",
    tech: ["Python", "Pandas", "Matplotlib", "Seaborn", "NumPy"],
    category: "data_analysis",
    github_url: "https://github.com/skand-ahuja/Zomato-Data-Analysis",
    live_url: null,
    powerbi_url: null,
    is_confidential: false,
    thumbnail:
      "https://opengraph.githubassets.com/1/skand-ahuja/Zomato-Data-Analysis",
    featured: false,
  },
];

export const projectCategories = [
  { id: "all", label: "All Projects" },
  { id: "data_analysis", label: "Data Analysis" },
  { id: "web_app", label: "Web Apps" },
  { id: "automation", label: "Automation" },
  { id: "power_bi", label: "Power BI" },
];