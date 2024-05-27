import { Fragment } from 'react';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Products from '@/pages/products';
import { ThemeProvider } from '@mui/material';
import { mainTheme } from '@/styles/themes';
import '@fontsource/open-sans';
import Layout from '@/components/Layout';
import type { ReactElement } from 'react';

const namespaces = [
  'common',
  'login',
  'signup',
  'products',
  'topHeader',
  'subHeader',
  'signInDropdown',
  'viewProduct',
];
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
const Index = () => {
  // const { t } = useTranslation('common');
  // ok to hardcode as it's publicly accessible
  // const OAUTH_CLIENT_ID =
  //   '655989276717-5viil57sbom25s2804kadpdt3kiaa4on.apps.googleusercontent.com';

  return (
    <ThemeProvider theme={mainTheme}>
      <Fragment>
        <Products />
      </Fragment>
    </ThemeProvider>
  );
};

Index.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

export default Index;
