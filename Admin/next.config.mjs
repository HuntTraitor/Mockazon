/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.NODE_ENV === 'production' ? '/admin' : '',
  reactStrictMode: true,
};

export default nextConfig;
