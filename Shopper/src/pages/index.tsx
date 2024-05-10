import Head from 'next/head';
import { Fragment } from 'react';
import { App } from '@/views/App';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

const namespaces = ['common', 'login', 'signup', 'products'];
export const getServerSideProps: GetServerSideProps = async context => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale ?? 'en', namespaces)),
    },
  };
};

/**
 * Index page
 * @constructor
 */
export default function Index() {
  const { t } = useTranslation('common');
  return (
    <Fragment>
      <Head>
        <title>{t('title')}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <App />
    </Fragment>
  );
}
