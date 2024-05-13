/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.ENVIRONMENT === 'production' ? '/admin' : '',
  assetPrefix: process.env.ENVIRONMENT === 'production' ? '/admin' : '',
  reactStrictMode: true,
};

export default nextConfig;
