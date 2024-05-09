import React from 'react';
import { Box, CssBaseline, Divider } from '@mui/material';

import { MyDrawer } from './Drawer';
import { Users } from './Users';
import { MyAppBar } from './AppBar';
import { LoginContext } from '@/contexts/Login';
import { PageContext } from '@/contexts/PageContext';
import { AdminRequests } from './AdminRequests';

/**
 * defines the Home page
 * @return {JSX.Element} Home page
 */
export function Home() {
  const loginContext = React.useContext(LoginContext);
  const pageContext = React.useContext(PageContext);

  return loginContext.accessToken.length > 0 ? (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <MyDrawer />
      <Box component="main" width={'100%'}>
        <MyAppBar />
        <Divider />
        {pageContext.page === 'Users' ? <Users /> : undefined}
        {pageContext.page === 'Requests' ? <AdminRequests /> : undefined}
      </Box>
    </Box>
  ) : undefined;
}
