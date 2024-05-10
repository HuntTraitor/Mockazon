import { Fragment } from 'react';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Products from '@/pages/products';

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
  // const { t } = useTranslation('common');
  // ok to hardcode as it's publicly accessible
  // const OAUTH_CLIENT_ID =
  //   '655989276717-5viil57sbom25s2804kadpdt3kiaa4on.apps.googleusercontent.com';

  return (
    <Fragment>
      <Products />
      {/*<Switcher />*/}
      {/*<Content />*/}
    </Fragment>
  );
}
