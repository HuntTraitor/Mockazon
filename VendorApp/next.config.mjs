/** @type {import('next').NextConfig} */

const isProd = process.env.ENVIRONMENT == 'production';

const nextConfig = {
  basePath: isProd ? '/vendor' : undefined,
  reactStrictMode: true,
};

export default nextConfig;
