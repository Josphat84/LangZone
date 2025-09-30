import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Output configuration for Vercel
  output: 'standalone',

  // Modern performance features
  productionBrowserSourceMaps: false,
  reactStrictMode: true,
  trailingSlash: false,

  images: {
    unoptimized: false,
  },

  // === Ensure Next.js treats this folder as the project root ===
  turbopack: {
    root: __dirname, // <-- frontend folder is now explicitly the root
  },

  // Headers for security
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
        ],
      },
    ]
  },
}

export default nextConfig
