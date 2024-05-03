import React from 'react';
import { Box, AppBar, Toolbar, Button, Avatar } from '@mui/material';

/**
 * defines the AppBar
 * @return {JSX.Element} AppBar
 */
export function MyAppBar() {
  return (
    <AppBar
      elevation={0}
      sx={{
        backgroundColor: 'white',
        borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
      }}
    >
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
    </AppBar>
  );
}
