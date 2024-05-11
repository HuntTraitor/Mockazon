import { Box, Typography, Grid, TextField, Button, Link } from "@mui/material"
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import styles from '@/styles/Signup.module.css'

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
  )
}