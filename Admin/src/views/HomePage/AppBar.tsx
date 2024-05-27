import React from 'react';
import { Box, AppBar, Toolbar, Button } from '@mui/material';
import { LoginContext } from '@/contexts/Login';

/**
 * defines the AppBar
 * @return {JSX.Element} AppBar
 */
export function MyAppBar() {
  const loginContext = React.useContext(LoginContext);
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
            onClick={event => {
              event.preventDefault();
              console.log('Sign Out');
              localStorage.removeItem('user');
              loginContext.setAccessToken('');
              loginContext.setId('');
            }}
            sx={{ color: 'black', borderColor: 'black' }}
          >
            Sign Out
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
