export default function GlassCard({ children, className = "", hover = false, glow = false, noBorder = false, size = "md", as: Tag = "div", ...props }) {
  const PADDING = { none: "", xs: "p-3", sm: "p-4", md: "p-6", lg: "p-8", xl: "p-10" };
  const padding = PADDING[size] ?? PADDING.md;

  return (
    <Tag
      className={`glass-card ${padding} ${hover ? "cursor-pointer" : ""} ${className}`}
      style={{
        ...(noBorder && { border: "none", boxShadow: "none" }),
        ...(glow && { borderColor: "color-mix(in srgb, var(--accent) 35%, transparent)", boxShadow: "var(--shadow-card), 0 0 0 1px color-mix(in srgb, var(--accent) 12%, transparent), 0 8px 32px color-mix(in srgb, var(--accent) 10%, transparent)" }),
      }}
      onMouseEnter={hover ? (e) => { e.currentTarget.style.transform = "translateY(-4px) translateZ(0)"; e.currentTarget.style.borderColor = "color-mix(in srgb, var(--accent) 40%, transparent)"; e.currentTarget.style.boxShadow = "var(--shadow-lg)"; } : undefined}
      onMouseLeave={hover ? (e) => { e.currentTarget.style.transform = "translateZ(0)"; e.currentTarget.style.borderColor = ""; e.currentTarget.style.boxShadow = ""; } : undefined}
      {...props}
    >
      {children}
    </Tag>
  );
}