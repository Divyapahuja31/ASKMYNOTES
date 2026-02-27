import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const rawUrl = "https://askmynotes-backend.onrender.com";
    const backendUrl = rawUrl.endsWith("/") ? rawUrl.slice(0, -1) : rawUrl;

    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
      {
        source: "/socket.io/:path*",
        destination: `${backendUrl}/socket.io/:path*`,
      }
    ];
  },
};

export default nextConfig;
