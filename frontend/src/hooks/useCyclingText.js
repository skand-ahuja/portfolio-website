import { useState, useEffect } from "react";

/**
 * useCyclingText — cycles through an array of strings at a fixed interval.
 *
 * Used in the Hero section's sub-text ("Specializing in React Applications
 * -> Power BI Dashboards -> Python Automation") so it rotates automatically
 * without needing a heavier animation library just for text cycling.
 *
 * @param {string[]} items - the list of strings to cycle through
 * @param {number} intervalMs - how long each string stays visible (default 2500ms)
 * @returns {string} the currently active string
 */
export function useCyclingText(items, intervalMs = 2500) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!items || items.length === 0) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [items, intervalMs]);

  return items[index];
}