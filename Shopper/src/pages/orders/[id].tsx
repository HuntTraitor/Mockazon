import React, { useEffect, useState } from 'react';
import { Container, useMediaQuery, useTheme } from '@mui/material';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import TopNav from '@/views/TopNav';
import OrderDetails from '@/views/order/OrderDetails';
import OrderCard from './ordercard';
import styles from '@/styles/OrderView.module.css';
import { Order } from '@/graphql/types';
import AppBackDrop from '@/components/AppBackdrop';

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

const fetchOrderById = async (id: string) => {
  console.log('Fetching order with id:', id);
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
};

const OrderView: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
  }, [id]);

  if (loading) return <TopNav />;

  return (
    <>
      <TopNav />
      <Container
        maxWidth={isMobile ? 'xs' : 'lg'}
        className={isMobile ? styles.mobileContainer : styles.container}
      >
        <OrderDetails order={order} />
      </Container>
      <OrderCard />
      <AppBackDrop />
    </>
  );
};

export default OrderView;
