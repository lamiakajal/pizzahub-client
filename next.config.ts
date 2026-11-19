import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Tailwind is compiled through the Turbopack loader in this project.
  turbopack: {
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
