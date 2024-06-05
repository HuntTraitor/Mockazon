import { Box, Typography, Grid, TextField, Button, Link } from '@mui/material';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import styles from '@/styles/Signup.module.css';
import { useSnackbar } from 'notistack';
import { LoginFormProps } from './Index';
import getConfig from 'next/config';

const { basePath } = getConfig().publicRuntimeConfig;

export function SignupForm({ navigate }: LoginFormProps) {
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

    fetch(`${basePath}/api/graphql`, {
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
          // console.log(`${json.errors[0].message}`);
          handleClickError();
        } else {
          handleClickSuccess();
        }
      })
      .catch(() => {
        // console.log(e);
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
        Create account
      </Typography>
      <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <label htmlFor="firstName" className={styles.formLabel}>
              Your Name
            </label>
            <TextField
              autoComplete="given-name"
              name="firstName"
              required
              fullWidth
              id="firstName"
              autoFocus
              aria-label="name-input"
              role="input"
            />
          </Grid>
          <Grid item xs={12}>
            <label htmlFor="email" className={styles.formLabel}>
              Email
            </label>
            <TextField
              required
              fullWidth
              id="email"
              name="email"
              role="input"
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
              role="input"
              name="password"
              type="password"
              id="password"
              label="At least 6 characters"
              autoComplete="new-password"
              aria-label="password-input"
            />
            <div className={styles.passwordAlert}>
              <PriorityHighIcon />
              <Typography sx={{ fontStyle: 'italic' }}>
                Passwords must be at least 6 characters.
              </Typography>
            </div>
          </Grid>
          <Grid item xs={12}>
            <label htmlFor="firstName" className={styles.formLabel}>
              Re-enter password
            </label>
            <TextField
              required
              fullWidth
              name="repeatpassword"
              type="password"
              id="repeatpassword"
              autoComplete="new-password"
              aria-label="repeatpassword-input"
            />
          </Grid>
        </Grid>
        <Button
          type="submit"
          role="button"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          aria-label="submit-request"
          className={styles.requestButton}
        >
          Request
        </Button>
        <Grid container justifyContent="flex-end">
          <Grid item>
            <Link
              aria-label="login-link"
              role="link"
              href="#"
              variant="body2"
              color="secondary"
              onClick={() => navigate(1)}
            >
              Already have an account? Sign in
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
