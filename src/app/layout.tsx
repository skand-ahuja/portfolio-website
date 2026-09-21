import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "../components/ThemeProvider";
import CustomCursor from "@/components/CustomCursor";

// 🍏 SEO Metadata mapping from your old index.html
export const metadata: Metadata = {
  title: "Skand Ahuja | Full-Stack Developer & Data Analyst",
  description: "Portfolio of Skand Ahuja showcasing React applications, Node.js projects, Python automation, Power BI dashboards, and full-stack web development.",
  keywords: ["Skand Ahuja", "Full Stack Developer", "React Developer", "Node.js", "Python", "Power BI", "SQL", "Portfolio", "Data Analyst"],
  authors: [{ name: "Skand Ahuja" }],
  openGraph: {
    type: "website",
    siteName: "Skand Ahuja Portfolio",
    title: "Skand Ahuja | Full-Stack Developer & Data Analyst",
    description: "Engineering • Data • Software. Building modern web applications, automation systems and business dashboards.",
    url: "https://skand-ahuja.vercel.app/",
    images: [{ url: "https://skand-ahuja.vercel.app/og-image.png", width: 1200, height: 630, alt: "Skand Ahuja Portfolio Preview" }],
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Skand Ahuja | Full-Stack Developer & Data Analyst",
    description: "Engineering • Data • Software. Explore my portfolio featuring React applications, automation and dashboards.",
    images: ["https://skand-ahuja.vercel.app/og-image.png"],
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#6366f1",
  colorScheme: "light dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Structured Data injected cleanly */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Skand Ahuja",
              "jobTitle": "Full-Stack Developer & Data Analyst",
              "url": "https://skand-ahuja.vercel.app/",
              "image": "https://skand-ahuja.vercel.app/profile-photo.jpg",
              "description": "Full-Stack Developer specializing in React, Node.js, Python automation, Power BI and modern web applications.",
              "sameAs": [
                "https://github.com/skand-ahuja",
                "https://linkedin.com/in/skand-ahuja"
              ]
            })
          }}
        />
      </head>
      <body>
        <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem disableTransitionOnChange>
          <CustomCursor />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}