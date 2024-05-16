import { Box, Typography, Grid, TextField, Button, Link } from '@mui/material';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import styles from '@/styles/Signup.module.css';
// import { useSnackbar } from 'notistack';
import { LoginFormProps } from './Index';

export function SignupForm({ navigate }: LoginFormProps) {
  // const { enqueueSnackbar } = useSnackbar();
  // const handleClickSuccess = () => {
  //   enqueueSnackbar('Successfully requested account!', {
  //     variant: 'success',
  //     preventDuplicate: false,
  //     anchorOrigin: { horizontal: 'center', vertical: 'top' },
  //   });
  // };

  // const handleClickError = () => {
  //   enqueueSnackbar('Oops! Something went wrong, please try again', {
  //     variant: 'error',
  //     persist: true,
  //     anchorOrigin: { horizontal: 'center', vertical: 'top' },
  //   });
  // };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // const data = new FormData(event.currentTarget);
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
