/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove standalone output to avoid symlink issues
  poweredByHeader: false,
  reactStrictMode: true,
  // Disable image optimization
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
