/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.NODE_ENV === 'production' ? '/vendor' : '',
  reactStrictMode: true,
};

export default nextConfig;
