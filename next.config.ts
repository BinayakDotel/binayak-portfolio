import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/binayak-portfolio',
  assetPrefix: '/binayak-portfolio/',
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
};

export default nextConfig;
