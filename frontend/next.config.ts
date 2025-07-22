import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Modern settings to prevent deprecated API issues
  experimental: {
    // Add supported experimental options here if needed
  },
  // Enable modern performance features
  productionBrowserSourceMaps: false, // Set to true if you need debugging
  // Optional: Add transpilePackages if using specific libraries
  transpilePackages: [],
  // Enable React strict mode
  reactStrictMode: true
}

export default nextConfig