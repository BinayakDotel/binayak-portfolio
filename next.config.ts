import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',  // Enable static exports
  basePath: '/binayak-portfolio', // Your repository name
  images: {
    unoptimized: true, // Required for static export
  },
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;
    return config;
  }
};

export default nextConfig;
