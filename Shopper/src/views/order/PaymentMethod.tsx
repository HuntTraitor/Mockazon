import React from 'react';
import { Typography, Box, useMediaQuery, useTheme } from '@mui/material';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import styles from '@/styles/OrderView.module.css';

type PaymentMethodProps = {
  method: string;
  digits: number;
  paymentBrand: string;
};

const cardIcons = {
  Mastercard:
    'https://cdn.iconscout.com/icon/free/png-512/free-mastercard-3521564-2944982.png?f=webp&w=256',
  Visa: 'https://cdn.iconscout.com/icon/free/png-512/free-visa-3-226460.png?f=webp&w=256',
  Amex: 'https://cdn.iconscout.com/icon/free/png-512/free-american-express-6-675747.png?f=webp&w=256',
  Discover:
    'https://cdn.iconscout.com/icon/free/png-512/free-discover-diners-club-credit-card-bank-transaction-44632.png?f=webp&w=256',
  link: 'https://i.imgur.com/G2ha0UD.png',
};

const PaymentMethod: React.FC<PaymentMethodProps> = ({ method, digits, paymentBrand }) => {
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
        {
          method === 'link' ?
            (
              <>
                <Image
                  src={cardIcons[method as keyof typeof cardIcons]}
                  alt={method}
                  style={{ marginRight: '8px' }}
                  width={20}
                  height={20}
                />
                <Typography variant="body2">
                  {method}
                </Typography>
              </>
            )
            :
            (
              <>
                <Image
                  src={cardIcons[paymentBrand as keyof typeof cardIcons]}
                  alt={paymentBrand}
                  style={{ marginRight: '8px' }}
                  width={20}
                  height={20}
                />
                <Typography variant="body2">
                  {method} {t('order:endingIn')} {digits}
                </Typography>
              </>
            )
        }
      </Box>
    </Box>
  );
};

export default PaymentMethod;
