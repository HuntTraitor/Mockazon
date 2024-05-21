import React from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { Order } from '@/graphql/types';
import ShippingAddress from './ShippingAddress';
import PaymentMethod from './PaymentMethod';
import OrderSummary from './OrderSummary';
import styles from '@/styles/OrderView.module.css';

type OrderDetailsProps = {
  order: Order | null;
};

const OrderDetails: React.FC<OrderDetailsProps> = ({ order }) => {
  const { t, i18n } = useTranslation(['order', 'common']);

  if (!order) return null;

  return (
    <>
      <Grid container spacing={2} justifyContent="space-between" alignItems="center" className={styles.gridContainer}>
        <Grid item>
          <Typography variant="h4" component="h1" className={styles.header}>
            {t('order:orderDetails')}
          </Typography>
          <Typography variant="body2" className={styles.orderedOn}>
            {t('order:orderedOn')} {new Date(order.createdAt).toLocaleDateString(
              i18n.language === 'en' ? 'en-US' : 'es-US',
              { year: 'numeric', month: 'long', day: 'numeric' }
            )} | {t('common:order')}# {order.id}
          </Typography>
        </Grid>
      </Grid>
      <Paper elevation={3} className={styles.paper}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <ShippingAddress address={order.shippingAddress} />
          </Grid>
          <Grid item xs={12} md={4}>
            <PaymentMethod method={order.paymentMethod} />
          </Grid>
          <Grid item xs={12} md={4}>
            <OrderSummary order={order} />
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};

export default OrderDetails;
