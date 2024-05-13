import { Home } from './HomePage/Home';
import { ThemeProvider, createTheme } from '@mui/material';
import { PageProvider } from '../contexts/PageContext';

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
        <Home />
      </PageProvider>
      {/* </LoginProvider> */}
    </ThemeProvider>
  );
}
