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

const defaultTheme = createTheme();
const Login = () => {
  const loginContext = React.useContext(LoginContext);
  const [user, setUser] = React.useState({ email: '', password: '' });
  // const [checked, setChecked] = React.useState(false);

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

  const handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget as HTMLFormElement);
    fetch('http://localhost:3010/api/v0/authenticate', {
      method: 'POST',
      body: JSON.stringify({
        email: data.get('email'),
        password: data.get('password'),
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => {
        return res.json();
      })
      .then(json => {
        if (json.errors) {
          alert(`Failed to sign in.`);
        } else {
          // Set context
          loginContext.setId(json.id);
          loginContext.setAccessToken(json.accessToken);
          localStorage.setItem('user', JSON.stringify(json));
        }
      })
      .catch(err => {
        alert(err);
      });
  };
  if (loginContext.accessToken.length < 1) {
    return (
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
              src="/mini_mockazon_logo.png"
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
              >
                Sign In
              </Button>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    );
  } else {
    return undefined;
  }
};
export default Login;
