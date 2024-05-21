import React from 'react';
import { Box, CssBaseline, Divider } from '@mui/material';
import { useRouter } from 'next/router';

import { MyDrawer } from './Drawer';
import { MyAppBar } from './AppBar';
import { LoginContext } from '../../contexts/LoginContext';
import APIKeys from './APIKeys';
import { KeyProvider } from '@/contexts/KeyContext';
import AddAPIKey from './AddAPIKey';
/**
 * defines the Home page
 * @return {JSX.Element} Home page
 */
export function Home() {
  const loginContext = React.useContext(LoginContext);
  const router = useRouter();
  React.useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      loginContext.setAccessToken(token);
      router.push('/');
    } else {
      router.push('/login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loginContext]);

  return loginContext.accessToken.length > 0 ? (
    <KeyProvider>
      <Box sx={{ display: 'flex', overflowY: 'scroll' }}>
        <CssBaseline />
        <MyDrawer />
        <Box component="main" width={'100%'} sx={{ overflowY: 'scroll' }}>
          <MyAppBar />
          <Divider />s
          <APIKeys />
          <AddAPIKey />
        </Box>
      </Box>
    </KeyProvider>
  ) : null;
}
