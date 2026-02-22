import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Removed 'output: export' to enable API routes for view tracking
  // The site will still generate static pages where possible, but API routes will work
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/blog',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
