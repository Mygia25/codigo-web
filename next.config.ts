
import type {NextConfig} from 'next';
import path from 'path'; // Added for webpack alias

const nextConfig: NextConfig = {
  reactStrictMode: true, // From next.config.js
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
  webpack: (config, { isServer }) => { // From next.config.js
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
  env: { // From next.config.js - serves as fallback for local dev
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://itrklyodvrgowtanxvhn.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0cmtseW9kdnJnb3d0YW54dmhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxNjgwNTUsImV4cCI6MjA2Mjc0NDA1NX0.0dF0l5zl6wSww2gz26ThQV3AAcxzaA96f2t6zpwD7pI'
  },
};

export default nextConfig;
