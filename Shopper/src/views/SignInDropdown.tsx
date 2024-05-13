import React, { useState, useContext } from 'react';
import {
  Box,
  Typography,
  Popper,
  PopperProps,
  Paper,
  Fade,
  Button,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import styles from '@/styles/SignInDropdown.module.css';
import { LoggedInContext } from '@/contexts/LoggedInUserContext';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useRouter } from 'next/router';

const SignInDropdown = () => {
  const { t } = useTranslation('signInDropdown');
  const { user, setUser, setAccessToken } = useContext(LoggedInContext);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const [anchorEl, setAnchorEl] = React.useState<PopperProps['anchorEl']>(null);
  const [leaveTimeout, setLeaveTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleOpen = (event: React.MouseEvent<HTMLDivElement>) => {
    if (leaveTimeout) {
      clearTimeout(leaveTimeout);
      setLeaveTimeout(null);
    }
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpen(false);
  };

  const handleMouseLeave = () => {
    setLeaveTimeout(
      setTimeout(() => {
        handleClose();
      }, 300)
    );
  };

  const handleSignOut = () => {
    localStorage.removeItem('user');
    setUser({ accessToken: '', id: '', name: '', role: '' });
    setAccessToken('');
  }

  return (
    <Box
      aria-label="Sign In Container"
      className={`${styles.accountContainer} ${styles.hoverContainer}`}
      onClick={handleOpen}
      onMouseEnter={handleOpen}
      onMouseLeave={handleMouseLeave}
    >
      <Typography>
        <span className={styles.caption}>
          {`${t('hello')} ${user.name ? user.name : t('signInText')}`}
        </span>
        <span className={styles.boldBody2}>{t('accountsAndLists')}</span>
      </Typography>
      <ExpandMoreIcon className={styles.dropdownIcon} />
      <Popper
        className={styles.signInPopper}
        open={open}
        anchorEl={anchorEl}
        transition
        sx={{ zIndex: 10000 }}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={100}>
            <Paper elevation={5} className={styles.dropDownPaper}>
              {user.name ? (
                <Box>
                  <Typography>{user.name}</Typography>
                  <Button className={styles.signInButton} onClick={() => {handleSignOut()}}>
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
          </Fade>
        )}
      </Popper>
    </Box>
  );
};
export default SignInDropdown;
