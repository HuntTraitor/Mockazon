import styles from '@/styles/cart.module.css';

import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
} from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { LoggedInContext } from '@/contexts/LoggedInUserContext';
import MockazonMenuDrawer from '@/views/MockazonMenuDrawer';
import getConfig from 'next/config';
import CheckoutButton from '@/views/CheckoutButton';
import Subtotal from '@/views/Subtotal';
import { useRouter } from 'next/router';
const { basePath } = getConfig().publicRuntimeConfig;
import { ReactElement } from 'react';
import Layout from '@/components/Layout';
import { Product, ProductFromFetch } from '../../types';
import AppBackDrop from '@/components/AppBackdrop';

const namespaces = [
  'products',
  'topHeader',
  'common',
  'signInDropdown',
  'cart',
];
export const getServerSideProps: GetServerSideProps = async context => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale ?? 'en', namespaces)),
      locale: context.locale ?? 'en',
    },
  };
};

const Cart = ({ locale }: { locale: string }) => {
  const [products, setProducts] = useState([] as Product[]);
  const { t } = useTranslation(['products', 'cart']);
  const [error, setError] = useState('');
  const [subtotal, setSubtotal] = useState(0.0);
  const { user, accessToken } = useContext(LoggedInContext);
  const router = useRouter();

  // https://chat.openai.com/share/66cd884d-cc95-4e82-8b4f-a4d035f844af
  // https://chat.openai.com/share/86f158f1-110e-4905-ac4a-85ae8282f2c2
  // https://chatgpt.com/share/872a5a3a-b9fa-4b65-aff1-7267086d14ce
  // https://chatgpt.com/share/018e08ea-be97-49b5-a207-a8ade89baf92
  useEffect(() => {
    if (JSON.stringify(user) === '{}') {
      return;
    }
    const query = {
      query: `query GetShoppingCart {
    getShoppingCart {
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
      .then(response => {
        if (!response.ok) {
          throw response;
        }
        return response.json();
      })
      .then(shoppingCartProducts => {
        if (
          shoppingCartProducts.errors &&
          shoppingCartProducts.errors.length > 0
        ) {
          setError(shoppingCartProducts.errors[0].message);
          return;
        }
        const fetchPromises = shoppingCartProducts.data.getShoppingCart.map(
          async (product: ProductFromFetch) => {
            const query = {
              query: `query GetProduct {
              getProduct(productId: "${product.product_id}") {
                id
                vendor_id
                data {
                  brand
                  name
                  rating
                  price
                  deliveryDate
                  image
                }
              }
            }`,
            };
            try {
              const response = await fetch(`${basePath}/api/graphql`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(query),
              });
              if (!response.ok) {
                throw response;
              }
              const productData = await response.json();
              return {
                ...productData,
                quantity: product.data.quantity,
              };
            } catch (err) {
              setError('Could not fetch product');
            }
          }
        );
        Promise.all(fetchPromises)
          .then(productsWithContent => {
            setProducts(productsWithContent);
            const subtotal: number = productsWithContent.reduce(
              (accumulator: number, currentValue: Product) => {
                return (
                  accumulator +
                  (currentValue.data.getProduct.data.price as number) *
                    parseInt(currentValue.quantity)
                );
              },
              0
            );
            // round to two decimal places
            setSubtotal(Math.round(subtotal * 100) / 100);
          })
          .catch(err => {
            console.error('Error fetching shoppingCartProducts:', err);
            setError('Could not fetch shoppingCartProducts');
          });
      })
      .catch(err => {
        console.error('Error fetching shopping cart:', err);
        setError('Could not fetch shopping cart');
      });
  }, [router, user, accessToken]);

  // if(JSON.stringify(user) === '{}') {
  //   return null
  // }

  const handleRemove = (productId: string) => {
    const query = {
      query: `mutation RemoveFromShoppingCart {
    removeFromShoppingCart(productId: "${productId}") {
      product_id
      shopper_id
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
      .then(response => {
        if (!response.ok) {
          throw response;
        }
        return response.json();
      })
      .then(removedProduct => {
        if (removedProduct.errors && removedProduct.errors.length > 0) {
          setError(removedProduct.errors[0].message);
          return;
        }
        const listsOfProductsToKeep = products.filter(
          product => product.data.getProduct.id !== productId
        );
        setProducts(listsOfProductsToKeep);
        const subtotal: number = products.reduce(
          (accumulator: number, currentValue: Product) => {
            return (
              accumulator + (currentValue.data.getProduct.data.price as number)
            );
          },
          0
        );
        setSubtotal(subtotal);
      })
      .catch(err => {
        console.error('Error removing product:', err);
        setError('Could not remove product');
      });
  };

  return (
    <>
      {error && <p>{error}</p>}
      <Container className={styles.container}>
        <Grid container spacing={10}>
          <Grid id={'cart'} className={styles.topDivider} item xs={12} md={8}>
            <Typography
              className={`${styles.heading} ${styles.h1}`}
              variant="h1"
            >
              {t('cart:title')}
            </Typography>
            {products.map((product, index) => (
              <Card
                className={styles.card}
                key={product.id + '_index_' + index}
                variant={'outlined'}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.data.getProduct.data.image}
                  alt={product.data.getProduct.data.name}
                  className={styles.productImage}
                  width={'180px'}
                  height={'180px'}
                />
                <CardContent style={{ flex: 1 }}>
                  <Link
                    aria-label={`product-link-${product.id}`}
                    className={styles.productLink}
                    href={`/products/${product.data.getProduct.id}`}
                  >
                    <Typography
                      variant="h6"
                      component="h2"
                      className={styles.productBrand}
                    >
                      {product.data.getProduct.data.brand}
                    </Typography>
                  </Link>
                  <Typography variant="h6" component="h2">
                    {product.data.getProduct.data.name}
                  </Typography>
                  <Typography
                    aria-label={`rating is ${product.data.getProduct.data.rating}`}
                    variant="subtitle1"
                    component="p"
                  >
                    {t('products:rating')}:{' '}
                    {product.data.getProduct.data.rating}
                  </Typography>
                  <Typography
                    aria-label={`price is ${product.data.getProduct.data.price}`}
                    variant="subtitle1"
                    component="p"
                  >
                    {t('products:price')}: ${product.data.getProduct.data.price}
                  </Typography>
                  <Typography
                    aria-label={`deliveryDate is ${product.data.getProduct.data.deliveryDate}`}
                    variant="subtitle1"
                    component="p"
                  >
                    {t('products:deliveryDate')}:{' '}
                    {new Intl.DateTimeFormat('en-US', {
                      weekday: 'long',
                      month: 'short',
                      day: 'numeric',
                    }).format(
                      new Date(
                        product.data.getProduct.data.deliveryDate as string
                      )
                    )}
                  </Typography>
                  <Typography
                    aria-label={`quantity is ${product.quantity}`}
                    variant="subtitle1"
                    component="p"
                  >
                    {t('products:quantity')}: {product.quantity}
                  </Typography>
                  <Link
                    aria-label={`add-shopping-cart-${product.id}`}
                    className={styles.deleteLink}
                    href={`/cart`}
                  >
                    <Typography
                      component="p"
                      className={styles.removeText}
                      onClick={() => handleRemove(product.data.getProduct.id)}
                    >
                      {t('cart:remove')}
                    </Typography>
                  </Link>
                </CardContent>
              </Card>
            ))}
            <Subtotal numberOfProducts={products.length} subtotal={subtotal} />
          </Grid>
          <Grid
            id={'buyItNow'}
            className={styles.topDivider}
            item
            xs={12}
            md={4}
          >
            <Box className={styles.checkoutBox}>
              <CheckoutButton
                subtotal={subtotal}
                productsWithContent={products}
                shopperId={user.id}
                locale={locale}
              />
            </Box>
            <Box className={styles.buyAgainBox}>
              {/*<Typography variant="h6">Buy It Again</Typography>*/}
              {}
            </Box>
          </Grid>
        </Grid>
      </Container>
      <MockazonMenuDrawer />
      <AppBackDrop />
    </>
  );
};

Cart.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

export default Cart;
