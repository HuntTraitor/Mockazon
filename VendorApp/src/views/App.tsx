import { Fragment } from 'react';
import { Home } from './HomePage/Home';
import { LoginProvider } from '@/context/Login';
import {SignupForm} from './Signup/SignupForm'
import { ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#ffDA00',
    },
    secondary: {
      main: '#1976d2',
    },
  },
});


export function App() {
  return (
    <ThemeProvider theme={theme}>
      <LoginProvider>
        <SignupForm />
        {/* <Home /> */}
      </LoginProvider>
    </ThemeProvider>
  );
};
