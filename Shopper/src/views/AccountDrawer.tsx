import {
  Drawer,
  List,
  ListItem,
  //   ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Box,
  IconButton,
  Paper,
  Radio,
} from '@mui/material';
import { useAppContext } from '@/contexts/AppContext';
import { useEffect, useContext } from 'react';
import styles from '@/styles/AccountDrawer.module.css';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';
import { LoggedInContext } from '@/contexts/LoggedInUserContext';
import { useRouter } from 'next/router';

const AccountDrawer = () => {
  const { accountDrawerOpen, setAccountDrawerOpen, setBackDropOpen } =
    useAppContext();
  const { t } = useTranslation('accountDrawer');
  const { user, setUser, setAccessToken } = useContext(LoggedInContext);
  const router = useRouter();
  const currentLocale = router.locale;

  const handleLocaleChange = (locale: string) => {
    // router.push(router.pathname, router.asPath, { locale });

    window.location.href = `/${locale}${router.asPath}`;
  };

  const handleSignOut = () => {
    localStorage.removeItem('user');
    setUser({ accessToken: '', id: '', name: '', role: '' });
    setAccessToken('');
    setBackDropOpen(false);
    setAccountDrawerOpen(false);
    router.push('/');
  };

  const handleGoToOrders = () => {
    setAccountDrawerOpen(false);
    router.push('/orders');
  };

  useEffect(() => {
    console.log('AccountDrawer open:', accountDrawerOpen);
  }, [accountDrawerOpen]);

  return (
    <>
      {accountDrawerOpen && (
        <Box
          sx={{
            position: 'fixed',
            top: '3%',
            left: '7%',
            zIndex: theme => theme.zIndex.drawer + 1,
          }}
        >
          <IconButton
            onClick={() => setAccountDrawerOpen(false)}
            aria-label="close drawer"
            sx={{
              color: 'white',
            }}
          >
            <CloseIcon fontSize="large" />
          </IconButton>
        </Box>
      )}
      <Drawer
        anchor="right"
        open={accountDrawerOpen}
        onClose={() => setAccountDrawerOpen(false)}
        variant="temporary"
        sx={{
          '& .MuiDrawer-paper': {
            width: '80%',
            backgroundColor: 'white',
          },
          overflow: 'auto',
        }}
      >
        <List
          sx={{
            paddingTop: '0px',
          }}
        >
          <ListItem className={styles.topBox}>
            <ListItemText sx={{ mt: 6, flex: 'auto', flexDirection: 'column' }}>
              <Typography variant="h5" component="h2" fontWeight={700}>
                {t('hello')}, {user.name?.split(' ')[0]}
              </Typography>
              <Typography variant="h4" component="h3">
                {t('yourAccount')}
              </Typography>
            </ListItemText>
          </ListItem>
          <ListItem>
            <Paper elevation={0} sx={{ width: '100%', padding: 2 }}>
              <Typography
                variant="h5"
                component="h3"
                fontWeight={900}
                sx={{
                  mb: 4,
                }}
              >
                {t('yourOrders')}
              </Typography>
              <Typography
                variant="h6"
                component="h3"
                sx={{
                  mt: 4,
                  mb: 4,
                }}
                onClick={handleGoToOrders}
              >
                {t('trackAndManageYourOrders')}
              </Typography>
            </Paper>
          </ListItem>
          <Divider
            sx={{
              height: '5px',
              backgroundColor: '#d5dbdb',
            }}
          />
          <ListItem>
            <Paper elevation={0} sx={{ width: '100%', padding: 2 }}>
              <Typography
                variant="h5"
                component="h3"
                fontWeight={900}
                sx={{
                  mb: 4,
                }}
              >
                {t('settings')}
              </Typography>
              <Box>
                <Radio
                  checked={currentLocale === 'en'}
                  onClick={() => handleLocaleChange('en')}
                />
                <span
                  style={{ marginRight: '5px' }}
                  className="fi fi-us"
                ></span>{' '}
                English
                <Radio
                  checked={currentLocale === 'es'}
                  onClick={() => handleLocaleChange('es')}
                />
                <span
                  style={{ marginRight: '5px' }}
                  className="fi fi-es"
                ></span>{' '}
                Español
              </Box>
              <Typography
                variant="h6"
                component="h3"
                sx={{
                  mt: 4,
                  mb: 4,
                }}
                onClick={handleSignOut}
              >
                {t('signOut')}
              </Typography>
            </Paper>
          </ListItem>
        </List>
      </Drawer>
    </>
  );
};

export default AccountDrawer;
