import styles from '@/styles/Signup.module.css';
import { Typography } from '@mui/material';
import Image from 'next/image';
import getConfig from 'next/config';

const { basePath } = getConfig().publicRuntimeConfig;

export function Title() {
  return (
    <div className={styles.title}>
      <Image
        src={`${basePath}/mockazon_logo.png`}
        alt="mockazon logo"
        aria-label="mockazon-logo"
        width={150}
        height={100}
      />
      <Typography component="h1" variant="h5">
        Seller Central
      </Typography>
    </div>
  );
}
