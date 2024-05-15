import { Box, Typography, Grid, TextField, Button, Link } from '@mui/material';
import styles from '@/styles/Signup.module.css';
import { useSnackbar } from 'notistack';
import { LoginFormProps } from './Index';

export function LoginForm({ navigate }: LoginFormProps) {
  const { enqueueSnackbar } = useSnackbar();
  const handleClickSuccess = () => {
    enqueueSnackbar('Successfully requested account!', {
      variant: 'success',
      preventDuplicate: false,
      anchorOrigin: { horizontal: 'center', vertical: 'top' },
    });
  };

  const handleClickError = () => {
    enqueueSnackbar('Oops! Something went wrong, please try again', {
      variant: 'error',
      persist: true,
      anchorOrigin: { horizontal: 'center', vertical: 'top' },
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const query = {
      query: `query signup{signup(
      name: "${data.get('firstName')}"
      email: "${data.get('email')}"
      password: "${data.get('password')}"
    ) {content}}`,
    };

    fetch('/api/graphql', {
      method: 'POST',
      body: JSON.stringify(query),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => {
        return res.json();
      })
      .then(json => {
        if (json.errors) {
          console.log(`${json.errors[0].message}`);
          handleClickError();
        } else {
          handleClickSuccess();
        }
      })
      .catch(e => {
        console.log(e);
        handleClickError();
      });
  };

  return (
    <Box
      sx={{
        border: 1,
        borderRadius: '16px',
        borderColor: 'grey.500',
        padding: '20px',
      }}
    >
      <Typography component="h1" variant="h5">
        Login
      </Typography>
      <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <label htmlFor="email" className={styles.formLabel}>
              Email
            </label>
            <TextField
              required
              fullWidth
              id="email"
              name="email"
              autoComplete="email"
              aria-label="email-input"
            />
          </Grid>
          <Grid item xs={12}>
            <label htmlFor="firstName" className={styles.formLabel}>
              Password
            </label>
            <TextField
              required
              fullWidth
              name="password"
              type="password"
              id="password"
              autoComplete="new-password"
              aria-label="password-input"
            />
          </Grid>
        </Grid>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          aria-label="submit-request"
          className={styles.requestButton}
        >
          Sign in
        </Button>
        <Grid container justifyContent="flex-end">
          <Grid item>
            <Link
              href="#"
              variant="body2"
              color="secondary"
              onClick={() => navigate(0)}
            >
              Request a vendor account
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
