# Personal Portfolio Website

A modern, full-stack personal portfolio built to showcase experience as a
Data Analyst / Automation Engineer / Full-Stack Developer. Designed with
a minimalist glassmorphism aesthetic, dark/light mode, and dynamic,
database-driven content (no hardcoded data that requires a redeploy to update).

## Tech Stack

- **Frontend:** React.js (Vite) + Tailwind CSS v4 + Framer Motion + Font Awesome
- **Backend:** Node.js + Express.js
- **Database:** MySQL (local: XAMPP, production: cloud MySQL provider)
- **Email:** Resend.com (contact form notifications + auto-reply)

## Project Structure

```
portfolio-website/
├── frontend/          React app (Vite + Tailwind)
│   └── src/
│       ├── components/   Reusable UI pieces (GlassCard, ThemeToggle, etc.)
│       ├── sections/     Page sections (Hero, About, Skills, Experience...)
│       ├── hooks/        Custom React hooks (useTheme, etc.)
│       ├── data/         Editable content (skills.js, experience.js)
│       └── styles/       (reserved for future style splitting)
│
├── backend/           Express API
│   └── src/
│       ├── routes/       API endpoint definitions
│       ├── controllers/  Request handling logic
│       ├── middleware/   Security: rate limiting, validation, honeypot
│       ├── config/       Database connection (pool)
│       └── services/     Resend email service
│
└── database/
    └── schema.sql     All MySQL table definitions
```

## Local Development Setup

### 1. Database (XAMPP)
1. Start XAMPP, enable the MySQL module.
2. Open phpMyAdmin (or any MySQL client) and run the contents of
   `database/schema.sql`. This creates the `portfolio_db` database
   and all required tables.

### 2. Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your real MySQL credentials and Resend API key
npm run dev
```
Server runs on `http://localhost:5000` by default.

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```
App runs on `http://localhost:5173` by default.

## Security Measures Implemented

- **Helmet.js** — sets protective HTTP headers
- **CORS** — API only accepts requests from the configured frontend URL
- **Rate limiting** — contact form capped at 5 submissions/IP/hour;
  general API capped at 100 requests/IP/15 min
- **Honeypot field** — invisible form field that traps bots
- **Input validation & sanitization** — express-validator on all
  contact form fields
- **Parameterized SQL queries** — every database query uses `?`
  placeholders, never raw string concatenation (prevents SQL injection)
- **Environment variables** — all secrets (DB credentials, API keys)
  live in `.env`, which is git-ignored and never committed

## Content Editing (No Code Required)

- **Skills, Experience, Platforms Built:** edit the files in
  `frontend/src/data/` directly — `skills.js` and `experience.js`.
- **Projects:** stored in the database `projects` table. An admin
  panel (planned, not yet built) will let you add/edit/remove
  projects through a simple UI instead of writing SQL by hand.

## Status / Next Steps

- [x] Project scaffolding (frontend + backend)
- [x] Design system (Tailwind v4 theme tokens, glassmorphism utilities)
- [x] Dark/light theme toggle
- [x] Database schema
- [x] Contact form backend (validation, rate limiting, honeypot, email)
- [ ] Section components (Hero, About, Skills, Experience, Projects, Contact UI)
- [ ] GitHub API integration for the Projects section
- [ ] Admin panel for managing projects
- [ ] SEO setup (meta tags, sitemap, structured data)
- [ ] Deployment (Vercel for frontend, Render/Railway for backend, cloud MySQL)
