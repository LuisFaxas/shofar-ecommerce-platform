/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    '@shofar/ui',
    '@shofar/api-client',
    '@shofar/feature-flags',
    '@shofar/brand-config'
  ],
  images: {
    remotePatterns: [
      // CDN domains for production assets
      {
        protocol: 'https',
        hostname: process.env.NEXT_PUBLIC_CDN_HOST || 'cdn.example.com',
        pathname: '/assets/**',
      },
      // Cloudflare R2/S3 domains
      {
        protocol: 'https',
        hostname: '*.r2.cloudflarestorage.com',
      },
      {
        protocol: 'https',
        hostname: '*.s3.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: '*.s3.*.amazonaws.com',
      },
      // Vendure local development
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/assets/**',
      },
    ],
  },
  async headers() {
    return [
      {
        // Cache static assets for 1 year with immutable
        source: '/assets/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache images for 1 year
        source: '/_next/image(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, must-revalidate',
          },
        ],
      },
      {
        // Security headers for all routes
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(self)',
          },
        ],
      },
      {
        // Special headers for Authorize.Net communicator
        source: '/authorize-net/communicator.html',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN', // Allow framing from same origin only
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' https://*.authorize.net;",
          },
        ],
      },
    ];
  },
  experimental: {
    optimizeCss: true,
  },
};

export default nextConfig;