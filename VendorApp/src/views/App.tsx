import { Home } from './HomePage/Home';
import { ThemeProvider, createTheme } from '@mui/material';
import { PageProvider } from '../contexts/PageContext';
import { Signup } from './Signup/Index';

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
      {/* <LoginProvider>
        <Signup /> */}
      <PageProvider>
        <Signup />
      </PageProvider>
      {/* </LoginProvider> */}
    </ThemeProvider>
  );
}
