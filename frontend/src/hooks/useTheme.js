import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "portfolio-theme";

function getInitialTheme() {
  if (typeof window === "undefined") return "light";
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function useTheme() {
  const [theme, setTheme] = useState(getInitialTheme);

  // 1. Sync theme with DOM
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("theme-transitioning");
    
    if (theme === "dark") root.setAttribute("data-theme", "dark");
    else root.removeAttribute("data-theme");
    
    window.localStorage.setItem(STORAGE_KEY, theme);

    const timeout = setTimeout(() => root.classList.remove("theme-transitioning"), 300);
    return () => clearTimeout(timeout);
  }, [theme]);

  // 2. 🍏 NEW: Listen for System Theme Changes dynamically
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => {
      // Only auto-switch if user hasn't manually forced a theme
      if (!window.localStorage.getItem(STORAGE_KEY)) {
        setTheme(e.matches ? "dark" : "light");
      }
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      const newTheme = current === "dark" ? "light" : "dark";
      window.localStorage.setItem(STORAGE_KEY, newTheme); // Save explicit preference
      return newTheme;
    });
  }, []);

  return { theme, toggleTheme };
}