import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Local Vendure development server
      {
        protocol: "http",
        hostname: "localhost",
        port: "3001",
        pathname: "/assets/**",
      },
      // Production asset host (from NEXT_PUBLIC_ASSET_HOST env var)
      ...(process.env.NEXT_PUBLIC_ASSET_HOST &&
      process.env.NEXT_PUBLIC_ASSET_HOST !== "localhost:3001"
        ? [
            {
              protocol: "https" as const,
              hostname: process.env.NEXT_PUBLIC_ASSET_HOST,
              pathname: "/**",
            },
          ]
        : []),
      // Cloudflare R2 wildcard pattern
      {
        protocol: "https",
        hostname: "*.r2.cloudflarestorage.com",
        pathname: "/**",
      },
      // AWS S3 wildcard pattern
      {
        protocol: "https",
        hostname: "*.s3.*.amazonaws.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
