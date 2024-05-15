import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { Title } from './Title';
import { SignupForm } from './SignupForm';
import { Copyright } from './Copyright';
import { SnackbarProvider, VariantType, useSnackbar } from 'notistack';
import { Button } from '@mui/material';

export function Signup() {
  return (
    <Container component="main" maxWidth="xs">
      <SnackbarProvider maxSnack={1}>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Title />
          <SignupForm/>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </SnackbarProvider>
    </Container>
  );
}
