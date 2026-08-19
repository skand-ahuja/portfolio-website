import { useEffect, useRef, useState } from "react";

const INTERACTIVE_SELECTOR = [
  "a",
  "button",
  "select",
  '[role="button"]',
  '[tabindex="0"]',
].join(",");

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const positionRef = useRef({
    x: -100,
    y: -100,
  });

  const frameRef = useRef(null);

  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const finePointer = window.matchMedia(
      "(pointer: fine)"
    );

    if (!finePointer.matches) {
      return;
    }

    const cursor = cursorRef.current;

    if (!cursor) {
      return;
    }

    function updateCursor() {
      cursor.style.transform =
        `translate3d(${positionRef.current.x}px, ${positionRef.current.y}px, 0) translate(-50%, -50%)`;

      frameRef.current =
        requestAnimationFrame(updateCursor);
    }

    function handleMouseMove(event) {
      positionRef.current = {
        x: event.clientX,
        y: event.clientY,
      };

      setVisible(true);
    }

    function handleMouseOver(event) {
      if (
        event.target.closest(INTERACTIVE_SELECTOR)
      ) {
        setHovering(true);
      }
    }

    function handleMouseOut(event) {
      if (
        event.target.closest(INTERACTIVE_SELECTOR)
      ) {
        setHovering(false);
      }
    }

    function handleMouseLeave() {
      setVisible(false);
    }

    function handleMouseEnter() {
      setVisible(true);
    }

    window.addEventListener(
      "mousemove",
      handleMouseMove
    );

    document.addEventListener(
      "mouseover",
      handleMouseOver
    );

    document.addEventListener(
      "mouseout",
      handleMouseOut
    );

    document.documentElement.addEventListener(
      "mouseleave",
      handleMouseLeave
    );

    document.documentElement.addEventListener(
      "mouseenter",
      handleMouseEnter
    );

    frameRef.current =
      requestAnimationFrame(updateCursor);

    return () => {
      window.removeEventListener(
        "mousemove",
        handleMouseMove
      );

      document.removeEventListener(
        "mouseover",
        handleMouseOver
      );

      document.removeEventListener(
        "mouseout",
        handleMouseOut
      );

      document.documentElement.removeEventListener(
        "mouseleave",
        handleMouseLeave
      );

      document.documentElement.removeEventListener(
        "mouseenter",
        handleMouseEnter
      );

      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className={`
        pointer-events-none
        fixed
        left-0
        top-0
        z-[9999]
        hidden
        md:block
        rounded-full
        border
        border-accent/60
        bg-accent/15
        backdrop-blur-[2px]
        transition-[width,height,opacity,background-color]
        duration-200

        ${
          hovering
            ? "h-8 w-8 bg-accent/20"
            : "h-3 w-3 bg-accent/60"
        }

        ${
          visible
            ? "opacity-100"
            : "opacity-0"
        }
      `}
      style={{
        willChange: "transform",
      }}
    />
  );
}