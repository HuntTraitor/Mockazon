import React, { useContext } from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import CustomPopper from '@/components/CustomPopper';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import styles from '@/styles/SignInDropdown.module.css';
import { LoggedInContext } from '@/contexts/LoggedInUserContext';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useRouter } from 'next/router';

const SignInDropdown = () => {
  const { t } = useTranslation('signInDropdown');
  const { user, setUser, setAccessToken } = useContext(LoggedInContext);
  const router = useRouter();

  const handleSignOut = () => {
    localStorage.removeItem('user');
    setUser({ accessToken: '', id: '', name: '', role: '' });
    setAccessToken('');
  };

  return (
    <Box
      aria-label="Sign In Container"
      className={`${styles.accountContainer} ${styles.hoverContainer}`}
    >
      <CustomPopper
        buttonContent={
          <Box display="flex" sx={{ color: 'white', textAlign: 'left' }}>
            <Typography>
              <span className={styles.caption}>
                {`${t('hello')} ${user.name ? user.name : t('signInText')}`}
              </span>
              <span className={styles.boldBody2}>{t('accountsAndLists')}</span>
            </Typography>
            <ExpandMoreIcon className={styles.dropdownIcon} />
          </Box>
        }
      >
        <Paper elevation={5} className={styles.dropDownPaper}>
          {user.name ? (
            <Box>
              <Typography>{user.name}</Typography>
              <Button className={styles.signInButton} onClick={handleSignOut}>
                {t('signOutText')}
              </Button>
            </Box>
          ) : (
            <Box>
              <Button
                className={styles.signInButton}
                aria-label="Sign In Button"
                onClick={() => router.push('/login')}
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
