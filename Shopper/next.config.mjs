import i18n  from './next-i18next.config.js';

const nextConfig = {
  basePath: process.env.NODE_ENV === 'production' ? '/shopper' : '',
  reactStrictMode: true,
  ...i18n,
};

export default nextConfig;
