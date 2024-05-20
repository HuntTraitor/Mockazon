import { LoginProvider } from '@/contexts/LoginContext';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
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

/**
 * App
 * @param {any} Component
 * @param {any} pageProps
 * @constructor
 */
export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <LoginProvider>
        <Component {...pageProps} />
      </LoginProvider>
    </ThemeProvider>
  );
}
