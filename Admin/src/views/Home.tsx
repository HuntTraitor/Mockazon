import React from 'react';
import { Box, CssBaseline, Divider } from '@mui/material';

import { MyDrawer as Drawer } from './Drawer';
import { Users } from './Users';
import { MyToolBar as Toolbar } from './ToolBar';

/**
 * defines the Home page
 * @return {JSX.Element} Home page
 */
export function Home() {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Drawer />
      <Box component="main" width={'100%'}>
        <Toolbar />
        <Divider />
        <Users />
      </Box>
    </Box>
  );
}
