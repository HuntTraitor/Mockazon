import Head from 'next/head';
import { Fragment } from 'react';
import { App } from '../views/App';

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
        <link rel="icon" href="/favicon.ico" />{' '}
        {/* replace with mockazon logo */}
      </Head>
      <App />
    </Fragment>
  );
}
