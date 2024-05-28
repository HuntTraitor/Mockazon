import React from 'react';
import {
  Grid,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (!order) return null;

  const section = (title: string, Component: React.ReactNode) => (
    <Grid item xs={12} md={4} className={styles.section}>
      {isMobile ? (
        <>
          <Typography variant="body1" className={styles.sectionTitle}>
            {title}
          </Typography>
          <Paper elevation={3} className={styles.paper}>
            {Component}
          </Paper>
        </>
      ) : (
        Component
      )}
    </Grid>
  );

  return (
    <>
      <Grid
        container
        spacing={2}
        justifyContent="space-between"
        alignItems="center"
        className={styles.gridContainer}
      >
        <Grid item xs={12}>
          <Typography variant="h4" component="h1" className={styles.header}>
            {t('order:orderDetails')}
          </Typography>
          <Typography variant="body2" className={styles.orderedOn}>
            {t('order:orderedOn')}{' '}
            {new Date(order.createdAt).toLocaleDateString(
              i18n.language === 'en' ? 'en-US' : 'es-US',
              { year: 'numeric', month: 'long', day: 'numeric' }
            )}{' '}
            <span className={styles.separator}>|</span> {t('common:order')}#{' '}
            {order.id}
          </Typography>
        </Grid>
      </Grid>
      <Grid
        container
        spacing={2}
        className={isMobile ? styles.mobileContainer : styles.desktopContainer}
      >
        {isMobile ? (
          <>
            {section(
              t('order:shippingAddress'),
              <ShippingAddress address={order.shippingAddress} />
            )}
            {section(
              t('order:paymentMethod'),
              <PaymentMethod
                method={order.paymentMethod}
                paymentBrand={order.paymentBrand}
                digits={order.paymentDigits}
              />
            )}
            {section(t('order:orderSummary'), <OrderSummary order={order} />)}
          </>
        ) : (
          <Paper elevation={3} className={styles.paperWide}>
            <Grid container spacing={4}>
              {section(
                t('order:shippingAddress'),
                <ShippingAddress address={order.shippingAddress} />
              )}
              {section(
                t('order:paymentMethod'),
                <PaymentMethod
                  paymentBrand={order.paymentBrand}
                  method={order.paymentMethod}
                  digits={order.paymentDigits}
                />
              )}
              {section(t('order:orderSummary'), <OrderSummary order={order} />)}
            </Grid>
          </Paper>
        )}
      </Grid>
    </>
  );
};

export default OrderDetails;
