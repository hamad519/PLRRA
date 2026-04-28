import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,

  // correct for Next.js App Router
  serverExternalPackages: ["pdf-parse", "mammoth"],

  experimental: {
    serverActions: {
      bodySizeLimit: "500mb",
    },
  },

  // IMPORTANT: force webpack mode (avoids Turbopack conflict)
  webpack: (config, { dev }) => {
    if (dev) {
      config.module.rules.push({
        test: /\.(jsx|tsx)$/,
        exclude: /node_modules/,
        enforce: "pre",
        use: {
          loader: "@dyad-sh/nextjs-webpack-component-tagger",
        },
      });
    }

    return config;
  },
};

export default nextConfig;