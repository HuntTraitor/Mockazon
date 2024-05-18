import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { appWithTranslation } from 'next-i18next';
import { LoggedInUserProvider } from '@/contexts/LoggedInUserContext';
import { AppContextProvider } from '@/contexts/AppContext';
import { SnackbarProvider } from 'notistack';
import Head from 'next/head';

/**
 * App
 * @param {any} Component
 * @param {any} pageProps
 * @constructor
 */
function App({ Component, pageProps }: AppProps) {
  return (
    <AppContextProvider>
      <LoggedInUserProvider>
        <SnackbarProvider maxSnack={1}>
          <Head>
            <title>Mockazon</title>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <Component {...pageProps} />
        </SnackbarProvider>
      </LoggedInUserProvider>
    </AppContextProvider>
  );
}

export default appWithTranslation(App);
