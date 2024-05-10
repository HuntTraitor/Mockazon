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
import Switcher from '@/views/Switcher';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
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
const Signup = () => {
  const [error, setError] = useState('');
  const { accessToken, setAccessToken } = useContext(LoggedInContext);
  const { t } = useTranslation('signup');
  const router = useRouter();

  useEffect(() => {
    localStorage.removeItem('user');
  }, []);

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      const decoded: { sub: string; email: string; name: string } = jwtDecode(
        credentialResponse?.credential as string
      );
      const response = await fetch(`${window.location.origin}/api/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sub: decoded.sub,
          email: decoded.email,
          name: decoded.name,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('user', JSON.stringify(data.authenticated));
        setAccessToken(data.authenticated);
        await router.push('/products');
      } else {
        if (response.status === 400) {
          console.error('Duplicate account:', error);
          setError('Duplicate account');
          return;
        }
        console.error('Error logging in:', error);
        setError('Login failed');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setError('Login failed');
    }
  };
  const OAUTH_CLIENT_ID =
    '655989276717-5viil57sbom25s2804kadpdt3kiaa4on.apps.googleusercontent.com';

  return !accessToken ? (
    <GoogleOAuthProvider clientId={OAUTH_CLIENT_ID}>
      <Switcher />
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
              onClick={() => router.push('/login')}
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
  // UI partly referenced from: https://chat.openai.com/share/ee28fc31-d9b8-4193-8cb5-1bb793b8c66d
};

export default Signup;
