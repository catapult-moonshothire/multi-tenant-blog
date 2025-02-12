/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Existing image configuration
  images: {
    domains: ["localhost", "xxyy.in"],
    // Add image optimization settings
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },

  // Enable compression for better performance
  compress: true,

  // Optimize production builds
  swcMinify: true,

  // Existing webpack configuration with optimizations
  webpack: (config, { dev, isServer }) => {
    // Keep existing fallback configuration for client-side
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
      };
    }

    // Keep existing SVG configuration
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    // Add production optimizations
    if (!dev) {
      // Enable tree shaking
      config.optimization = {
        ...config.optimization,
        usedExports: true,
        sideEffects: true,
        minimize: true,
      };

      // Split chunks for better caching
      config.optimization.splitChunks = {
        chunks: "all",
        minSize: 20000,
        maxSize: 244000,
        minChunks: 1,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        cacheGroups: {
          defaultVendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            reuseExistingChunk: true,
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
        },
      };
    }

    return config;
  },

  // Keep existing rewrites
  async rewrites() {
    return [
      {
        source: "/:path*",
        destination: "/:path*",
      },
    ];
  },

  // Add headers for better caching and security
  async headers() {
    return [
      {
        // Cache static assets
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Cache fonts
        source: "/fonts/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Add security headers
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
        ],
      },
    ];
  },

  // Enable performance optimization features
  experimental: {
    // Enable optimizations that are stable enough for production
    optimizeCss: true, // Optimize CSS
    optimizePackageImports: ["lucide-react", "@radix-ui/react-icons"], // Optimize specific package imports
    webpackBuildWorker: true, // Use workers for build process
  },

  // Configure build output
  output: "standalone",

  // Add powered by header
  poweredByHeader: false,
};

module.exports = nextConfig;
