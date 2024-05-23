import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { appWithTranslation } from 'next-i18next';
import { LoggedInUserProvider } from '@/contexts/LoggedInUserContext';
import { AppContextProvider } from '@/contexts/AppContext';
import { SnackbarProvider } from 'notistack';
import Head from 'next/head';
import type { ReactElement, ReactNode } from 'react';
import type { NextPage } from 'next';

// eslint-disable-next-line
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

/**
 * App
 * @param {any} Component
 * @param {any} pageProps
 * @constructor
 */
function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? (page => page);

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
          {getLayout(<Component {...pageProps} />)}
        </SnackbarProvider>
      </LoggedInUserProvider>
    </AppContextProvider>
  );
}

export default appWithTranslation(App);
