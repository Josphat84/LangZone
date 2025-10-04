// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: 'standalone',
  experimental: {
    turbo: {}, // Enable Turbopack
  },
  productionBrowserSourceMaps: false,
  transpilePackages: [],
  reactStrictMode: true,
  trailingSlash: false,
  images: {
    unoptimized: false,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
        ],
      },
    ]
  },
}

export default nextConfig
