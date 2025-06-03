
import type {NextConfig} from 'next';
import path from 'path'; // Added for webpack alias

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: false, // Explicitly set to false to address build warning
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
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
