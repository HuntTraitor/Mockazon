import '@/styles/globals.css';
import type { AppProps } from 'next/app';

/**
 * Renders the app.
 * @param {AppProps} param0 - The app properties.
 * @return {JSX.Element} The rendered app.
 */
export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
