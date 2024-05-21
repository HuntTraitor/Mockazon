import React, { useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Backdrop,
} from '@mui/material';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { Order } from '@/graphql/types';
import { useAppContext } from '@/contexts/AppContext';
import TopNav from '@/views/TopNav';
import styles from '@/styles/OrderView.module.css';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useContext, useState } from 'react';
import { LoggedInContext } from '@/contexts/LoggedInUserContext';
import useLoadLocalStorageUser from '@/views/useLoadUserFromLocalStorage';
import { useRouter } from 'next/router';
import OrderCard from './ordercard';

const namespaces = [
  'products',
  'topHeader',
  'subHeader',
  'common',
  'signInDropdown',
  'order',
];

export const getServerSideProps: GetServerSideProps = async context => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale ?? 'en', namespaces)),
    },
  };
};

// Replace this with your actual data fetching logic
async function fetchOrderById(id: string): Promise<Order> {
  console.log('Fetching order with id:', id);
  // Mocked data for illustration
  return {
    id,
    createdAt: '2024-05-08T00:00:00Z',
    shippingAddress: {
      name: 'Lukas Teixeira Dopcke',
      addressLine1: '114 PEACH TER',
      city: 'SANTA CRUZ',
      state: 'CA',
      postalCode: '95060-3250',
      country: 'United States',
    },
    paymentMethod: 'Mastercard ending in 2541',
    subtotal: 110.99,
    totalBeforeTax: 110.99,
    tax: 10.27,
    total: 121.26,
  };
}

const OrderView: React.FC = () => {
  const { t, i18n } = useTranslation(['order', 'common']);
  const { backDropOpen, setBackDropOpen } = useAppContext();
  const router = useRouter();
  const { id } = router.query;
  const [order, setOrder] = useState<Order>({} as Order);
  const [loading, setLoading] = useState(true);
  const { accessToken, setUser, setAccessToken } = useContext(LoggedInContext);
  useLoadLocalStorageUser(setUser, setAccessToken);

  useEffect(() => {
    if (id) {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user.accessToken) {
        window.location.href = '/login';
        return;
      }
      fetchOrderById(id as string).then(order => {
        setOrder(order);
        setLoading(false);
      });
    }
  }, [id, accessToken]);

  if (loading) {
    // FIXME: Add a loading spinner or something
    return (
      <>
        <TopNav />
      </>
    );
  }

  return (
    <>
      <TopNav />
      <Container maxWidth="lg" className={styles.container}>
        <Grid
          container
          spacing={2}
          justifyContent="space-between"
          alignItems="center"
          className={styles.gridContainer}
        >
          <Grid item>
            <Typography variant="h5" component="h1" className={styles.header}>
              {t('order:orderDetails')}
            </Typography>
          </Grid>
        </Grid>
        <Typography
          variant="body2"
          color="text.secondary"
          className={styles.orderedOn}
        >
          {t('order:orderedOn')}{' '}
          {new Date(order.createdAt).toLocaleDateString(
            i18n.language === 'en' ? 'en-US' : 'es-US',
            { year: 'numeric', month: 'long', day: 'numeric' }
          )}{' '}
          | {t('common:order')}# {order.id}
        </Typography>
        <Paper elevation={3} className={styles.paper}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Box className={styles.address}>
                <Typography variant="h6" gutterBottom>
                  {t('order:shippingAddress')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {order.shippingAddress.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {order.shippingAddress.addressLine1}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                  {order.shippingAddress.postalCode}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {order.shippingAddress.country}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box className={styles.paymentMethod}>
                <Typography variant="h6" gutterBottom>
                  {t('order:paymentMethod')}
                </Typography>
                <Box display="flex" alignItems="center">
                  <Image
                    src="https://placehold.co/20x20"
                    alt="Mastercard"
                    style={{ marginRight: '8px' }}
                    width={20}
                    height={20}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {order.paymentMethod}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box className={styles.orderSummary}>
                <Typography variant="h6" gutterBottom>
                  {t('order:orderSummary')}
                </Typography>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    {t('order:subtotal')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ${order.subtotal}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    {t('order:totalBeforeTax')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ${order.totalBeforeTax}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    {t('order:tax')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ${order.tax}
                  </Typography>
                </Box>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  fontWeight="bold"
                  mt={1}
                >
                  <Typography variant="body1">{t('grandTotal')}</Typography>
                  <Typography variant="body1">${order.total}</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
      <OrderCard />
      <Backdrop
        aria-label={'backdrop'}
        open={backDropOpen}
        className={styles.backdrop}
        onClick={() => setBackDropOpen(false)}
      />
    </>
  );
};

export default OrderView;
