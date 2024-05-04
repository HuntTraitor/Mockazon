import React from 'react';
import { Box, CssBaseline, Divider } from '@mui/material';

import { MyDrawer } from './Drawer';
import { Users } from './Users';
import { MyAppBar } from './AppBar';
import { LoginContext } from '@/contexts/Login';
/**
 * defines the Home page
 * @return {JSX.Element} Home page
 */
export function Home() {
  const loginContext = React.useContext(LoginContext);

  return loginContext.accessToken.length > 0 ? (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <MyDrawer />
      <Box component="main" width={'100%'}>
        <MyAppBar />
        <Divider />
        <Users />
      </Box>
    </Box>
  ) : undefined;
}
