import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "Skand Ahuja | Full-Stack Developer & Data Analyst";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    backgroundColor: "#050508",
                    padding: "70px 80px",
                    fontFamily: "sans-serif",
                    position: "relative"
                }}
            >
                {/* Background Subtle Gradient Spheres */}
                <div
                    style={{
                        position: "absolute",
                        top: "-150px",
                        right: "-100px",
                        width: "600px",
                        height: "600px",
                        borderRadius: "50%",
                        background: "radial-gradient(circle, rgba(144, 27, 241, 0.35) 0%, rgba(0,0,0,0) 70%)"
                    }}
                />

                {/* Top Header */}
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "48px",
                            height: "48px",
                            borderRadius: "14px",
                            background: "rgba(144, 27, 241, 0.3)",
                            border: "1px solid rgba(144, 27, 241, 0.6)",
                            color: "#ffffff",
                            fontSize: "22px",
                            fontWeight: "bold"
                        }}
                    >
                        &gt;
                    </div>
                    <span style={{ color: "#ffffff", fontSize: "24px", fontWeight: "bold", letterSpacing: "2px" }}>
                        SKAND AHUJA
                    </span>
                </div>

                {/* Center Pitch */}
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <span style={{ color: "#901bf1", fontSize: "20px", fontWeight: "bold", letterSpacing: "3px" }}>
                        ENGINEERING &middot; DATA &middot; SOFTWARE
                    </span>
                    <h1
                        style={{
                            fontSize: "64px",
                            fontWeight: 800,
                            color: "#ffffff",
                            lineHeight: 1.1,
                            letterSpacing: "-1px",
                            margin: 0
                        }}
                    >
                        I build data-driven systems & applications.
                    </h1>
                </div>

                {/* Bottom Tech Badges */}
                <div style={{ display: "flex", gap: "12px" }}>
                    {["Next.js 15", "React", "Node.js", "Python", "PostgreSQL", "Power BI"].map((t) => (
                        <div
                            key={t}
                            style={{
                                borderRadius: "9999px",
                                border: "1px solid rgba(255, 255, 255, 0.15)",
                                backgroundColor: "rgba(255, 255, 255, 0.05)",
                                padding: "8px 20px",
                                color: "#e2e8f0",
                                fontSize: "15px",
                                fontWeight: 600
                            }}
                        >
                            {t}
                        </div>
                    ))}
                </div>
            </div>
        ),
        { ...size }
    );
}