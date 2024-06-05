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

/*
const card = (
  <React.Fragment>
    <div className={styles.cardHeader}>
      <Grid container spacing={3}>
        <Grid item xs={2}>
          <Typography variant="subtitle2">ORDER PLACED</Typography>
          <Typography variant="body2">{mockOrder.purchased}</Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography variant="subtitle2">TOTAL</Typography>
          <Typography variant="body2">${mockOrder.total}</Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography variant="subtitle2">SHIP TO</Typography>
          <Typography variant="body2">
            {mockOrder.shippingAddress.name}
          </Typography>
        </Grid>
        <Grid item xs>
          <Typography variant="subtitle2">
            ORDER # {mockOrder.orderId}
          </Typography>
        </Grid>
      </Grid>
    </div>
    <Divider />
    <CardContent>
      <Typography variant="h5" component="div">
        Delivered {mockOrder.delieveredDate}
      </Typography>
      <Typography variant="body2" sx={{ mt: '1px' }}>
        Your package was left near the front door or porch
      </Typography>
      <div className={styles.content}>
        <div className={styles.contentWrapper}>
          <div>
            <Image
              src="https://m.media-amazon.com/images/I/51B4RTFxcKL._SS142_.jpg"
              alt="product-image"
              width={100}
              height={100}
            />
          </div>
          <div className={styles.contentDetails}>
            <Link underline="hover">{mockOrder.productName}</Link>
            <Typography variant="body2">
              Return or replace items: Eligible through June 5, 2024
            </Typography>
            <div className={styles.purchaseButtons}>
              <Button variant="contained" className={styles.buyAgainIcon}>
                <StorefrontIcon sx={{ mr: '5px' }} />
                Buy it again
              </Button>
              <Button variant="contained" className={styles.buttonStyle}>
                View your item
              </Button>
            </div>
          </div>
        </div>
        <div className={styles.contentButtons}>
          <div className={styles.buttonList}>
            <Button variant="contained" className={styles.buttonStyle}>
              Track package
            </Button>
            <Button variant="contained" className={styles.buttonStyle}>
              Return or replace items
            </Button>
            <Button variant="contained" className={styles.buttonStyle}>
              Share gift recipt
            </Button>
            <Button variant="contained" className={styles.buttonStyle}>
              Write a product review
            </Button>
          </div>
        </div>
      </div>
    </CardContent>
    <Divider />
    <CardActions>
      <Button size="small" className={styles.archive}>
        Archive order
      </Button>
    </CardActions>
  </React.Fragment>
);
*/

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
        <div className={styles.cardHeader}>
          <div style={{ paddingLeft: '15px' }}>
            <Typography variant="subtitle2">ORDER PLACED</Typography>
            <Typography variant="body2">{epicDate(order.createdAt)}</Typography>
          </div>
          <div>
            <Typography variant="subtitle2">TOTAL</Typography>
            <Typography variant="body2">
              ${Number(order.total).toFixed(2)}
            </Typography>
          </div>
          <div>
            <Typography variant="subtitle2">SHIP TO</Typography>
            <Typography variant="body2">
              {order.shippingAddress.name}
            </Typography>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant="subtitle2">ORDER # {order.id}</Typography>
            <Link className={styles.viewOrderLink} href={`/orders/${order.id}`}>
              View order details
            </Link>
          </div>
        </div>
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
