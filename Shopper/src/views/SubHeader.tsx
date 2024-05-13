import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import styles from '@/styles/SubHeader.module.css';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Menu from '@mui/icons-material/Menu';
import '/node_modules/flag-icons/css/flag-icons.min.css';
import LanguageSwitcher from '@/views/LanguageSwitcher';
import Link from 'next/link';
import { useRouter } from 'next/router';

const SubHeader = () => {
  const [routes, setRoutes] = useState([
    { label: 'Medical Care', component: '/medical-care' },
    { label: 'Prime Video', component: '/prime-video' },
    { label: 'Prime', component: '/prime' },
  ]);

  const { t } = useTranslation('subHeader');
  const router = useRouter();

  return <Box className={styles.container}></Box>;
};

export default SubHeader;
