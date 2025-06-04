import type { NextConfig } from 'next';
import path from 'path'; // For webpack alias

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Ensure no swcMinify is here if it caused issues

  // User's specified images configuration
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
  },

  // User's specified allowedDevOrigins configuration
  allowedDevOrigins: [
    "http://localhost:3000",
    "https://3000-firebase-studio-1748739584969.cluster-hf4yr35cmnbd4vhbxvfvc6cp5q.cloudworkstations.dev",
  ],

  // Preserving existing TypeScript and ESLint settings
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },

  // Preserving existing experimental.turbo (appDir is not and should not be here)
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },

  // Preserving existing webpack configuration
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        "fs": false,
        "tls": false,
        "net": false,
        "path": false,
        "zlib": false,
        "http": false,
        "https": false,
        "stream": false,
        "crypto": false
      };
    }
    config.resolve.alias['handlebars'] = path.resolve(__dirname, 'node_modules/handlebars/dist/handlebars.min.js');
    return config;
  },
};

export default nextConfig;
