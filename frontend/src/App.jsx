// App.jsx - Fixed Routing, Page Order, and Global Theme Init
import { Routes, Route } from "react-router-dom";
import { useTheme } from "./hooks/useTheme";

/* Global components */
import Navbar from "./components/Navbar";
import CustomCursor from "./components/CustomCursor";

/* Portfolio sections (Exact Chronological Order) */
import Hero from "./sections/Hero";
import Stats from "./sections/Stats";
import About from "./sections/About";
import Experience from "./sections/Experience";
import PlatformsBuilt from "./sections/PlatformsBuilt";
import Projects from "./sections/Projects";
import Skills from "./sections/Skills";
import Education from "./sections/Education";
import Contact from "./sections/Contact";
import Footer from "./sections/Footer";

/* Pages */
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

function MainPortfolio() {
  return (
    <>
      <CustomCursor />
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <About />
        <Experience />
        <PlatformsBuilt />
        <Projects />
        <Skills />
        <Education />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  // 🍏 GLOBAL THEME INIT:
  // Calls the hook so OS theme tracking runs on ALL routes 
  // (including Admin and 404) without passing props down.
  useTheme();

  return (
    <Routes>
      {/* MAIN PORTFOLIO */}
      <Route path="/" element={<MainPortfolio />} />

      {/* ADMIN ROUTES (Forced Dark Mode internally) */}
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />

      {/* 404 FALLBACK */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}