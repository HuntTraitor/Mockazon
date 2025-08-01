import { useContext, useEffect, useState } from 'react';
import {
  Box,
  Divider,
  Paper,
  TextField,
  Typography,
  ThemeProvider,
  useTheme,
  useMediaQuery,
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
import { mainTheme } from '@/styles/themes';
import styles from '@/styles/Signup.module.css';
import Image from 'next/image';
import { Button } from '@mui/material';
import Link from 'next/link';
import getConfig from 'next/config';

const { basePath } = getConfig().publicRuntimeConfig;

const namespaces = ['common', 'login', 'signup', 'products', 'accountDrawer'];
export const getServerSideProps: GetServerSideProps = async context => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale ?? 'en', namespaces)),
    },
  };
};

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { accessToken, setAccessToken, setUser } = useContext(LoggedInContext);
  const { t, i18n } = useTranslation(['common', 'signup']);
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    localStorage.removeItem('user');
  }, []);

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      alert(t('signup:passwordMismatch'));
      return;
    }
    try {
      const query = {
        query: `mutation SignUp {
          signUp(credentials: { name: "${name}", email: "${email}", password: "${password}" }) {
            id
            name
            email
            role
            accessToken
          }
        }`,
      };
      const response = await fetch(`${basePath}/api/graphql`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(query),
      });
      if (response.ok) {
        const data = await response.json();
        if (data.errors && data.errors.length > 0) {
          if (data.errors[0].message === 'Duplicate account') {
            //console.error('Duplicate account:', data.errors[0].message);
            // alert(t('signup:duplicateAccount'));
            return;
          } else {
            //console.error('Error signing up:', data.errors[0].message);
            alert(t('signup:signupFailed'));
            return;
          }
        }
        localStorage.setItem('user', JSON.stringify(data.data.signUp));
        setUser(data.data.signUp);
        setAccessToken(data.data.signUp.accessToken);
        await router.push('/');
      } else {
        //console.error('Network error signing up.');
        alert(t('signup:signupFailed'));
        return;
      }
    } catch (error) {
      //console.error('Error signing up:', error);
      alert(t('signup:signupFailed'));
    }
  };

  const handleGoogleSuccess = async (
    credentialResponse: CredentialResponse
  ) => {
    try {
      const decoded: { sub: string; email: string; name: string } = jwtDecode(
        credentialResponse?.credential as string
      );
      const query = {
        query: `mutation SignUp {
          signUp(googleCredentials: {
          sub: "${decoded.sub}",
          email: "${decoded.email}",
          name: "${decoded.name}"}) {
            id
            name
            email
            role
            sub
            accessToken
          }
        }`,
      };
      const response = await fetch(`${basePath}/api/graphql`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(query),
      });
      if (response.ok) {
        const data = await response.json();
        if (data.errors && data.errors.length > 0) {
          if (data.errors[0].message === 'Duplicate account') {
            //console.error('Duplicate account:', data.errors[0].message);
            // alert(t('signup:duplicateAccount'));
            return;
          } else {
            //console.error('Error signing up:', data.errors[0].message);
            alert(t('signup:signupFailed'));
            return;
          }
        }
        localStorage.setItem('user', JSON.stringify(data.data.signUp));
        setUser(data.data.signUp);
        setAccessToken(data.data.signUp.accessToken);
        await router.push('/');
      } else {
        //console.error('Network error signing up.');
        alert(t('signup:signupFailed'));
        return;
      }
    } catch (error) {
      //console.error('Error signing up:', error);
      alert(t('signup:signupFailed'));
    }
  };

  const OAUTH_CLIENT_ID =
    '655989276717-5viil57sbom25s2804kadpdt3kiaa4on.apps.googleusercontent.com';

  if (accessToken) {
    return null;
  }

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    handleSignUp();
  };

  return (
    <ThemeProvider theme={mainTheme}>
      <Box
        className={
          isMobile ? styles.signUpContainerMobile : styles.signUpContainer
        }
      >
        <Image
          src="/mockazon_logo_white.png"
          alt="logo"
          width={isMobile ? 120 : 180}
          height={isMobile ? 80 : 100}
          className={styles.logo}
          onClick={() => router.push('/')}
        />
        <Paper
          elevation={3}
          className={isMobile ? styles.signUpFormMobile : styles.signUpForm}
        >
          <form onSubmit={handleFormSubmit}>
            <div className={styles.titleContainer}>
              <Typography
                variant={isMobile ? 'h5' : 'h4'}
                className={styles.title}
              >
                {t('signup:title')}
              </Typography>
            </div>
            <TextField
              className={styles.nameInput}
              label={t('signup:name')}
              aria-label={`${t('signup:name')}`}
              value={name}
              size="small"
              onChange={event => setName(event.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              className={styles.emailInput}
              label={t('signup:email')}
              aria-label={`${t('signup:email')}`}
              value={email}
              size="small"
              onChange={event => setEmail(event.target.value)}
              fullWidth
              margin="normal"
            />{' '}
            <TextField
              className={styles.passwordInput}
              label={t('signup:password')}
              aria-label={`${t('signup:password')}`}
              type="password"
              size="small"
              value={password}
              onChange={event => setPassword(event.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              className={styles.confirmPasswordInput}
              label={t('signup:confirmPassword')}
              aria-label={`${t('signup:confirmPassword')}`}
              type="password"
              size="small"
              value={confirmPassword}
              onChange={event => setConfirmPassword(event.target.value)}
              fullWidth
              margin="normal"
            />
            <Button
              className={styles.signUpButton}
              variant="contained"
              color="primary"
              type="submit"
              onClick={handleSignUp}
              aria-label={`${t('signup:signUpText')}`}
              fullWidth
            >
              {t('signup:signUpText')}
            </Button>
            <Divider className={styles.divider}>{t('common:or')}</Divider>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <GoogleOAuthProvider clientId={OAUTH_CLIENT_ID}>
                <Box sx={{ maxWidth: !isMobile ? 'none' : '220px' }}>
                  <GoogleLogin
                    shape="rectangular"
                    width={isMobile ? '250px' : '350px'}
                    context="signup"
                    text="signup_with"
                    locale={i18n.language === 'en' ? 'en-US' : 'es-US'}
                    onSuccess={handleGoogleSuccess}
                  />
                </Box>
              </GoogleOAuthProvider>
            </Box>
            <Typography
              variant="body2"
              color="textSecondary"
              className={styles.agreementText}
            >
              {t('signup:agreement')}
            </Typography>
            <div className={styles.titleContainer}>
              <Typography
                variant="body2"
                className={
                  isMobile
                    ? styles.alreadyHaveAccountMobile
                    : styles.alreadyHaveAccount
                }
              >
                {t('signup:alreadyHaveAccount')}{' '}
                <Link className={styles.signInButton} href="/login">
                  {t('common:signInText')}
                </Link>
              </Typography>
            </div>{' '}
          </form>
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default Signup;
