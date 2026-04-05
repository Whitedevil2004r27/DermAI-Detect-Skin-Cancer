import type { NextConfig } from "next";

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
        source: "/api/predict/:path*",
        destination: "http://localhost:8000/api/predict/:path*",
      },
      {
        source: "/api/heatmap/:path*",
        destination: "http://localhost:8000/api/heatmap/:path*",
      },
      {
        source: "/health",
        destination: "http://localhost:8000/health",
      },
      {
        source: "/docs",
        destination: "http://localhost:8000/docs",
      },
      {
        source: "/openapi.json",
        destination: "http://localhost:8000/openapi.json",
      },
    ];
  },
};

export default nextConfig;
