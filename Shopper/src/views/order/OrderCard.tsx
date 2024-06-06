import React, { useContext } from 'react';
import { Card, Typography, Button, CardMedia, Grid, Box } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { Order, Product } from '@/graphql/types';
import Link from 'next/link';
import getConfig from 'next/config';
const { basePath } = getConfig().publicRuntimeConfig;
import styles from '@/styles/OrderCard.module.css';
import { LoggedInContext } from '@/contexts/LoggedInUserContext';
import { enqueueSnackbar } from 'notistack';
import Paper from '@mui/material/Paper';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useRouter } from 'next/router';

export default function OrderCard({ order }: { order: Order }) {
  // console.log(order);
  const { t, i18n } = useTranslation(['order', 'common']);
  const { accessToken } = useContext(LoggedInContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();

  const formatDate = (date: string, delivered: boolean): string => {
    // FIXME: This needs to be the order status, not just delivered. Find a smart way
    // to do this, instead of a bunch of else if
    return `${delivered ? t('common:delivered') : t('common:arriving')} ${new Date(
      date
    ).toLocaleDateString(i18n.language === 'en' ? 'en-US' : 'es-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })}`;
  };

  const epicDate = (date: string): string => {
    return `${new Date(date).toLocaleDateString(
      i18n.language === 'en' ? 'en-US' : 'es-US',
      {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }
    )}`;
  };

  // FIXME: This function is duplicated, export it to a shared location or something.
  // Check AddToCartButton.tsx
  const addToShoppingCart = (productId: string, quantity: number) => {
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
        enqueueSnackbar(t('addedToCart'), {
          variant: 'success',
          persist: false,
          autoHideDuration: 1000,
          anchorOrigin: { horizontal: 'center', vertical: 'top' },
        });
      })
      .catch(() => {
        // console.log(err);
        enqueueSnackbar(t('errorAddingToCart'), {
          variant: 'error',
          persist: false,
          autoHideDuration: 1000,
          anchorOrigin: { horizontal: 'center', vertical: 'top' },
        });
      });
  };

  return (
    <>
      {isMobile && (
        <Typography variant="body1" className={styles.sectionTitle}>
          {t('order:shipmentDetails')}
        </Typography>
      )}
      <div className={styles.wrapper}>
        <Paper
          elevation={isMobile ? 3 : 0}
          className={isMobile ? styles.mobileCardHeader : styles.cardHeader}
        >
          <div className={isMobile ? styles.mobileDetailsContent : ''}>
            <Typography
              variant="subtitle2"
              className={!isMobile ? styles.capitalize : ''}
            >
              {t('order:orderPlaced')}
            </Typography>
            <Typography variant="body2">{epicDate(order.createdAt)}</Typography>
          </div>
          <div className={isMobile ? styles.mobileDetailsContent : ''}>
            <Typography
              variant="subtitle2"
              className={!isMobile ? styles.capitalize : ''}
            >
              Total
            </Typography>
            <Typography variant="body2">
              ${Number(order.total).toFixed(2)}
            </Typography>
          </div>
          {!isMobile && (
            <div className={isMobile ? styles.mobileDetailsContent : ''}>
              <Typography variant="subtitle2">{t('order:shipTo')}</Typography>
              <Typography variant="body2">
                {order.shippingAddress.name}
              </Typography>
            </div>
          )}
          <div
            className={
              isMobile ? styles.orderNumberMobile : styles.orderNumberWide
            }
          >
            <Typography
              variant="subtitle2"
              className={
                isMobile
                  ? styles.orderNumberFlexMobile
                  : styles.orderNumberFlexWide
              }
            >
              {t('order:orderNumber')}
              <div>{order.id}</div>
            </Typography>
            <Link className={styles.viewOrderLink} href={`/orders/${order.id}`}>
              {t('order:viewOrderDetails')}
            </Link>
          </div>
        </Paper>
        <Paper className={isMobile ? styles.paperMobile : styles.paperWide}>
          <Card variant="outlined" className={styles.card}>
            <Typography
              variant="h6"
              gutterBottom
              className={styles.deliveryStatusText}
            >
              {formatDate(order.deliveryTime, order.delivered)}
            </Typography>
            <Grid
              container
              spacing={2}
              justifyContent="space-between"
              alignItems="center"
              className={styles.gridContainer}
            >
              {order.products.map((product: Product, index) => (
                <Grid item xs={12} key={index} className={styles.productItem}>
                  <Grid container spacing={2} alignItems="flex-start">
                    <Grid item>
                      <CardMedia
                        component="img"
                        image={product.data.image}
                        alt={product.data.name}
                        className={styles.productImage}
                        onClick={() => router.push(`/products/${product.id}`)}
                      />
                    </Grid>
                    <Grid item xs className={styles.productDetails}>
                      <Link
                        href={`/products/${product.id}`}
                        className={styles.productName}
                      >
                        <Typography
                          variant="subtitle1"
                          className={styles.productName}
                        >
                          {product.data.name}
                        </Typography>
                      </Link>
                      {product.data.brand && (
                        <Typography
                          variant="body2"
                          className={styles.productBrand}
                        >
                          {t('order:soldBy')}: {product.data.brand}
                        </Typography>
                      )}
                      <Typography
                        variant="body2"
                        className={styles.productBrand}
                      >
                        {/*products and quantities are in sync*/}
                        {/*each index in product corresponds to an index in quantity*/}
                        {/*FIXME: refactor this if there's time*/}
                        {t('order:quantity')}: {product.quantity}
                      </Typography>
                      <Typography
                        variant="body2"
                        className={styles.productPrice}
                      >
                        Total: $
                        {(
                          Number(product.data.price) * product.quantity
                        ).toFixed(2)}
                      </Typography>
                      <Box className={styles.actionButtons}>
                        <Button
                          className={styles.buyAgain}
                          variant="contained"
                          color="warning"
                          sx={{ mr: 1 }}
                          startIcon={
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src="https://m.media-amazon.com/images/S/sash/7uhR68oBHEcdiIr.png"
                              alt="BuyAgain"
                              className={styles.buyAgainIcon}
                            />
                          }
                          onClick={() => addToShoppingCart(product.id, 1)}
                        >
                          {t('order:buyItAgain')}
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
              ))}
            </Grid>
          </Card>
        </Paper>
      </div>
    </>
  );
}
