/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.ENVIRONMENT === 'production' ? '/vendor' : '',
  assetPrefix: process.env.ENVIRONMENT === 'production' ? '/vendor' : '',
  reactStrictMode: true,
};

export default nextConfig;
