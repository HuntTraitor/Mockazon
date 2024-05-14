import { useTranslation } from 'next-i18next';
import React from 'react'; // useState,
import {
  Box,
  // Button,
  Typography,
} from '@mui/material';
import styles from '@/styles/SubHeader.module.css';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Menu from '@mui/icons-material/Menu';
import '/node_modules/flag-icons/css/flag-icons.min.css';
// import { useRouter } from 'next/router';

const SubHeader = () => {
  // const [routes, setRoutes] = useState([
  //   { label: 'Medical Care', component: '/medical-care' },
  //   { label: 'Prime Video', component: '/prime-video' },
  //   { label: 'Prime', component: '/prime' },
  // ]);

  const { t } = useTranslation('subHeader');
  // const router = useRouter();

  return (
    <Box className={styles.container}>
      <Box
        aria-label="Toggle All Drawer"
        className={`${styles.subContainer} ${styles.hoverContainer}`}
      >
        <Menu />
        <Typography className={styles.text} variant="body2">
          {t('All')}
        </Typography>
      </Box>
      {/* {routes.map(route => (
        <Box
          key={route.label}
          aria-label={route.label}
          className={`${styles.subContainer} ${styles.hoverContainer}`}
          onClick={() => {
            router.push(route.component);
          }}
        >
          <Typography className={styles.text} variant="body2">
            {t(route.label)}
          </Typography>
        </Box>
      ))} */}
    </Box>
  );
};

export default SubHeader;
