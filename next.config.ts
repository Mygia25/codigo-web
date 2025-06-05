import type { NextConfig } from 'next';
import path from 'path'; // For webpack alias

const nextConfig: NextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
  },

  allowedDevOrigins: [
    "http://localhost:3000",
    "https://3000-firebase-studio-1748739584969.cluster-hf4yr35cmnbd4vhbxvfvc6cp5q.cloudworkstations.dev",
  ],

  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },

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

  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback, // Preserve existing fallbacks
        // Original fallbacks
        fs: false,
        tls: false,
        net: false,
        path: false,
        zlib: false,
        http: false,
        https: false,
        stream: false,
        crypto: false,
        dns: false,
        http2: false,
        dgram: false,
        async_hooks: false,
        child_process: false,
        // Fallbacks for 'node:' prefixed imports
        "node:fs": false,
        "node:tls": false,
        "node:net": false,
        "node:path": false,
        "node:zlib": false,
        "node:http": false,
        "node:https": false,
        "node:stream": false,
        "node:crypto": false,
        "node:dns": false,
        "node:http2": false,
        "node:dgram": false,
        "node:async_hooks": false,
        "node:child_process": false,
        "node:buffer": false, // From the latest error log
        "node:events": false, // From the latest error log
      };
    }
    // Preserve your handlebars alias or other webpack adjustments
    config.resolve.alias['handlebars'] = path.resolve(__dirname, 'node_modules/handlebars/dist/handlebars.min.js');
    return config;
  },
};

export default nextConfig;
