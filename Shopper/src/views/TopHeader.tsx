import { useTranslation } from 'next-i18next';
import React from 'react';
import { Box, Button, Input, Typography } from '@mui/material';
import Image from 'next/image';
import styles from '@/styles/TopHeader.module.css';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import '/node_modules/flag-icons/css/flag-icons.min.css';
import SignInDropdown from '@/views/SignInDropdown';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import LanguageSwitcher from '@/views/LanguageSwitcher';
import Link from 'next/link';
import { useRouter } from 'next/router';

const TopHeader = () => {
  const { t } = useTranslation('topHeader');
  const router = useRouter();

  return (
    <Box className={styles.container}>
      <Box className={`${styles.logo} ${styles.hoverContainer}`}>
        <Link href="/">
          <Image
            aria-label="bar logo"
            width="60"
            height="40"
            src="/mini_mockazon_logo_white.png"
            alt="Logo"
          />
        </Link>
      </Box>
      <Box
        aria-label="address container"
        className={`${styles.addressContainer} ${styles.hoverContainer}`}
      >
        <Typography variant="caption" className={styles.deliveryText}>
          {t('deliveryText')}
        </Typography>
        <Typography
          aria-label="Address"
          variant="body2"
          className={styles.addressText}
          onClick={
            () => console.log('Clicked Address') /* FIXME: Add Address Editor */
          }
        >
          Santa Cruz 95060 {/* FIXME: Dynamic Address */}
        </Typography>
      </Box>
      <Box className={styles.searchContainer}>
        <Button
          aria-label="categories button"
          variant="text"
          className={styles.categoriesButton}
        >
          All
          <ExpandMoreIcon className={styles.dropdownIcon} />
        </Button>
        <Input
          aria-label="search input"
          placeholder={`${t('searchPlaceholder')}`}
          className={`${styles.searchInput} ${styles.searchInputRoot}`}
          disableUnderline
        />
        <Button
          aria-label="search button"
          variant="contained"
          color="warning"
          className={styles.searchButton}
        >
          <SearchIcon />
        </Button>
      </Box>
      <LanguageSwitcher />
      <SignInDropdown />
      <Box
        aria-label="Orders Button"
        className={`${styles.ordersContainer} ${styles.hoverContainer}`}
        onClick={() => {
          router.push('/orders');
        }} // FIXME: Add Orders Page
      >
        <Typography>
          <span className={styles.caption}>{t('returns')}</span>
          <span className={styles.boldBody2}>{t('orders')}</span>
        </Typography>
      </Box>
      <Box
        aria-label="Cart Button"
        className={`${styles.cartContainer} ${styles.hoverContainer}`}
        onClick={() => {
          router.push('/cart');
        }} // FIXME: Add Cart Page
      >
        <ShoppingCartOutlinedIcon />
        {/* FIXME: Cart Number of Items<Typography className={styles.cartCount}>0</Typography>*/}
        <Typography className={styles.cartText} variant="body2">
          {t('cart')}
        </Typography>
      </Box>
    </Box>
  );
};

export default TopHeader;
