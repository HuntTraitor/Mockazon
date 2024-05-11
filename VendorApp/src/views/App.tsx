import { Fragment } from 'react';
import { Home } from './HomePage/Home';
import { LoginProvider } from '@/context/Login';
import {Signup} from './Signup/Index'
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
        <Signup />
        {/* <Home /> */}
      </LoginProvider>
    </ThemeProvider>
  );
};
