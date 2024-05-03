import { useContext, useState } from 'react';
import { Box, Container, Grid, Paper, Typography } from '@mui/material';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { LoggedInContext } from '@/contexts/LoggedInUserContext';

// based this login screen off of lukas's cse 115 project
const Login = () => {
  const [error, setError] = useState('');
  const { accessToken, setAccessToken } = useContext(LoggedInContext);

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse?.credential as string);
      const response = await fetch(`${window.location.origin}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sub: decoded.sub,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', JSON.stringify(data.authenticated));
        setAccessToken(data.authenticated);
      } else {
        console.error('Error logging in:', error);
        setError('Login failed');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setError('Login failed');
    }
  };

  // UI partly referenced from: https://chat.openai.com/share/ee28fc31-d9b8-4193-8cb5-1bb793b8c66d
  return accessToken ? (
    <></>
  ) : (
    <Container maxWidth="sm">
      <Grid
        container
        spacing={2}
        justifyContent="center"
        alignItems="center"
        style={{ minHeight: '70vh' }}
      >
        <Grid item xs={12} textAlign="center">
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome to Mockazon
          </Typography>
        </Grid>
        <Grid item xs={12} textAlign="center">
          <Paper
            elevation={3}
            sx={{
              padding: 4,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Typography variant="h4" gutterBottom>
                Login with Google
              </Typography>
              {error && (
                <Typography variant="body1" color="error">
                  {error}
                </Typography>
              )}
              <GoogleLogin onSuccess={handleSuccess} />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Login;
