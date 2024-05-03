import React from 'react';
import { Box, CssBaseline, Divider } from '@mui/material';

import { MyDrawer } from './Drawer';
import { Users } from './Users';
import { MyAppBar } from './AppBar';

/**
 * defines the Home page
 * @return {JSX.Element} Home page
 */
export function Home() {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <MyDrawer />
      <Box component="main" width={'100%'}>
        <MyAppBar />
        <Divider />
        <Users />
      </Box>
    </Box>
  );
}
