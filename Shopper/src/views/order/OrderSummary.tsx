import React from 'react';
import { Typography, Box, Grid, useMediaQuery, useTheme } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { Order } from '@/graphql/types';
import styles from '@/styles/OrderView.module.css';

type OrderSummaryProps = {
  order: Order;
};

const OrderSummary: React.FC<OrderSummaryProps> = ({ order }) => {
  const { t } = useTranslation(['order']);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box>
      {!isMobile && (
        <Typography
          variant="body2"
          gutterBottom
          className={styles.orderSummary}
        >
          {t('order:orderSummary')}
        </Typography>
      )}
      <Grid container>
        <Grid item xs={10} md={8}>
          <Typography variant="body2">{t('order:subtotal')}</Typography>
        </Grid>
        <Grid item xs={2} md={4}>
          <Typography align="right" variant="body2">
            ${Number(order.subtotal).toFixed(2)}
          </Typography>
        </Grid>
      </Grid>
      {/* FIXME: Currently we don't have delivery fees so this looks weird (double)
      <Grid container>
        <Grid item xs={10} md={8}>
          <Typography variant="body2">{t('order:totalBeforeTax')}</Typography>
        </Grid>
        <Grid item xs={2} md={4}>
          <Typography align="right" variant="body2">
            ${order.subtotal}
          </Typography>
        </Grid>
      </Grid>
      */}
      <Grid container>
        <Grid item xs={10} md={8}>
          <Typography variant="body2">{t('order:tax')}</Typography>
        </Grid>
        <Grid item xs={2} md={4}>
          <Typography align="right" variant="body2">
            ${Number(order.tax).toFixed(2)}
          </Typography>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={10} md={8}>
          <Typography variant="body2" className={styles.grandTotal}>
            {t('grandTotal')}
          </Typography>
        </Grid>
        <Grid item xs={2} md={4}>
          <Typography
            align="right"
            variant="body2"
            className={styles.grandTotal}
          >
            ${Number(order.total).toFixed(2)}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OrderSummary;
