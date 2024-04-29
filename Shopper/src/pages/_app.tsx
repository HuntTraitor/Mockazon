import '@/styles/globals.css';
import type { AppProps } from 'next/app';

/**
 * App
 * @param {any} Component
 * @param {any} pageProps
 * @constructor
 */
export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
