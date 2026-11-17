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
};

export default nextConfig;
