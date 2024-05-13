import React, { useState, useContext, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  InputBase,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';
import Switcher from '@/views/Switcher';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import useLoadLocalStorageUser from '@/views/useLoadUserFromLocalStorage';
import { LoggedInContext } from '@/contexts/LoggedInUserContext';

// FIXME remove these when ready
type UUID = string;

type Price = string;

interface ProductProperties {
  [key: string]: string | undefined;
}

interface Product {
  id: UUID;
  vendor_id: UUID;
  data: {
    name: string;
    price: Price;
    properties: ProductProperties;
  };
}

///

const ProductsHeaderBar = () => {
  const { t } = useTranslation('products');
  const { user, setUser, setAccessToken } = useContext(LoggedInContext);
  useLoadLocalStorageUser(setUser, setAccessToken);

  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<Product[]>([]);

  const fetchSuggestions = (query: string): Promise<Product[]> => {
    return new Promise<Product[]>(resolve => {
      setTimeout(() => {
        const sampleProducts: Product[] = [
          {
            id: '1',
            vendor_id: 'v1',
            data: {
              name: 'Apple iPhone 13',
              price: '699.00',
              properties: {
                color: 'blue',
                storage: '128GB',
                size: undefined,
              },
            },
          },
          {
            id: '2',
            vendor_id: 'v1',
            data: {
              name: 'Apple MacBook Pro',
              price: '1299.00',
              properties: {
                color: 'space grey',
                storage: '256GB',
              },
            },
          },
          {
            id: '3',
            vendor_id: 'v1',
            data: {
              name: 'Apple Watch Series 7',
              price: '399.00',
              properties: {
                color: 'red',
                size: '44mm',
              },
            },
          },
        ].filter(product =>
          product.data.name.toLowerCase().includes(query.toLowerCase())
        );
        resolve(sampleProducts);
      }, 300);
    });
  };

  useEffect(() => {
    if (inputValue) {
      fetchSuggestions(inputValue).then(setSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [inputValue]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSuggestionClick = (product: Product) => {
    setInputValue(product.data.name);
    setSuggestions([]);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          aria-label="prime-title"
          variant="h6"
          component="div"
          sx={{ flexGrow: 1 }}
        >
          <Link href="/products">Mockazon Prime</Link>
        </Typography>

        <Typography aria-label="delivery" variant="subtitle1" component="div">
          {`${t('deliver')} ${user.name || 'Sign In'}`}
        </Typography>

        <div
          style={{
            position: 'relative',
            flexGrow: 1,
            backgroundColor: 'white',
            marginLeft: 2,
            marginRight: 2,
          }}
        >
          <InputBase
            placeholder={`${t('search')}`}
            inputProps={{ 'aria-label': 'search' }}
            value={inputValue}
            onChange={handleInputChange}
          />
          {suggestions.length > 0 && (
            <Paper style={{ position: 'absolute', width: '100%' }}>
              <List>
                {/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
                {suggestions.map((product, index) => (
                  <ListItem
                    button
                    key={product.id}
                    onClick={() => handleSuggestionClick(product)}
                  >
                    <ListItemText primary={product.data.name} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}
        </div>

        <Switcher />

        <Typography
          aria-label="greeting"
          sx={{ ml: 2 }}
          variant="subtitle1"
          component="div"
        >
          {user.name ? (
            `${t('greeting')} ${user.name}`
          ) : (
            <>
              {t('greeting')} <Link href="/login">Sign In</Link>
            </>
          )}
          <br />
          {t('accountsAndLists')}
        </Typography>

        <Typography
          aria-label="returns and orders"
          variant="subtitle1"
          component="div"
          sx={{ ml: 2 }}
        >
          {t('returnsAndOrders')}
        </Typography>

        <IconButton
          size="large"
          aria-label="cart"
          color="inherit"
          sx={{ ml: 2 }}
          href="/shoppingCart"
        >
          <ShoppingCart />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default ProductsHeaderBar;
