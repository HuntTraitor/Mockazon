import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { Title } from './Title';
import { SignupForm } from './SignupForm';
import { Copyright } from './Copyright';
import { SnackbarProvider } from 'notistack';
import { LoginForm } from './LoginForm';
import { LoginContext } from '@/contexts/LoginContext';

export interface LoginFormProps {
  navigate: (newValue: number) => void;
}

export function Signup() {
  const [navigate, setNavigate] = React.useState(0);
  const loginContext = React.useContext(LoginContext);
  if (loginContext.accessToken.length < 1) {
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
            {navigate === 0 && <SignupForm navigate={setNavigate} />}
            {navigate === 1 && <LoginForm navigate={setNavigate} />}
          </Box>
          <Copyright sx={{ mt: 5 }} />
        </SnackbarProvider>
      </Container>
    );
  } else {
    return null;
  }
}
