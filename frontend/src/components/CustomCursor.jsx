import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const positionRef = useRef({ x: -100, y: -100 });
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const cursor = cursorRef.current;
    if (!cursor) return;

    let raf;
    const update = () => {
      cursor.style.transform = `translate3d(${positionRef.current.x}px, ${positionRef.current.y}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(update);
    };

    const move = (e) => { positionRef.current = { x: e.clientX, y: e.clientY }; cursor.style.opacity = 1; };
    const over = (e) => { if (e.target.closest("a, button, input, select, textarea")) setHovering(true); };
    const out = (e) => { if (e.target.closest("a, button, input, select, textarea")) setHovering(false); };

    window.addEventListener("mousemove", move);
    document.addEventListener("mouseover", over);
    document.addEventListener("mouseout", out);
    raf = requestAnimationFrame(update);

    return () => { window.removeEventListener("mousemove", move); document.removeEventListener("mouseover", over); document.removeEventListener("mouseout", out); cancelAnimationFrame(raf); };
  }, []);

  return (
    <div ref={cursorRef} className={`pointer-events-none fixed left-0 top-0 z-[9999] hidden md:block rounded-full border border-[var(--accent)] transition-[width,height,background-color] duration-200 ${hovering ? "h-10 w-10 bg-[color-mix(in_srgb,var(--accent)_10%,transparent)]" : "h-3 w-3 bg-[var(--accent)]"}`} style={{ opacity: 0, willChange: "transform" }} />
  );
}