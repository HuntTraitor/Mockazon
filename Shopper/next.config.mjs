import i18n  from './next-i18next.config.js';

const nextConfig = {
  assetPrefix: '/',
  reactStrictMode: true,
  ...i18n,
};

export default nextConfig;
