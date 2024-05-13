import i18n  from './next-i18next.config.js';

const nextConfig = {
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
