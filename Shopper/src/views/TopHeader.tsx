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
// import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import 'flag-icons/css/flag-icons.min.css';
import SignInDropdown from '@/views/SignInDropdown';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import LanguageSwitcher from '@/views/LanguageSwitcher';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import debounce from 'lodash/debounce';
import { useAppContext } from '@/contexts/AppContext';
import getConfig from 'next/config';

const { basePath } = getConfig().publicRuntimeConfig;

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
  '& .MuiInputBase-input::placeholder': {
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
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
        const response = await fetch(`${basePath}/api/graphql`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(graphqlQuery),
        });

        if (!response.ok) {
          console.error('Error fetching products:', response.statusText);
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

  const handleSearch = () => {
    const queryParams = new URLSearchParams({
      page: '1',
      pageSize: '20',
      search,
    }).toString();

    router.push(`/products?${queryParams}`);
  };

  const handleSuggestionChange = (
    event: React.ChangeEvent<unknown>,
    value: string | null
  ) => {
    if (value !== null) {
      setSearch(value);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Box className={styles.container}>
      <Box className={styles.topHeaderLeft}>
        <Box className={`${styles.logo} ${styles.hoverContainer}`}>
          <Link href="/">
            <Image
              aria-label="bar logo"
              src={`${basePath}/mockazon_logo_white_transparent.png`}
              width={150}
              height={50}
              alt="Logo"
              priority
            />
            {/* Replace with a new logo */}
          </Link>
        </Box>
        {/* <Box
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
            </Typography>
          </Box>
        </Box> */}
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
              placeholder={t('searchPlaceholder') as string}
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
                onKeyDown: handleKeyDown,
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
          onChange={handleSuggestionChange}
        />
        <Button
          aria-label="Search Button"
          variant="contained"
          color="warning"
          className={styles.searchButton}
          onClick={handleSearch}
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
