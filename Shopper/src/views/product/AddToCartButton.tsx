import { Button } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import getConfig from 'next/config';
const { basePath } = getConfig().publicRuntimeConfig;
import { LoggedInContext } from '@/contexts/LoggedInUserContext';
import * as React from 'react';
import styles from '@/styles/ProductCard.module.css';
import { Product } from '@/graphql/types';

interface ProductProps {
  product: Product;
}

export default function AddToCartButton({ product }: ProductProps) {
  const { user } = React.useContext(LoggedInContext);

  const addToShoppingCart = (productId: string) => {
    console.log(user);
    const query = {
      query: `mutation AddToShoppingCart {
        addToShoppingCart(productId: "${productId}", shopperId: "${user.id}", quantity: "1") {
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(query),
    })
      .then(response => response.json())
      .then(shoppingCart => {
        if (shoppingCart.errors && shoppingCart.errors.length > 0) {
          throw new Error(shoppingCart.errors[0].message);
        }
        enqueueSnackbar('Added to shopping cart', {
          variant: 'success',
          persist: false,
          autoHideDuration: 3000,
          anchorOrigin: { horizontal: 'center', vertical: 'top' },
        });
        console.log(shoppingCart);
      })
      .catch(err => {
        console.log(err);
        enqueueSnackbar('Could not add product to cart', {
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
    >
      Add to cart
    </Button>
  );
}
