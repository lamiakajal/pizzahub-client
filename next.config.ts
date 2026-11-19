import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Tailwind is compiled through the Turbopack loader in this project.
  turbopack: {
    // Without this, a stray lockfile in a parent folder makes Next pick the wrong root.
    root: process.cwd(),
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    // Menu item photos are hosted on ImgBB.
    remotePatterns: [
      { protocol: "https", hostname: "i.ibb.co" },
      { protocol: "https", hostname: "i.ibb.co.com" },
    ],
  },
};

export default nextConfig;
