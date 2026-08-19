/**
 * App.jsx
 *
 * Root routing component for the portfolio.
 *
 * Routes:
 * /                  → Main portfolio
 * /admin             → Admin login
 * /admin/dashboard   → Admin dashboard
 * *                  → 404 page
 */

import { Routes, Route } from "react-router-dom";

/* Theme */
import { useTheme } from "./hooks/useTheme";

/* Global components */
import Navbar from "./components/Navbar";
import CustomCursor from "./components/CustomCursor";

/* Portfolio sections */
import Hero from "./sections/Hero";
import Stats from "./sections/Stats";
import About from "./sections/About";
import Skills from "./sections/Skills";
import Experience from "./sections/Experience";
import PlatformsBuilt from "./sections/PlatformsBuilt";
import Projects from "./sections/Projects";
import Education from "./sections/Education";
import Contact from "./sections/Contact";
import Footer from "./sections/Footer";

/* Pages */
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

/* ============================================================
   MAIN PORTFOLIO
   ============================================================ */

/**
 * MainPortfolio
 *
 * Keeps the main portfolio page separate from the routing logic.
 * This makes App.jsx easier to maintain as the project grows.
 */
function MainPortfolio() {
  const {
    theme,
    toggleTheme,
  } = useTheme();

  return (
    <>
      {/* Custom cursor lives at the root level so it isn't
          clipped by section-level overflow rules. */}
      <CustomCursor />

      {/* Floating portfolio navigation */}
      <Navbar
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {/* Main portfolio content */}
      <main>
        <Hero />

        <Stats />

        <About />

        <Skills />

        <Experience />

        <PlatformsBuilt />

        <Projects />

        <Education />

        <Contact />
      </main>

      {/* Portfolio footer */}
      <Footer />
    </>
  );
}

/* ============================================================
   APP ROUTER
   ============================================================ */

function App() {
  return (
    <Routes>
      {/* ======================================================
          MAIN PORTFOLIO
          ====================================================== */}

      <Route
        path="/"
        element={<MainPortfolio />}
      />

      {/* ======================================================
          ADMIN LOGIN
          ====================================================== */}

      <Route
        path="/admin"
        element={<AdminLogin />}
      />

      {/* ======================================================
          ADMIN DASHBOARD
          ====================================================== */}

      <Route
        path="/admin/dashboard"
        element={<AdminDashboard />}
      />

      {/* ======================================================
          404
          ====================================================== */}

      <Route
        path="*"
        element={<NotFound />}
      />
    </Routes>
  );
}

export default App;