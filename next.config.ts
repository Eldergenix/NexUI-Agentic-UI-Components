import type { NextConfig } from "next";

// GitHub Pages deployment: the site is statically exported and served from
// `https://eldergenix.github.io/NexUI-Agentic-UI-Components/`.
//
// The deploy workflow sets NEXT_PUBLIC_BASE_PATH=/NexUI-Agentic-UI-Components.
// Locally the var is empty, so dev + root-domain deploys are unaffected.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  // Emit a fully static site to `out/` — no Node server required by Pages.
  output: "export",

  // Serve the app + its assets under the repo sub-path.
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,

  // `index.html` per route directory — friendlier for static hosts.
  trailingSlash: true,

  // Lint runs as a dedicated CI job (.github/workflows/ci.yml) — don't gate
  // the static-export build on it. Type errors still fail the build.
  eslint: {
    ignoreDuringBuilds: true,
  },

  images: {
    // next/image optimization needs a server; emit plain <img> for static export.
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "**.googleusercontent.com" },
      { protocol: "https", hostname: "picsum.photos" },
    ],
  },
};

export default nextConfig;
