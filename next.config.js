/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  basePath: '/secondbrain',
  output: 'export',
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
