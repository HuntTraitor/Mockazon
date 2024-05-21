import React from 'react';
import { Typography, Box, useMediaQuery, useTheme } from '@mui/material';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import styles from '@/styles/OrderView.module.css';

type PaymentMethodProps = {
  method: string;
};

const PaymentMethod: React.FC<PaymentMethodProps> = ({ method }) => {
  const { t } = useTranslation(['order']);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box>
      {!isMobile && (
        <Typography
          variant="body2"
          gutterBottom
          className={styles.paymentMethod}
        >
          {t('order:paymentMethod')}
        </Typography>
      )}
      <Box display="flex" alignItems="center">
        <Image
          src="https://placehold.co/20x20"
          alt="Mastercard"
          style={{ marginRight: '8px' }}
          width={20}
          height={20}
        />
        <Typography variant="body2">{method}</Typography>
      </Box>
    </Box>
  );
};

export default PaymentMethod;
