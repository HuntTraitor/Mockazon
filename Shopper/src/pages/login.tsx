import { useContext, useEffect, useState } from 'react';
import { Box, Container, Grid, Paper, Typography } from '@mui/material';
import {
  CredentialResponse,
  GoogleLogin,
  GoogleOAuthProvider,
} from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { LoggedInContext } from '@/contexts/LoggedInUserContext';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import LanguageSwitcher from '@/views/LanguageSwitcher';
import { useRouter } from 'next/router';

const namespaces = ['common', 'login', 'signup', 'products'];
export const getServerSideProps: GetServerSideProps = async context => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale ?? 'en', namespaces)),
    },
  };
};

// based this login screen off of lukas's cse 115 project
const Login = () => {
  const [error, setError] = useState('');
  const { accessToken, setAccessToken } = useContext(LoggedInContext);
  const { t } = useTranslation('login');
  const router = useRouter();

  useEffect(() => {
    localStorage.removeItem('user');
  }, []);

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse?.credential as string);
      const query = {
        query: `query LogIn {
    login(sub: "${decoded.sub}") {
      id
      name
      accessToken
      role
    }
  }`,
      };
      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(query),
      });
      const data = await response.json();
      if (response.ok) {
        if (data.errors && data.errors.length > 0) {
          console.error('Error logging in:', error);
          setError('Login failed');
        }
        localStorage.setItem('user', JSON.stringify(data.data.login));
        setAccessToken(data.data.login.accessToken);
        await router.push('/products');
      } else {
        console.error('Error logging in:', error);
        setError('Login failed');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setError('Login failed');
    }
  };

  // UI partly referenced from: https://chat.openai.com/share/ee28fc31-d9b8-4193-8cb5-1bb793b8c66d
  // ok to hardcode as it's publicly accessible
  const OAUTH_CLIENT_ID =
    '655989276717-5viil57sbom25s2804kadpdt3kiaa4on.apps.googleusercontent.com';
  return !accessToken ? (
    <GoogleOAuthProvider clientId={OAUTH_CLIENT_ID}>
      <LanguageSwitcher />
      <Container maxWidth="sm">
        <Grid
          container
          spacing={2}
          justifyContent="center"
          alignItems="center"
          style={{ minHeight: '70vh' }}
        >
          <Grid item xs={12} textAlign="center">
            <Typography
              aria-label={'title'}
              variant="h4"
              component="h1"
              gutterBottom
            >
              {t('title')}
            </Typography>
            <Link
              style={{ color: 'blue' }}
              aria-label={'sub-title'}
              href={'#'}
              onClick={() => router.push('/signup')}
            >
              <Typography variant="h6" component="h6" gutterBottom>
                {t('sub-title')}
              </Typography>
            </Link>
          </Grid>
          <Grid item xs={12} textAlign="center">
            <Paper
              elevation={3}
              sx={{
                padding: 4,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <Typography variant="h4" gutterBottom>
                  {t('prompt')}
                </Typography>
                {error && (
                  <Typography variant="body1" color="error">
                    {error}
                  </Typography>
                )}
                <GoogleLogin onSuccess={handleSuccess} />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </GoogleOAuthProvider>
  ) : (
    <></>
  );
};

export default Login;
