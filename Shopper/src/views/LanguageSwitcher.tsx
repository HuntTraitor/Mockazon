import React, { useState } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Typography,
  Popper,
  MenuItem,
  Radio,
  PopperProps,
  Paper,
  Fade,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import styles from '@/styles/LanguageSwitcher.module.css';

const LanguageSwitcher = () => {
  const router = useRouter();
  const currentLocale = router.locale;
  const flagIcon = currentLocale === 'en' ? 'fi fi-us' : 'fi fi-es';
  const languageText = currentLocale === 'en' ? 'EN' : 'ES';
  const [open, setOpen] = useState(false);

  const [anchorEl, setAnchorEl] = React.useState<PopperProps['anchorEl']>(null);
  const [leaveTimeout, setLeaveTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleOpen = (event: React.MouseEvent<HTMLDivElement>) => {
    if (leaveTimeout) {
      clearTimeout(leaveTimeout);
      setLeaveTimeout(null);
    }
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleMouseLeave = () => {
    setLeaveTimeout(
      setTimeout(() => {
        handleClose();
      }, 300)
    );
  };

  const handleLocaleChange = (locale: string) => {
    router.push(router.pathname, router.asPath, { locale }).then(() => {
      handleClose();
    });
  };

  return (
    <Box
      className={`${styles.languageContainer} ${styles.hoverContainer}`}
      onClick={handleOpen}
      onMouseEnter={handleOpen}
      onMouseLeave={handleMouseLeave}
    >
      <Typography
        variant="body2"
        aria-label="language"
        className={styles.languageText}
      >
        <span aria-label="flag icon" className={flagIcon}></span> {languageText}
      </Typography>
      <ExpandMoreIcon className={styles.dropdownIcon} />
      <Popper open={open} anchorEl={anchorEl} transition sx={{ zIndex: 10000 }}>
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={100}>
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
          </Fade>
        )}
      </Popper>
    </Box>
  );
};

export default LanguageSwitcher;
