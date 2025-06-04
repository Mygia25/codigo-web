/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // experimental: { appDir: true }, // This line is removed as appDir is default with an app directory
  allowedDevOrigins: [
    "http://localhost:3000",
    "https://3000-firebase-studio-1748739584969.cluster-hf4yr35cmnbd4vhbxvfvc6cp5q.cloudworkstations.dev"
  ],
};

module.exports = nextConfig;
