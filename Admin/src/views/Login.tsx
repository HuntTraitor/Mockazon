/*
  Sign-In Code from:
  https://github.com/mui/material-ui/tree/v5.15.11/docs/data/material/getting-started/templates/sign-in
*/
import React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Image from 'next/image';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { LoginContext } from '../contexts/Login';
import getConfig from 'next/config';
import styles from '../styles/Home.module.css';

const { basePath } = getConfig().publicRuntimeConfig;

const defaultTheme = createTheme();
const Login = () => {
  const loginContext = React.useContext(LoginContext);
  const [user, setUser] = React.useState({ email: '', password: '' });

  const handleInputChange = (event: React.SyntheticEvent) => {
    if (event && event.target) {
      event.preventDefault();
      const { value, name } = event.target as HTMLInputElement;
      const u = user;
      if (name === 'email') {
        u.email = value;
      } else {
        u.password = value;
      }
      setUser(u);
    }
  };

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget as HTMLFormElement);
    const email = data.get('email');
    const password = data.get('password');
    const query = {
      query: `query Login {login(email: "${email}", password: "${password}") {name accessToken id}}`,
    };

    fetch(`${basePath}/api/graphql`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(query),
    })
      .then(response => {
        if (response.status == 200) {
          return response.json();
        }
      })
      .then(json => {
        loginContext.setAccessToken(`${json.data.login.accessToken}`);
        loginContext.setId(`${json.data.login.id}`);
        localStorage.setItem('admin', JSON.stringify(json));
      })
      .catch(() => {
        alert('Error logging in. Please try again.');
      });
  };

  return loginContext.accessToken.length < 1 ? (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Image
            src={`${basePath}/mini_mockazon_logo.png`}
            alt="Mockazon Logo"
            width={40}
            height={30}
          />
          <Typography component="h1" variant="h5">
            Mockazon
          </Typography>
          <Box
            component="form"
            onSubmit={event => {
              handleSubmit(event);
            }}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              // required
              fullWidth
              type="email"
              name="email"
              label="Email Address"
              aria-label="Email Address"
              placeholder="Email Address"
              autoFocus
              required
              onChange={event => {
                handleInputChange(event);
              }}
            />
            <TextField
              margin="normal"
              // required
              fullWidth
              type="password"
              name="password"
              label="Password"
              placeholder="Password"
              aria-label="Password"
              required
              onChange={event => {
                handleInputChange(event);
              }}
            />
            <Button
              aria-label="login-button"
              type="submit"
              role="button"
              name="login-button"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              className={styles.signInButton}
            >
              Sign In
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  ) : null;
};
export default Login;
