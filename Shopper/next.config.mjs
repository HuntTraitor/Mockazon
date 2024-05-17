/** @type {import('next').NextConfig} */
import i18n  from './next-i18next.config.js';

const nextConfig = {
  reactStrictMode: true,
  ...i18n,
  publicRuntimeConfig: {
    basePath: '',
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    dangerouslyAllowSVG: true,
  },
};

export default nextConfig;
