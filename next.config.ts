import type {NextConfig} from 'next';
import path from 'path'; // Added for webpack alias

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // swcMinify: false, // Removed as per Next.js 15 compatibility / build warning
  typescript: {
    ignoreBuildErrors: false, // CHANGED: Surface TypeScript errors during build
  },
  eslint: {
    ignoreDuringBuilds: false, // CHANGED: Surface ESLint errors during build
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
    ],
  },
  // Configuración para desarrollo en Cloud Workstations
  allowedDevOrigins: [
    '9000-firebase-studio-1748739584969.cluster-hf4yr35cmnbd4vhbxvfvc6cp5q.cloudworkstations.dev'
  ],
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
  // env block removed to rely solely on apphosting.yaml for build-time environment variables
};

export default nextConfig;
