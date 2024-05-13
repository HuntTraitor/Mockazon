import i18n  from './next-i18next.config.js';

const nextConfig = {
  basePath: process.env.ENVIRONMENT === 'production' ? '/' : '',
  assetPrefix: process.env.ENVIRONMENT === 'production' ? '/' : '',
  reactStrictMode: true,
  ...i18n,
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
