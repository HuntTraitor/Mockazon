import '@/styles/globals.css';
import type { AppProps } from 'next/app';

/**
 * App
 * @param {AppProps} props
 * @return {JSX.Element}
 */
export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
