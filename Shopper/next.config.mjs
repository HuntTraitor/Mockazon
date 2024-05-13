import i18n  from './next-i18next.config.js';

const nextConfig = {
  basePath: process.env.ENVIRONMENT === 'production' ? '/shopper' : '',
  reactStrictMode: true,
  ...i18n,
};

export default nextConfig;
