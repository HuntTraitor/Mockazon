import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Autocomplete,
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Image from 'next/image';
import styles from '@/styles/TopHeader.module.css';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import 'flag-icons/css/flag-icons.min.css';
import SignInDropdown from '@/views/SignInDropdown';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import LanguageSwitcher from '@/views/LanguageSwitcher';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import debounce from 'lodash/debounce';
import { useAppContext } from '@/contexts/AppContext';

interface Product {
  data: {
    name: string;
  };
}

const CustomTextField = styled(TextField)(() => ({
  '& .MuiOutlinedInput-root': {
    paddingLeft: '4px',
    height: '40px',
    flexGrow: 1,
    border: 'none',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '5px 0 0 5px',
    backgroundColor: 'white',
    fontSize: '14px',
    '& fieldset': {
      border: 'none',
    },
    '&.Mui-focused fieldset': {
      border: 'none',
    },
  },
  '& .MuiInputBase-input': {
    padding: '8px 12px',
    fontSize: '14px',
  },
  '& .MuiInputBase-input:focus': {
    outline: 'none',
  },
}));

const TopHeader = () => {
  const { t } = useTranslation('topHeader');
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const { setBackDropOpen } = useAppContext();

  const fetchSuggestions = useCallback(
    debounce(async (query: string) => {
      if (!query) {
        setSuggestions([]);
        return;
      }

      const graphqlQuery = {
        query: `query GetProducts($search: String!) {
          getProducts(search: $search) {
            data {
              name
            }
          }
        }`,
        variables: { search: query },
      };

      setLoading(true);
      try {
        const response = await fetch('/api/graphql', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(graphqlQuery),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        if (data.errors && data.errors.length > 0) {
          console.error('Error fetching products:', data.errors);
          return;
        }

        if (data.data.getProducts.length > 0) {
          const filteredSuggestions = data.data.getProducts
            .map((product: Product) => product.data.name)
            .filter((name: string) =>
              name.toLowerCase().startsWith(query.toLowerCase())
            );
          setSuggestions(filteredSuggestions);
          console.log('Suggestions:', filteredSuggestions);
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    fetchSuggestions(search);
  }, [search, fetchSuggestions]);

  const handleFocus = () => {
    setFocused(true);
    setBackDropOpen(true);
  };

  const handleBlur = () => {
    setFocused(false);
    setBackDropOpen(false);
  };

  return (
    <Box className={styles.container}>
      <Box className={styles.topHeaderLeft}>
        <Box className={`${styles.logo} ${styles.hoverContainer}`}>
          <Link href="/">
            <Image
              aria-label="bar logo"
              width="60"
              height="40"
              src="/mini_mockazon_logo_white.png"
              alt="Logo"
            />
            {/* Replace with a new logo */}
          </Link>
        </Box>
        <Box
          aria-label="Address Container"
          className={`${styles.addressContainer} ${styles.hoverContainer}`}
        >
          <PlaceOutlinedIcon className={styles.addressIcon} />
          <Box className={styles.addressTextContainer}>
            <Typography variant="caption" className={styles.deliveryText}>
              {t('topHeader:deliveryText')}
            </Typography>
            <Typography
              aria-label="Address"
              variant="body2"
              className={styles.addressText}
              onClick={() => console.log('Clicked Address')}
            >
              Santa Cruz 95060
              {/* Get location from saved user delivery address information */}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box
        className={`${styles.searchContainer} ${
          focused ? styles.focusedOutline : ''
        }`}
      >
        <Button
          aria-label="Categories Button"
          variant="text"
          className={styles.categoriesButton}
        >
          All
          <ExpandMoreIcon className={styles.dropdownIcon} />
        </Button>
        <Autocomplete
          className={styles.searchInputContainer}
          forcePopupIcon={false}
          options={[search, ...suggestions]}
          getOptionLabel={option => option}
          noOptionsText={''}
          loading={loading}
          renderInput={params => (
            <CustomTextField
              {...params}
              placeholder={t('searchPlaceholder') ?? 'Search'}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loading ? (
                      <CircularProgress color="inherit" size={15} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
              value={search}
              onChange={e => setSearch(e.target.value)}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          )}
          style={{ width: '100%' }}
          classes={{
            paper: styles.suggestionsPaper,
            option: styles.suggestionOption,
          }}
        />
        {/* 
        FIXME fix vertical positioning of the placeholder text 
        */}
        <Button
          aria-label="Search Button"
          variant="contained"
          color="warning"
          className={styles.searchButton}
        >
          <SearchIcon />
        </Button>
      </Box>
      <Box className={styles.topHeaderRight}>
        <LanguageSwitcher />
        <SignInDropdown />
        <Box
          aria-label="Orders Button"
          className={`${styles.ordersContainer} ${styles.hoverContainer}`}
          onClick={() => {
            router.push('/orders');
          }}
        >
          <Typography>
            <span className={styles.caption}>{t('topHeader:returns')}</span>
            <span className={styles.boldBody2}>{t('topHeader:orders')}</span>
          </Typography>
        </Box>
        <Box
          aria-label="Cart Button"
          className={`${styles.cartContainer} ${styles.hoverContainer}`}
          onClick={() => {
            router.push('/cart');
          }}
        >
          <ShoppingCartOutlinedIcon />
          <Typography className={styles.cartText} variant="body2">
            {t('cart')}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default TopHeader;
