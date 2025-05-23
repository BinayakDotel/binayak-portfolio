/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Remove basePath as it might be causing the 404 issue
  // We'll handle routing through GitHub Pages configuration
};

module.exports = nextConfig; 