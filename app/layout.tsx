import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "dialkit/styles.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ShapeProvider } from "@/registry/default/lib/shape-context";
import { ThemeProvider } from "@/registry/default/lib/theme-context";
import { IconProvider } from "@/registry/default/lib/icon-context";
import { SidebarLayout } from "@/app/components/sidebar-layout";
import { DialRoot } from "dialkit";

// Inter loaded via next/font/local so the asset URL is automatically
// basePath/assetPrefix-aware — critical for the GitHub Pages sub-path deploy.
const inter = localFont({
  src: "../public/fonts/InterVariable.ttf",
  variable: "--font-inter",
  weight: "100 900",
  display: "swap",
});

const SITE_TITLE =
  "NexUI — Agentic UI Components for AI SDK v6 (shadcn Registry)";
const SITE_DESCRIPTION =
  "The most complete shadcn/ui registry for AI agent applications. Chat composers, tool renderers, streaming UI, thinking indicators, glass avatars, agent shell layouts, MCP support, and AI artifacts — built for Vercel AI SDK v6, Next.js 15, React 19, and Tailwind v4.";
const SITE_URL =
  "https://eldergenix.github.io/NexUI-Agentic-UI-Components";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s — NexUI",
  },
  description: SITE_DESCRIPTION,
  applicationName: "NexUI",
  authors: [{ name: "Eldergenix", url: "https://x.com/elderatlantean" }],
  creator: "Eldergenix",
  publisher: "Eldergenix",
  keywords: [
    "shadcn registry",
    "shadcn ui",
    "AI SDK v6",
    "Vercel AI SDK",
    "AI agent UI",
    "agentic UI",
    "AI chat components",
    "streaming UI",
    "tool calling UI",
    "thinking indicator",
    "AI artifacts",
    "MCP",
    "Model Context Protocol",
    "Claude UI",
    "Next.js 15",
    "React 19",
    "Tailwind v4",
    "NexUI",
  ],
  icons: {
    icon: [
      { url: "/metadata/favicon.svg", type: "image/svg+xml" },
      { url: "/metadata/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/metadata/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/metadata/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    shortcut: "/metadata/favicon.ico",
    apple: "/metadata/apple-touch-icon.png",
  },
  manifest: "/metadata/site.webmanifest",
  openGraph: {
    type: "website",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: "NexUI",
    images: [{ url: "/metadata/og.png", width: 1200, height: 630, alt: "NexUI — Agentic UI Components for AI SDK v6" }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    creator: "@elderatlantean",
    site: "@elderatlantean",
    images: ["/metadata/og.png"],
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased bg-background text-foreground">
        <ShapeProvider defaultShape="pill">
          <ThemeProvider>
            <IconProvider>
              <SidebarLayout>{children}</SidebarLayout>
              <DialRoot />
              <Analytics />
              <SpeedInsights />
            </IconProvider>
          </ThemeProvider>
        </ShapeProvider>
      </body>
    </html>
  );
}
