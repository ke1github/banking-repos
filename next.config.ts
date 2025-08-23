import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Performance optimizations
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === "production",
  },
  // Server actions configuration
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000", "your-production-domain.com"],
    },
  },
  // Image optimization
  images: {
    domains: ["cloud.appwrite.io", "i.pravatar.cc"],
  },
  // Security: Remove the X-Powered-By header
  poweredByHeader: false,
};

export default nextConfig;
