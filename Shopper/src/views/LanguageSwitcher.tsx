import React from 'react';
import { useRouter } from 'next/router';
import { Box, Typography, MenuItem, Radio, Paper } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import styles from '@/styles/LanguageSwitcher.module.css';
import CustomPopper from '@/components/CustomPopper';

const LanguageSwitcher = () => {
  const router = useRouter();
  const currentLocale = router.locale;
  const flagIcon = currentLocale === 'en' ? 'fi fi-us' : 'fi fi-es';
  const languageText = currentLocale === 'en' ? 'EN' : 'ES';

  const handleLocaleChange = (locale: string) => {
    // router.push(router.pathname, router.asPath, { locale });

    window.location.href = `/${locale}${router.asPath}`;
  };

  return (
    <Box
      className={`${styles.languageContainer} ${styles.hoverContainer}`}
      aria-label="Language Container"
    >
      <CustomPopper
        buttonContent={
          <Box aria-label="Language Box" className={styles.languageBox}>
            <Typography
              variant="body2"
              aria-label="Language Text"
              className={styles.languageText}
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <span
                aria-label="flag icon"
                className={flagIcon}
                style={{
                  marginRight: '5px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  marginBottom: '2px',
                }}
              ></span>
              {languageText}
              <ExpandMoreIcon
                className={styles.dropdownIcon}
                sx={{ display: 'inline-flex', alignItems: 'center' }}
              />
            </Typography>
          </Box>
        }
      >
        <Paper elevation={5}>
          <MenuItem onClick={() => handleLocaleChange('en')}>
            <Radio checked={currentLocale === 'en'} />
            <span
              style={{ marginRight: '5px' }}
              className="fi fi-us"
            ></span>{' '}
            English
          </MenuItem>
          <MenuItem onClick={() => handleLocaleChange('es')}>
            <Radio checked={currentLocale === 'es'} />
            <span
              style={{ marginRight: '5px' }}
              className="fi fi-es"
            ></span>{' '}
            Español
          </MenuItem>
        </Paper>
      </CustomPopper>
    </Box>
  );
};

export default LanguageSwitcher;
