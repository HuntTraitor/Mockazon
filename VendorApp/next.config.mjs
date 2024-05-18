/** @type {import('next').NextConfig} */

const isProd = process.env.ENVIRONMENT == 'production';

const nextConfig = {
  basePath: isProd ? '/vendor' : undefined,
  assetPrefix: isProd ? '/vendor' : undefined,
  publicRuntimeConfig: {
    basePath: isProd ? '/vendor' : '',
  },
  reactStrictMode: true,
  experimental: {
    serverMinification: false,
  }
};

export default nextConfig;
