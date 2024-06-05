import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useContext,
} from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Popper,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Image from 'next/image';
import styles from '@/styles/TopHeader.module.css';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
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
import { LoggedInContext } from '@/contexts/LoggedInUserContext';

const { basePath } = getConfig().publicRuntimeConfig;

const highlightMatch = (text: string, query: string) => {
  if (!text.toLowerCase().startsWith(query.toLowerCase())) {
    return <span style={{ fontWeight: 'bold' }}>{text}</span>;
  }

  const startIndex = query.length;
  const matchingPart = text.slice(0, startIndex);
  const remainingPart = text.slice(startIndex);

  return (
    <span>
      <span style={{ fontWeight: 'normal' }}>{matchingPart}</span>
      <span style={{ fontWeight: 'bold' }}>{remainingPart}</span>
    </span>
  );
};

const CustomTextField = styled(TextField)(() => ({
  '& .MuiOutlinedInput-root': {
    paddingLeft: '4px',
    height: '40px',
    flexGrow: 1,
    border: 'none',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '5px 5px 5px 5px',
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
    fontWeight: 'bold',
    opacity: 0.6,
  },
  '& .MuiInputBase-input': {
    padding: '8px 12px',
    fontSize: '14px',
    display: 'flex',
    transform: 'translateY(0%)',
  },
  '& .MuiInputBase-input:focus': {
    outline: 'none',
  },
}));

const TopHeader = () => {
  const { t } = useTranslation('topHeader');
  const router = useRouter();
  const initialSearch = router.query.search as string;
  const [search, setSearch] = useState(initialSearch || '');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [focused, setFocused] = useState(false);
  const [suggestionClicked, setSuggestionClicked] = useState(false);
  const [displayedValue, setDisplayedValue] = useState(search);
  const [suggestionIndex, setSuggestionIndex] = useState(-1);
  const { setBackDropOpen, isMobile } = useAppContext();
  const inputRef = useRef<HTMLInputElement>(null); // Reference for the input element
  const { accessToken } = useContext(LoggedInContext);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchSuggestions = useCallback(
    debounce(async (query: string) => {
      if (!query) {
        setSuggestions([]);
        return;
      }

      try {
        const response = await fetch(`${basePath}/api/graphql`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: `{getSearchSuggestions(search: "${query}")}`,
          }),
        });

        if (!response.ok) {
          console.error('Error fetching products:', response.statusText);
        }

        const data = await response.json();
        if (data.errors && data.errors.length > 0) {
          console.error('Error fetching products:', data.errors);
          return;
        }

        if (data.data.getSearchSuggestions.length > 0) {
          setSuggestions(data.data.getSearchSuggestions);
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    }, 300),
    []
  );

  useEffect(() => {
    fetchSuggestions(search);
  }, [search, fetchSuggestions]);

  useEffect(() => {
    if (suggestionClicked) {
      handleSearch();
      setSuggestionClicked(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [suggestionClicked, search]);

  const disableDocumentKeydown = (event: KeyboardEvent) => {
    if (['ArrowUp', 'ArrowDown', 'Tab'].includes(event.key)) {
      event.preventDefault();
    }
  };

  const handleFocus = () => {
    setFocused(true);
    setBackDropOpen(true);

    document.addEventListener('keydown', disableDocumentKeydown);
  };

  const handleBlur = () => {
    setFocused(false);
    setBackDropOpen(false);
    document.removeEventListener('keydown', disableDocumentKeydown);
  };

  const handleSearch = () => {
    const queryParams = new URLSearchParams({
      page: '1',
      pageSize: '20',
      search,
    }).toString();

    router.push(`/products?${queryParams}`);
  };

  const handleSuggestionClick = (option: string) => {
    setSearch(option);
    setDisplayedValue(option);
    setSuggestionClicked(true);
    setSuggestionIndex(-1);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const allSuggestions = [...suggestions, search];
    if (event.key === 'Enter') {
      if (suggestionIndex >= 0) {
        handleSuggestionClick(allSuggestions[suggestionIndex]);
      } else {
        handleSearch();
      }
      if (inputRef.current) {
        inputRef.current.blur();
      }
    } else if (event.key === 'Tab') {
      if (suggestionIndex >= 0) {
        setSearch(allSuggestions[suggestionIndex]);
        setDisplayedValue(allSuggestions[suggestionIndex]);
      }
      if (inputRef.current) {
        inputRef.current.blur();
      }
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      setSuggestionIndex(prevIndex => (prevIndex + 1) % allSuggestions.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setSuggestionIndex(
        prevIndex =>
          (prevIndex - 1 + allSuggestions.length) % allSuggestions.length
      );
    }
  };

  useEffect(() => {
    const allSuggestions = [...suggestions, search];
    if (suggestionIndex >= 0) {
      setDisplayedValue(allSuggestions[suggestionIndex]);
    } else {
      setDisplayedValue(search);
    }
  }, [suggestionIndex, suggestions, search]);

  return (
    <Box
      className={styles.container}
      sx={{
        flexDirection: isMobile ? 'column' : 'row',
        backgroundColor: '#232f3e !important',
      }}
    >
      {isMobile ? (
        <>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <Box className={`${styles.logo}`}>
              <Link href="/">
                <Box
                  sx={{
                    marginTop: '10px',
                    position: 'relative',
                    height: '45px',
                    width: '160px',
                  }}
                >
                  <Image
                    aria-label="bar logo"
                    src={`${basePath}/mockazon_logo_clone(2).png`}
                    alt="Logo"
                    layout="fill"
                    objectFit="contain"
                  />
                </Box>
              </Link>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
              }}
            >
              <SignInDropdown />
              <Box
                aria-label="Cart Button"
                className={`${styles.cartContainer}`}
                onClick={() => {
                  router.push(accessToken ? '/cart' : '/login');
                }}
              >
                <ShoppingCartOutlinedIcon fontSize="large" />
              </Box>
            </Box>
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
          <Box
            className={`${focused ? styles.focusedOutline : ''}`}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '95%',
              mb: '10px',
              position: 'relative',
            }}
          >
            {/* <Button
          aria-label="Categories Button"
          variant="text"
          className={styles.categoriesButton}
          >
          All
          <ExpandMoreIcon className={styles.dropdownIcon} />
        </Button> */}
            <Box sx={{ width: '100%' }}>
              <CustomTextField
                aria-label={t('searchPlaceholder') as string}
                inputRef={inputRef}
                placeholder={t('searchPlaceholder') as string}
                InputProps={{
                  onChange: e => {
                    setSearch(e.target.value);
                    setDisplayedValue(e.target.value);
                    setSuggestionIndex(-1);
                  },
                  onKeyDown: handleKeyDown,
                  endAdornment: (
                    <InputAdornment position="end">
                      {search && (
                        <IconButton
                          onClick={() => {
                            setSearch('');
                            setDisplayedValue('');
                            setSuggestionIndex(-1);
                          }}
                          size="small"
                          aria-label="Clear Search Input"
                          className={styles.clearIndicator}
                        >
                          <ClearIcon sx={{ width: '19px' }} />
                        </IconButton>
                      )}
                      <Button
                        aria-label="Search Button"
                        variant="contained"
                        color="warning"
                        className={styles.searchButton}
                        sx={{
                          borderTopLeftRadius: '10px !important',
                          borderBottomLeftRadius: '10px !important',
                          top: '0px',
                        }}
                        onClick={handleSearch}
                      >
                        <SearchIcon fontSize="large" sx={{ color: 'black' }} />
                      </Button>
                    </InputAdornment>
                  ),
                }}
                value={displayedValue}
                onFocus={handleFocus}
                onBlur={handleBlur}
                sx={{ minWidth: '100%' }}
              />
            </Box>
            <Popper
              open={focused && suggestions.length > 0}
              anchorEl={inputRef.current}
              placement="bottom-start"
              style={{
                width: inputRef.current?.offsetParent?.clientWidth,
                zIndex: 1100,
              }}
              modifiers={[
                {
                  name: 'offset',
                  options: {
                    offset: [0, 4],
                  },
                },
              ]}
            >
              <Paper
                sx={{
                  width: '100%',
                  maxHeight: '50vh',
                  overflow: 'auto',
                }}
              >
                <List>
                  {suggestions.map((option, index) => (
                    <ListItem
                      button
                      key={option}
                      aria-label={option}
                      onMouseDown={() => handleSuggestionClick(option)}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <ListItemIcon>
                        <SearchIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={highlightMatch(option, search)}
                        primaryTypographyProps={{
                          style: {
                            fontWeight:
                              index === suggestionIndex ? 'bold' : 'normal',
                            fontSize: '14px',
                          },
                        }}
                        sx={{
                          marginLeft: '-20px',
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Popper>
          </Box>
        </>
      ) : (
        <>
          <Box className={styles.topHeaderLeft}>
            <Box className={`${styles.logo} ${styles.hoverContainer}`}>
              <Link href="/">
                <Box
                  sx={{
                    position: 'relative',
                    height: '50px',
                    width: '180px',
                  }}
                >
                  <Image
                    aria-label="bar logo"
                    src={`${basePath}/mockazon_logo_clone(2).png`}
                    alt="Logo"
                    layout="fill"
                    objectFit="contain"
                  />
                </Box>
              </Link>
            </Box>
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
          <Box
            className={`${styles.searchContainer} ${
              focused ? styles.focusedOutline : ''
            }`}
            sx={{ position: 'relative' }}
          >
            {/* <Button
          aria-label="Categories Button"
          variant="text"
          className={styles.categoriesButton}
          >
          All
          <ExpandMoreIcon className={styles.dropdownIcon} />
        </Button> */}
            <Box sx={{ width: '100%' }}>
              <CustomTextField
                inputRef={inputRef}
                aria-label={t('searchPlaceholder') as string}
                placeholder={t('searchPlaceholder') as string}
                InputProps={{
                  onChange: e => {
                    setSearch(e.target.value);
                    setDisplayedValue(e.target.value);
                    setSuggestionIndex(-1);
                  },
                  onKeyDown: handleKeyDown,
                  endAdornment: (
                    <InputAdornment position="end">
                      {search && (
                        <IconButton
                          onClick={() => {
                            setSearch('');
                            setDisplayedValue('');
                            setSuggestionIndex(-1);
                          }}
                          size="small"
                          aria-label="Clear Search Input"
                          className={styles.clearIndicator}
                        >
                          <ClearIcon sx={{ width: '19px' }} />
                        </IconButton>
                      )}
                      <Button
                        aria-label="Search Button"
                        variant="contained"
                        color="warning"
                        className={styles.searchButton}
                        sx={{ top: '0px' }}
                        onClick={handleSearch}
                      >
                        <SearchIcon sx={{ color: '#333333' }} />
                      </Button>
                    </InputAdornment>
                  ),
                }}
                value={displayedValue}
                onFocus={handleFocus}
                onBlur={handleBlur}
                sx={{ minWidth: '100%' }}
              />
            </Box>
            <Popper
              open={focused && suggestions.length > 0}
              anchorEl={inputRef.current}
              placement="bottom-start"
              style={{
                width: inputRef.current?.offsetParent?.clientWidth,
                zIndex: 1100,
              }}
              modifiers={[
                {
                  name: 'offset',
                  options: {
                    offset: [0, 4],
                  },
                },
              ]}
            >
              <Paper
                sx={{
                  width: '100%',
                  maxHeight: '60vh',
                  overflow: 'auto',
                }}
              >
                <List>
                  {suggestions.map((option, index) => (
                    <ListItem
                      button
                      key={option}
                      aria-label={option}
                      onMouseDown={() => handleSuggestionClick(option)}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <ListItemIcon>
                        <SearchIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={highlightMatch(option, search)}
                        primaryTypographyProps={{
                          style: {
                            fontWeight:
                              index === suggestionIndex ? 'bold' : 'normal',
                            fontSize: '14px',
                          },
                        }}
                        sx={{
                          marginLeft: '-20px',
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Popper>
          </Box>
          <Box className={styles.topHeaderRight}>
            <LanguageSwitcher />
            <SignInDropdown />
            <Box
              aria-label="Orders Button"
              className={`${styles.ordersContainer} ${styles.hoverContainer}`}
              onClick={() => {
                router.push(accessToken ? '/orders' : '/login');
              }}
              sx={{ display: { xs: 'none', sm: 'block' } }}
            >
              <Typography>
                <span className={styles.caption}>{t('topHeader:returns')}</span>
                <span className={styles.boldBody2}>
                  {t('topHeader:orders')}
                </span>
              </Typography>
            </Box>
            <Box
              aria-label="Cart Button"
              className={`${styles.cartContainer} ${styles.hoverContainer}`}
              onClick={() => {
                router.push(accessToken ? '/cart' : '/login');
              }}
            >
              <ShoppingCartOutlinedIcon />
              <Typography
                className={styles.cartText}
                variant="body2"
                sx={{ display: { xs: 'none', sm: 'block' } }}
              >
                {t('cart')}
              </Typography>
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
};

export default TopHeader;
