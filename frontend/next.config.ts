import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Add this to ensure index.html is generated
  exportPathMap: async function () {
    return {
      '/': { page: '/' },
    }
  }
}

export default nextConfig