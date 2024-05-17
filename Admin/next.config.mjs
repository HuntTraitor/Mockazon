/** @type {import('next').NextConfig} */

const isProd = process.env.ENVIRONMENT == 'production';

const nextConfig = {
  basePath: isProd ? '/admin' : undefined,
  assetPrefix: isProd ? '/admin' : undefined,
  publicRuntimeConfig: {
    basePath: isProd ? '/admin' : '',
  },
  reactStrictMode: true,
};

export default nextConfig;
