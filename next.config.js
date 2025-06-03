// This file is no longer needed as its contents have been merged into next.config.ts
// You can safely delete this file.
/*
const path = require('path');

/** @type {import('next').NextConfig} */
/*
const nextConfig = {
  reactStrictMode: true,
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
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://itrklyodvrgowtanxvhn.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0cmtseW9kdnJnb3d0YW54dmhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxNjgwNTUsImV4cCI6MjA2Mjc0NDA1NX0.0dF0l5zl6wSww2gz26ThQV3AAcxzaA96f2t6zpwD7pI'
  },
  compiler: {
    styledComponents: true,
  },
};

module.exports = nextConfig;
*/
