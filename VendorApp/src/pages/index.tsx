import Head from 'next/head';
import { Fragment } from 'react';
import { PageProvider } from '@/contexts/PageContext';
import { Home } from '@/views/HomePage/Home';

/**
 * Index page
 * @constructor
 */
export default function Index() {
  return (
    <Fragment>
      <Head>
        <title>Mockazon</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PageProvider>
        <Home />
      </PageProvider>
    </Fragment>
  );
}
