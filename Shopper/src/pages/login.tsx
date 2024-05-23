import { useContext, useEffect, useState } from 'react';
import {
  Box,
  Divider,
  Paper,
  Typography,
  Button,
  TextField,
  ThemeProvider,
} from '@mui/material';
import {
  CredentialResponse,
  GoogleLogin,
  GoogleOAuthProvider,
} from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { LoggedInContext } from '@/contexts/LoggedInUserContext';
import { useTranslation } from 'next-i18next';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import styles from '@/styles/Login.module.css';
import Image from 'next/image';
import { mainTheme } from '@/styles/themes';
import getConfig from 'next/config';

const { basePath } = getConfig().publicRuntimeConfig;

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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { accessToken, setAccessToken, setUser } = useContext(LoggedInContext);
  const { t, i18n } = useTranslation(['common', 'login']);
  const router = useRouter();

  useEffect(() => {
    localStorage.removeItem('user');
  }, []);

  const handleSignIn = async () => {
    try {
      const query = {
        query: `query Login {
        login(email: "${email}", password: "${password}") {
          id
          name
          accessToken
          role
        }
      }`,
      };
      const response = await fetch(`${basePath}/api/graphql`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(query),
      });
      const data = await response.json();
      if (response.ok) {
        if (data.errors && data.errors.length > 0) {
          console.error('Error logging in:', data.errors[0].message);
          alert(data.errors[0].message);
          return;
        }
        setUser(data.data.login);
        localStorage.setItem('user', JSON.stringify(data.data.login));
        setAccessToken(data.data.login.accessToken);
        await router.push('/');
      } else {
        console.error('Error logging in');
        alert('Unexpected error occurred');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Unexpected error occurred: ' + error);
    }
  };

  const handleGoogleSuccess = async (
    credentialResponse: CredentialResponse
  ) => {
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
      const response = await fetch(`${basePath}/api/graphql`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(query),
      });
      const data = await response.json();
      if (response.ok) {
        if (data.errors && data.errors.length > 0) {
          console.error('Error logging in:', data.errors[0].message);
          alert(data.errors[0].message);
          return;
        }
        setUser(data.data.login);
        localStorage.setItem('user', JSON.stringify(data.data.login));
        setAccessToken(data.data.login.accessToken);
        await router.push('/');
      } else {
        console.error('Error logging in');
        alert('Unexpected error occurred');
        return;
      }
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Unexpected error occurred: ' + error);
    }
  };

  // UI partly referenced from: https://chat.openai.com/share/ee28fc31-d9b8-4193-8cb5-1bb793b8c66d
  // ok to hardcode as it's publicly accessible
  const OAUTH_CLIENT_ID =
    '655989276717-5viil57sbom25s2804kadpdt3kiaa4on.apps.googleusercontent.com';

  if (accessToken) {
    return null;
  }

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSignIn();
  };

  return (
    <ThemeProvider theme={mainTheme}>
      <Box className={styles.loginContainer}>
        <Image
          src="/mockazon_logo_white.png"
          alt="logo"
          width={180}
          height={100}
          className={styles.logo}
          onClick={() => router.push('/')}
          priority
        />
        <Paper elevation={3} className={styles.loginForm}>
          <form onSubmit={handleFormSubmit}>
            <div className={styles.titleContainer}>
              <Typography variant="h4" className={styles.title}>
                {t('login:title')}
              </Typography>
            </div>
            <TextField
              className={styles.emailInput}
              label={t('login:email')}
              aria-label={`${t('login:email')}`}
              value={email}
              size="small"
              onChange={event => setEmail(event.target.value)}
              inputProps={{ fontSize: 2 }}
              fullWidth
              margin="normal"
            />
            <TextField
              className={styles.passwordInput}
              label={t('login:password')}
              aria-label={`${t('login:password')}`}
              type="password"
              size="small"
              value={password}
              onChange={event => setPassword(event.target.value)}
              fullWidth
              margin="normal"
            />
            <Button
              className={styles.signInButton}
              variant="contained"
              color="primary"
              type="submit"
              onClick={handleSignIn}
              fullWidth
            >
              {t('common:signInText')}
            </Button>
            <Divider className={styles.divider}>{t('common:or')}</Divider>
            <GoogleOAuthProvider clientId={OAUTH_CLIENT_ID}>
              <GoogleLogin
                shape="rectangular"
                width="350px"
                context="signin"
                aria-label="Google Login Button"
                locale={i18n.language == 'en' ? 'en-US' : 'es-US'}
                onSuccess={handleGoogleSuccess}
              />
            </GoogleOAuthProvider>
            <Typography
              variant="body2"
              color="textSecondary"
              className={styles.agreementText}
            >
              {t('login:agreement')}
            </Typography>
          </form>
        </Paper>
        <Divider className={styles.newToAmazonDivider}>
          {t('login:newToMockazon')}
        </Divider>
        <Button
          aria-label="Create Account Button"
          className={styles.createAccountButton}
          onClick={() => router.push('/signup')}
        >
          {t('login:createAccount')}
        </Button>
      </Box>
    </ThemeProvider>
  );
};

export default Login;
