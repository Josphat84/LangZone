// next.config.ts

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
  
  // Add webpack configuration to prevent build hangs
  webpack: (config, { isServer, webpack }) => {
    // Prevent webpack from hanging on builds
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
      };
    }

    // Ignore node_modules warnings that might cause hangs
    config.ignoreWarnings = [
      { module: /node_modules/ },
      { file: /node_modules/ },
    ];

    // Optimize build performance
    config.optimization = {
      ...config.optimization,
      moduleIds: 'deterministic',
    };

    return config;
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