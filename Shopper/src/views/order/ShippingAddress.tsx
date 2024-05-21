import React from 'react';
import { Typography, Box } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { ShippingAddress as ShippingAddressType } from '@/graphql/types';
import styles from '@/styles/OrderView.module.css';

type ShippingAddressProps = {
  address: ShippingAddressType;
};

const ShippingAddress: React.FC<ShippingAddressProps> = ({ address }) => {
  const { t } = useTranslation(['order']);

  return (
    <Box>
      <Typography variant="body2" gutterBottom className={styles.address}>
        {t('order:shippingAddress')}
      </Typography>
      <Typography variant="body2">{address.name}</Typography>
      <Typography variant="body2">{address.addressLine1}</Typography>
      <Typography variant="body2">
        {address.city}, {address.state} {address.postalCode}
      </Typography>
      <Typography variant="body2">{address.country}</Typography>
    </Box>
  );
};

export default ShippingAddress;
