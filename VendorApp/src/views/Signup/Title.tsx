import styles from '@/styles/Signup.module.css'
import { Typography } from '@mui/material'

export function Title() {
  return(
    <div className={styles.title}>
      <img src="/mockazon_logo.png" aria-label='mockazon-logo'/>
      <Typography component="h1" variant="h5">
        seller central
      </Typography>
    </div>
  )
}