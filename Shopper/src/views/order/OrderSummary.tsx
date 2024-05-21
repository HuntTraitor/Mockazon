import React from 'react';
import { Typography, Box } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { Order } from '@/graphql/types';
import styles from '@/styles/OrderView.module.css';

type OrderSummaryProps = {
  order: Order;
};

const OrderSummary: React.FC<OrderSummaryProps> = ({ order }) => {
  const { t } = useTranslation(['order']);

  return (
    <Box>
      <Typography variant="body2" gutterBottom className={styles.orderSummary}>
        {t('order:orderSummary')}
      </Typography>
      <Box display="flex" justifyContent="space-between">
        <Typography variant="body2">{t('order:subtotal')}</Typography>
        <Typography variant="body2">${order.subtotal}</Typography>
      </Box>
      <Box display="flex" justifyContent="space-between">
        <Typography variant="body2">{t('order:totalBeforeTax')}</Typography>
        <Typography variant="body2">${order.totalBeforeTax}</Typography>
      </Box>
      <Box display="flex" justifyContent="space-between">
        <Typography variant="body2">{t('order:tax')}</Typography>
        <Typography variant="body2">${order.tax}</Typography>
      </Box>
      <Box display="flex" justifyContent="space-between" mt={1}>
        <Typography variant="body2" className={styles.grandTotal}>{t('grandTotal')}</Typography>
        <Typography variant="body2" className={styles.grandTotal}>${order.total}</Typography>
      </Box>
    </Box>
  );
};

export default OrderSummary;
