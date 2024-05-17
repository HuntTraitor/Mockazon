import React from 'react';
import { Box, CssBaseline, Divider } from '@mui/material';
import { useRouter } from 'next/router';

import { MyDrawer } from './Drawer';
//import { Users } from './Users';
import { MyAppBar } from './AppBar';
import { LoginContext } from '../../contexts/Login';
import { PageContext } from '../../contexts/PageContext';
// import { AdminRequests } from './AdminRequests';
// import Products from './Products';
import APIKeys from './APIKeys';
/**
 * defines the Home page
 * @return {JSX.Element} Home page
 */
export function Home() {
  const loginContext = React.useContext(LoginContext);
  const router = useRouter();
  React.useEffect(() => {
    const token = localStorage.getItem("accessToken")
    if (token) {
      loginContext.setAccessToken(token);
      router.push('/');
    } else {
      router.push('/login')
    }
  }, [loginContext])
  const pageContext = React.useContext(PageContext);

  if (loginContext.accessToken.length > 0) {
    return (
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <MyDrawer />
        <Box component="main" width={'100%'}>
          <MyAppBar />
          <Divider />
          {/* {pageContext.page === 'Products' ? <Products /> : undefined} */}
          {pageContext.page === 'API Keys' ? <APIKeys /> : undefined}
        </Box>
      </Box>
    );
  } else {
    return null
  }
}
