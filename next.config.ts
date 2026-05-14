import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,

  images: {
    unoptimized: true,
  },

  serverExternalPackages: ["pdf-parse", "mammoth", "@prisma/client"],

  experimental: {
    serverActions: {
      bodySizeLimit: "500mb",
    },
  },

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