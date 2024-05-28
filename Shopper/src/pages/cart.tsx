import styles from '@/styles/cart.module.css';

import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CardActionArea,
  Divider,
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
import { enqueueSnackbar } from 'notistack';
import Image from 'next/image';

const namespaces = [
  'products',
  'topHeader',
  'common',
  'signInDropdown',
  'cart',
  'viewProduct',
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
          enqueueSnackbar(t('cart:errorFetchingProducts'), {
            variant: 'error',
            persist: false,
            autoHideDuration: 3000,
            anchorOrigin: { horizontal: 'center', vertical: 'top' },
          });
          //console.error(shoppingCartProducts.errors[0].message);
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
              enqueueSnackbar(t('cart:errorFetchingProducts'), {
                variant: 'error',
                persist: false,
                autoHideDuration: 3000,
                anchorOrigin: { horizontal: 'center', vertical: 'top' },
              });
              //console.error('Error fetching product:', err);
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
            setSubtotal(Math.round(subtotal * 100) / 100);
          })
          .catch(() => {
            enqueueSnackbar(t('cart:errorFetchingProducts'), {
              variant: 'error',
              persist: false,
              autoHideDuration: 3000,
              anchorOrigin: { horizontal: 'center', vertical: 'top' },
            });
            //console.error('Error fetching shoppingCartProducts:', err);
          });
      })
      .catch(() => {
        enqueueSnackbar(t('cart:errorFetchingProducts'), {
          variant: 'error',
          persist: false,
          autoHideDuration: 3000,
          anchorOrigin: { horizontal: 'center', vertical: 'top' },
        });
        //console.error('Error fetching shopping cart:', err);
      });
  }, [router, user, accessToken, t]);

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
          //console.error(removedProduct.errors[0].message);
          enqueueSnackbar(t('cart:errorRemovingProduct'), {
            variant: 'error',
            persist: false,
            autoHideDuration: 3000,
            anchorOrigin: { horizontal: 'center', vertical: 'top' },
          });
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
      .catch(() => {
        //console.error('Error removing product:', err);
        enqueueSnackbar(t('cart:errorRemovingProduct'), {
          variant: 'error',
          persist: false,
          autoHideDuration: 3000,
          anchorOrigin: { horizontal: 'center', vertical: 'top' },
        });
      });
  };

  const handleQuantityChange = (productId: string, quantity: string) => {
    const query = {
      query: `mutation UpdateCart {
        updateShoppingCart(
          productId: "${productId}"
          quantity: "${quantity}"
        ) {
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
      .then(updatedCart => {
        if (updatedCart.errors && updatedCart.errors.length > 0) {
          //console.error(updatedCart.errors[0].message);
          enqueueSnackbar(t('cart:errorUpdatingQuantity'), {
            variant: 'error',
            persist: false,
            autoHideDuration: 3000,
            anchorOrigin: { horizontal: 'center', vertical: 'top' },
          });
          return;
        }
        // Update the local state with the updated quantity
        const updatedProducts = products.map(product => {
          if (product.data.getProduct.id === productId) {
            return {
              ...product,
              quantity: quantity,
            };
          }
          return product;
        });
        setProducts(updatedProducts);
      })
      .catch(() => {
        //console.error('Error updating quantity:', err);
        enqueueSnackbar(t('cart:errorUpdatingQuantity'), {
          variant: 'error',
          persist: false,
          autoHideDuration: 3000,
          anchorOrigin: { horizontal: 'center', vertical: 'top' },
        });
      });
  };

  return (
    <div className={styles.exterior}>
      <Container className={styles.container}>
        <Grid container spacing={2}>
          <Grid id={'cart'} className={styles.topDivider} item xs={12} md={9}>
            <div className={styles.cart}>
              <div className={styles.cartHeader}>
                <Typography className={`${styles.h1}`} variant="h1">
                  {t('cart:title')}
                </Typography>
                <div className={styles.priceHeader}>
                  <Typography
                    style={{ fontSize: '0.8rem' }}
                  >{`Price`}</Typography>
                </div>
                <Divider />
              </div>
              {products.map((product, index) => (
                <Box key={product.id + '_index_' + index}>
                  <Card className={styles.card} variant={'outlined'}>
                    <Box className={styles.cardImageBorder}>
                      <Link
                        aria-label={`product-link-${product.id}`}
                        className={styles.productLink}
                        href={`/products/${product.data.getProduct.id}`}
                      >
                        <CardActionArea>
                          <Box className={styles.imageContainer}>
                            <Image
                              style={{ outline: '2px solid #f0eeee' }}
                              src={`${product.data.getProduct.data.image}`}
                              alt="Product image"
                              layout="fill"
                              objectFit="contain"
                            />
                          </Box>
                        </CardActionArea>
                      </Link>
                    </Box>
                    <CardContent sx={{ flex: '1 0 auto' }}>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                          }}
                        >
                          <Link
                            aria-label={`product-link-${product.id}`}
                            className={styles.productLink}
                            href={`/products/${product.data.getProduct.id}`}
                          >
                            <Typography className={styles.productName}>
                              {`${product.data.getProduct.data.brand} ${product.data.getProduct.data.name}`}
                            </Typography>
                          </Link>
                          <Typography
                            style={{ fontSize: '0.8rem' }}
                            aria-label={`deliveryDate is ${product.data.getProduct.data.deliveryDate}`}
                          >
                            {t('FREE delivery')}:{' '}
                            {new Intl.DateTimeFormat('en-US', {
                              weekday: 'long',
                              month: 'short',
                              day: 'numeric',
                            }).format(
                              new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                            )}
                          </Typography>
                          {/* <Typography
                            style={{ fontSize: '0.8rem' }}
                            aria-label={`quantity is ${product.quantity}`}
                          >
                            {t('products:quantity')}: {product.quantity}
                          </Typography> */}
                          <Link
                            aria-label={`add-shopping-cart-${product.id}`}
                            className={styles.deleteLink}
                            href={`/cart`}
                          >
                            <Box className={styles.cardToolbar}>
                              <select
                                className={styles.quantityDropdown}
                                value={product.quantity}
                                onChange={e =>
                                  handleQuantityChange(
                                    product.data.getProduct.id,
                                    e.target.value
                                  )
                                }
                              >
                                {Array.from({ length: 10 }, (_, i) => (
                                  <option key={i + 1} value={`${i + 1}`}>
                                    Qty: {i + 1}
                                  </option>
                                ))}
                              </select>
                              <Divider orientation="vertical" flexItem />
                              <Typography
                                style={{
                                  fontSize: '0.8rem',
                                  marginLeft: '0.5rem',
                                }}
                                className={styles.removeText}
                                onClick={() =>
                                  handleRemove(product.data.getProduct.id)
                                }
                              >
                                {t('cart:Delete')}
                              </Typography>
                            </Box>
                          </Link>
                        </Box>
                        <Box
                          sx={{
                            display: 'flex',
                          }}
                        >
                          <Typography
                            style={{ fontSize: '1.2rem', fontWeight: 'bold' }}
                            aria-label={`price is ${product.data.getProduct.data.price}`}
                          >
                            {`$${Number(product.data.getProduct.data.price).toFixed(2)}`}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                  {<Divider />}
                </Box>
              ))}
              <div className={styles.cartSubtotal}>
                <Subtotal
                  numberOfProducts={products.length}
                  subtotal={subtotal}
                />
              </div>
            </div>
          </Grid>
          <Grid
            id={'buyItNow'}
            className={styles.topDivider}
            item
            xs={12}
            md={3}
          >
            <div>
              <CheckoutButton
                subtotal={subtotal}
                productsWithContent={products}
                shopperId={user.id}
                locale={locale}
              />
            </div>
            <Card className={styles.buyAgainBox}>{}</Card>
          </Grid>
        </Grid>
      </Container>
      <MockazonMenuDrawer />
      <AppBackDrop />
    </div>
  );
};

Cart.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

export default Cart;
