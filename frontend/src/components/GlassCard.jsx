/**
 * GlassCard.jsx
 *
 * Reusable glassmorphic card component.
 * Used across: Projects, Skills, Education, Contact, Footer, Platforms.
 *
 * Fixes applied:
 * 1. hover:border-accent/40 → inline style with CSS var (Tailwind opacity
 *    modifier on @theme color variables is unreliable without CSS var format)
 * 2. Fixed p-6 removed — padding is now a prop (default "md")
 * 3. Added `size` prop for padding variants
 * 4. Added `glow` prop for featured/highlighted cards
 * 5. Added `noBorder` prop for borderless glass surfaces
 * 6. Hover lift is smoother — uses CSS var shadow
 *
 * USAGE EXAMPLES:
 *
 *   <GlassCard>                          → default, md padding, no hover
 *   <GlassCard hover>                    → lifts on hover
 *   <GlassCard size="sm">               → compact padding (p-4)
 *   <GlassCard size="lg">               → spacious padding (p-8)
 *   <GlassCard size="none">             → no padding (for image cards)
 *   <GlassCard glow>                    → accent glow border (featured)
 *   <GlassCard as="article" hover>      → semantic article tag
 *   <GlassCard as="li">                 → for lists
 *   <GlassCard className="rounded-3xl"> → custom border radius override
 */

/* ============================================================
   PADDING SCALE
   Maps size prop → Tailwind padding class
   ============================================================ */
const PADDING = {
  none: "",
  xs:   "p-3",
  sm:   "p-4",
  md:   "p-6",    /* default */
  lg:   "p-8",
  xl:   "p-10",
};

export default function GlassCard({
  children,
  className  = "",
  hover      = false,   /* lift + stronger border on hover         */
  glow       = false,   /* accent glow — for featured/active cards */
  noBorder   = false,   /* remove border — for nested glass layers */
  size       = "md",    /* "none" | "xs" | "sm" | "md" | "lg" | "xl" */
  as: Tag    = "div",   /* semantic tag: div | article | li | section */
  ...props
}) {
  const padding = PADDING[size] ?? PADDING.md;

  return (
    <Tag
      className={`
        glass-card
        ${padding}
        ${hover ? "cursor-pointer" : ""}
        ${className}
      `}
      style={{
        /*
         * CSS var based styles — these react to data-theme="dark"
         * automatically without needing dark: Tailwind variants.
         *
         * hover and glow are handled here so they use the correct
         * CSS variable values at runtime (not baked-in at build time).
         */
        ...(noBorder && {
          border: "none",
          boxShadow: "none",
        }),

        ...(glow && {
          /* Accent tinted border for featured/highlighted cards */
          borderColor: "color-mix(in srgb, var(--accent) 35%, transparent)",
          boxShadow: `
            var(--shadow-card),
            0 0 0 1px color-mix(in srgb, var(--accent) 12%, transparent),
            0 8px 32px color-mix(in srgb, var(--accent) 10%, transparent)
          `,
        }),
      }}

      /*
       * Hover styles via CSS — more reliable than Tailwind hover:
       * variants when values come from CSS variables.
       * We attach data attributes and handle in onMouseEnter/Leave.
       */
      onMouseEnter={hover ? (e) => {
        e.currentTarget.style.transform  = "translateY(-4px)";
        e.currentTarget.style.borderColor = "color-mix(in srgb, var(--accent) 40%, transparent)";
        e.currentTarget.style.boxShadow  = `
          0 24px 60px rgba(46, 45, 90, 0.12),
          0 8px  20px rgba(46, 45, 90, 0.08)
        `;
      } : undefined}

      onMouseLeave={hover ? (e) => {
        e.currentTarget.style.transform   = "";
        e.currentTarget.style.borderColor = "";
        e.currentTarget.style.boxShadow   = "";
      } : undefined}

      {...props}
    >
      {children}
    </Tag>
  );
}