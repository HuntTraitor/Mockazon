import { ThemeProvider, createTheme } from '@mui/material';
import { PageProvider } from '../contexts/PageContext';
import { Signup } from './Signup/Index';
import { LoginProvider } from '@/contexts/Login';
import { Home } from './HomePage/Home';

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
        <PageProvider>
          <Signup />
          <Home />
        </PageProvider>
      </LoginProvider>
    </ThemeProvider>
  );
}
