import { Fragment } from 'react';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Products from '@/pages/products';
import { ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import '@fontsource/open-sans';

const namespaces = [
  'common',
  'login',
  'signup',
  'products',
  'topHeader',
  'signInDropdown',
];
export const getServerSideProps: GetServerSideProps = async context => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale ?? 'en', namespaces)),
    },
  };
};

const theme = createTheme({
  typography: {
    fontFamily: 'Open Sans, sans-serif',
  },
});

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
    <ThemeProvider theme={theme}>
      <Fragment>
        <Products />
        {/*LanguageSwitcher />*/}
        {/*<Content />*/}
      </Fragment>
    </ThemeProvider>
  );
}
