import { Button } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import getConfig from 'next/config';
const { basePath } = getConfig().publicRuntimeConfig;
import { LoggedInContext } from '@/contexts/LoggedInUserContext';
import * as React from 'react';
import styles from '@/styles/ProductCard.module.css';
import { Product } from '@/graphql/types';
import { useTranslation } from 'next-i18next';

interface ProductProps {
  product: Product;
  quantity: string;
}

export default function AddToCartButton({ product, quantity }: ProductProps) {
  const { accessToken } = React.useContext(LoggedInContext);
  const { t } = useTranslation('viewProduct');

  const addToShoppingCart = (productId: string) => {
    // console.log(user);
    const query = {
      query: `mutation AddToShoppingCart {
        addToShoppingCart(productId: "${productId}", quantity: "${quantity}") {
          id
          product_id
          shopper_id
          data { 
            quantity
          }
        }
      }`,
    };

    fetch(`${basePath}/api/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(query),
    })
      .then(response => response.json())
      .then(shoppingCart => {
        if (shoppingCart.errors && shoppingCart.errors.length > 0) {
          throw new Error(shoppingCart.errors[0].message);
        }
        enqueueSnackbar(t('productAddedToCart'), {
          variant: 'success',
          persist: false,
          autoHideDuration: 3000,
          anchorOrigin: { horizontal: 'center', vertical: 'top' },
        });
        // console.log(shoppingCart);
      })
      .catch(() => {
        // console.log(err);
        enqueueSnackbar(t('productNotAddedToCart'), {
          variant: 'error',
          persist: false,
          autoHideDuration: 3000,
          anchorOrigin: { horizontal: 'center', vertical: 'top' },
        });
      });
  };

  return (
    <Button
      size="small"
      className={styles.addToCart}
      onClick={() => addToShoppingCart(product.id)}
      aria-label="Add to cart button"
      sx={{ position: 'relative' }}
    >
      {t('addToCart')}
    </Button>
  );
}
