import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import styles from '@/styles/Signup.module.css'
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Mockazon.com
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export function SignupForm() {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
  };

  return (
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
        <div className={styles.title}>
          <img src="/mockazon_logo.png" />
          <Typography component="h1" variant="h5">
            seller central
          </Typography>
        </div>
        <Box sx={{border: 1,  borderRadius: '16px', borderColor: 'grey.500', padding: '20px'}}>
          <Typography component="h1" variant="h5">
            Create account
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <label htmlFor="firstName" className={styles.formLabel}>Your Name</label>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12}>
                <label htmlFor="email" className={styles.formLabel}>Email</label>
                <TextField
                  required
                  fullWidth
                  id="email"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <label htmlFor="firstName" className={styles.formLabel}>Password</label>
                <TextField
                  required
                  fullWidth
                  name="password"
                  type="password"
                  id="password"
                  label="At least 6 characters"
                  autoComplete="new-password"
                />
                <div className={styles.passwordAlert}>
                  <PriorityHighIcon />
                  <Typography sx={{fontStyle: 'italic'}}>Passwords must be at least 6 characters.</Typography>
                </div>
              </Grid>
              <Grid item xs={12}>
                <label htmlFor="firstName" className={styles.formLabel}>Re-enter password</label>
                <TextField
                  required
                  fullWidth
                  name="repeatpassword"
                  type="password"
                  id="repeatpassword"
                  autoComplete="new-password"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Request
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="#" variant="body2" color="secondary">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
      <Copyright sx={{ mt: 5 }} />
    </Container>
  );
}