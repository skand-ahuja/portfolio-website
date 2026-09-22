# **Skand Ahuja — Full-Stack Portfolio & Systems Engineering**

A modern, production-grade personal portfolio and engineering platform built with **Next.js 15**, **TypeScript**, **Tailwind CSS**, and **PostgreSQL**. Designed with an Apple-inspired glassmorphism aesthetic, high-contrast typography, and fluid micro-interactions.

🌐 **Live Website:** [Skand Ahuja Portfolio](https://portfolio-website-blue-seven-96.vercel.app/)

---

## ✨ Engineering & Design Highlights

- **Bionic Hero & Glassmorphism:** GPU-accelerated backdrop blur (`translateZ(0)`), dynamic radial mouse-spotlight, and Apple SF Pro typography hierarchy.
- **Apple Spotlight Command Palette (`⌘K` / `Ctrl+K`):** Global keyboard-accessible command bar allowing instant navigation, theme toggling, and resume downloads.
- **Interactive Project Architecture Diagrams:** Visual end-to-end data pipelines embedded in case study modals (*Source ➔ ETL ➔ Database ➔ UI*).
- **Dual-Way Serverless Email Engine:** Powered by Next.js Serverless Route Handlers and SMTP. Sends concurrent instant notifications to the host and automated branded acknowledgement emails to visitors.
- **Narrative-Driven Skills System:** Skills structured across *Build / Automate / Visualize / Manage* with direct mapping to platforms built.
- **OLED-Black Theme Architecture:** Persistent Light/Dark/System theme syncing with zero hydration flicker (`next-themes`).
- **Engineered Micro-Interactions:** Custom spring-physics active navbar pill, Lub-Dub heartbeat status pulses, live New Delhi IST clock, and rocket-launch smooth scroll.

---

## 🛠️ Technology Stack

### Frontend & Architecture
- **Framework:** Next.js 15 (App Router, Server & Client Components)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (Custom Design Tokens)
- **Animation:** Framer Motion (GPU-accelerated layout transitions)
- **Icons:** FontAwesome & Lucide
- **Theme:** next-themes (Attribute-based OLED switching)

### Backend & API
- **Runtime:** Next.js Serverless Route Handlers
- **Validation:** Zod Schema Validation
- **Email Service:** Nodemailer + SMTP (Gmail)
- **Security:** Bot Honeypot Traps, Server-only Secrets, XSS sanitization

### Database Layer (In Progress)
- **Database:** PostgreSQL (Neon Serverless)
- **ORM:** Drizzle ORM
- **Migrations:** Drizzle Kit

### SEO & Performance
- **Metadata:** Next.js Metadata API, Dynamic OpenGraph Image (`ImageResponse`)
- **Indexing:** Programmatic `sitemap.ts` and `robots.txt`
- **Structured Data:** JSON-LD (`Person` & `WebSite` schemas)

---

## 📁 Scalable Directory Architecture

```text
portfolio-website/
├── src/
│   ├── app/                      # Next.js App Router (Pages, Routes, Layouts)
│   │   ├── api/
│   │   │   └── contact/          # Serverless Dual-Email Route Handler
│   │   ├── globals.css           # Semantic CSS variables & glass system
│   │   ├── layout.tsx            # Global SEO, Fonts, JSON-LD, Theme Providers
│   │   ├── page.tsx              # Single-page assembled landing page
│   │   ├── opengraph-image.tsx   # Dynamic edge-generated social card
│   │   └── sitemap.ts            # Dynamic XML sitemap generator
│   │
│   ├── components/               # Modular UI & Section Components
│   │   ├── Hero.tsx              # Spotlight, Bionic Visual, Tech strip
│   │   ├── Navbar.tsx            # Spring active pill, scroll-spy, drawer
│   │   ├── CommandPalette.tsx    # Global Spotlight modal (⌘K)
│   │   ├── Projects.tsx          # Filterable grid, case modal, flow diagrams
│   │   ├── Contact.tsx           # Accessible listbox dropdown, Toast, form
│   │   ├── Footer.tsx            # 3-column layout, IST clock, rocket trigger
│   │   ├── GlassCard.tsx         # Universal glass surface primitive
│   │   ├── Toast.tsx             # Animated linear timer progress notification
│   │   └── ThemeToggle.tsx       # Pill sliding theme toggle
│   │
│   ├── data/                     # Strongly-typed static content
│   │   ├── about.ts              # Origin story & career transition data
│   │   ├── experience.ts         # Career timeline & platform case studies
│   │   ├── projects.ts           # Portfolio projects & categories
│   │   └── skills.ts             # Matrix skills mapped to applications
│   │
│   └── lib/                      # Backend utilities & validations
│       ├── emailService.ts       # Responsive Apple-style HTML email templates
│       └── validations/          # Zod input schemas
│
├── public/                       # Static SVGs, resumes, icons, favicons
├── .env.local                    # Local environment secrets (excluded from Git)
├── next.config.ts
├── tsconfig.json
└── package.json
```

---

## 🚀 Local Development Setup

### 1. Clone Repository
```bash
git clone https://github.com/skand-ahuja/portfolio-website.git
cd portfolio-website
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory:
```env
EMAIL_USER=your_gmail_address@gmail.com
EMAIL_APP_PASSWORD=your_16_character_app_password
CONTACT_RECEIVER_EMAIL=your_receiving_email@gmail.com
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

### 5. Production Build Verification
```bash
npm run build
```

---

## 🔐 Security Standards

- **Server-Side Verification:** All client payloads are parsed and validated via Zod schemas before touching application logic.
- **Spam Mitigation:** Silent honeypot trap fields filter automated bots without intrusive CAPTCHAs.
- **Zero Secret Leaks:** No database URLs or API keys are bundled into client-side JavaScript.
- **Safe HTML Delivery:** Outgoing and incoming email bodies are aggressively sanitized to eliminate XSS injections.

---

## 👨‍💻 Author

**Skand Ahuja**  
*Full-Stack Systems & Data Engineer*  
- **[LinkedIn](https://linkedin.com/in/skand-ahuja)**
- **[GitHub](https://github.com/skand-ahuja)**

---

## 📄 License
Source code is available under the MIT License. Personal assets, images, copy, and branding are proprietary to the author.