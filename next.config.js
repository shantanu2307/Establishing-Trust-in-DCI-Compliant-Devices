/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true,
  },
  publicRuntimeConfig: {
    backendUrl: 'http://127.0.0.1:5000',
  },
};

module.exports = nextConfig;
