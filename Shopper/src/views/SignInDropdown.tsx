import React, { useContext } from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import CustomPopper from '@/components/CustomPopper';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import styles from '@/styles/SignInDropdown.module.css';
import { LoggedInContext } from '@/contexts/LoggedInUserContext';
import { useAppContext } from '@/contexts/AppContext';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useRouter } from 'next/router';

const SignInDropdown = () => {
  const { t } = useTranslation('signInDropdown');
  const { user, setUser, setAccessToken } = useContext(LoggedInContext);
  const { setBackDropOpen } = useAppContext();
  const router = useRouter();

  const handleSignOut = () => {
    localStorage.removeItem('user');
    setUser({ accessToken: '', id: '', name: '', role: '' });
    setAccessToken('');
    setBackDropOpen(false);
  };

  return (
    <Box
      aria-label="Sign In Container"
      className={`${styles.accountContainer} ${styles.hoverContainer}`}
    >
      <CustomPopper
        buttonContent={
          <Box
            aria-label="AppBar Account Button"
            display="flex"
            alignItems="center"
            className={styles.accountBox}
          >
            <Typography
              className={styles.buttonText}
              sx={{
                marginBottom: '12px',
              }}
            >
              <span className={styles.caption}>
                {`${t('hello')} ${user.name ? user.name : t('signInText')}`}
              </span>
              <span className={styles.boldBody2}>{t('accountsAndLists')}</span>
            </Typography>
            <ExpandMoreIcon className={styles.dropdownIcon} />
          </Box>
        }
        offset={[0, -14]}
      >
        <Paper
          elevation={5}
          className={styles.dropDownPaper}
          sx={{
            padding: '10px',
          }}
        >
          {user.name ? (
            <Box>
              <Button
                aria-label="Sign Out Button"
                className={styles.signInButton}
                onClick={handleSignOut}
              >
                {t('signOutText')}
              </Button>
            </Box>
          ) : (
            <Box>
              <Button
                className={styles.signInButton}
                aria-label="Sign In Button"
                onClick={() => {
                  router.push('/login');
                  setBackDropOpen(false);
                }}
              >
                {t('signInText')}
              </Button>
              <Typography className={styles.caption}>
                {t('newCustomer')}{' '}
                <Link aria-label="Sign Up Button" href="/signup">
                  {t('startHere')}
                </Link>
              </Typography>
            </Box>
          )}
        </Paper>
      </CustomPopper>
    </Box>
  );
};

export default SignInDropdown;
