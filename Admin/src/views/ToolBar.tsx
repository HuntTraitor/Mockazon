import React from 'react';
import { Box, Toolbar, Button, Avatar } from '@mui/material';

/**
 * defines the AppBar
 * @return {JSX.Element} AppBar
 */
export function MyToolBar() {
  return (
    <Toolbar>
      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => console.log('Sign Out')}
          sx={{ color: 'black', borderColor: 'black' }}
        >
          Sign Out
        </Button>
        <Avatar alt="User Avatar" src="/avatar.png" />
      </Box>
    </Toolbar>
  );
}
