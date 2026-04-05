import type { NextConfig } from "next";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/predict",
        destination: `${BACKEND_URL}/api/predict`,
      },
      {
        source: "/api/predict/:path*",
        destination: `${BACKEND_URL}/api/predict/:path*`,
      },
      {
        source: "/api/heatmap",
        destination: `${BACKEND_URL}/api/heatmap`,
      },
      {
        source: "/api/heatmap/:path*",
        destination: `${BACKEND_URL}/api/heatmap/:path*`,
      },
      {
        source: "/health",
        destination: `${BACKEND_URL}/health`,
      },
      {
        source: "/docs",
        destination: `${BACKEND_URL}/docs`,
      },
      {
        source: "/openapi.json",
        destination: `${BACKEND_URL}/openapi.json`,
      },
    ];
  },
};

export default nextConfig;
