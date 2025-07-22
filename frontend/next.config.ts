import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Output configuration for Vercel
  output: 'standalone', // This can help with deployment issues
  
  // Modern settings to prevent deprecated API issues
  experimental: {
    // Remove any deprecated experimental features
  },
  
  // Enable modern performance features
  productionBrowserSourceMaps: false,
  
  // Transpile packages if needed
  transpilePackages: [],
  
  // Enable React strict mode
  reactStrictMode: true,
  
  // Add trailingSlash to handle routing better
  trailingSlash: false,
  
  // Ensure proper asset optimization
  images: {
    unoptimized: false, // Set to true if having image optimization issues
  },
  
  // Add headers for better caching and security
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