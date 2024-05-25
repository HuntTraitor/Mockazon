import React, { useEffect, useState } from 'react';
import { Container, Backdrop, useMediaQuery, useTheme } from '@mui/material';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useAppContext } from '@/contexts/AppContext';
import TopNav from '@/views/TopNav';
import OrderDetails from '@/views/order/OrderDetails';
import OrderCard from './ordercard';
import styles from '@/styles/OrderView.module.css';
import { Order } from '@/graphql/types';
import getConfig from 'next/config';
const { basePath } = getConfig().publicRuntimeConfig;

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

const fetchOrderById = async (id: string, accessToken: string) => {
  /*
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
  */
  const query = {
    query: `query GetOrder($id: String!) {
      getOrder(id: $id) {
        id
        createdAt
        shippingAddress {
          name
          addressLine1
          city
          state
          postalCode
          country
        }
        paymentMethod
        paymentDigits
        subtotal
        tax
        total
        products
      }
    }`,
    variables: { id },
  };
  const order = await fetch(`${basePath}/api/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(query),
  })
    .then(response => {
      if (!response.ok) {
        throw response;
      }
      return response.json();
    })
    .then(data => {
      console.log('Data:', data);
      if (data.errors) {
        throw data.errors;
      }
      return data.data.getOrder;
    })
    .catch(err => {
      console.error(err);
      return null;
    });
  console.log('Order:', order);

  // FIXME: Loop through order.products (it's the id of each product)
  // fetch each product and add it to the order object
  // then pass each product to the OrderCard list later
  return order;
};

const OrderView: React.FC = () => {
  const { backDropOpen, setBackDropOpen } = useAppContext();
  const router = useRouter();
  const { id } = router.query;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (id) {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user.accessToken) { // FIXME: This needs to be handled globally, think back on the Authenticated Routes example
        window.location.href = '/login';
        return;
      }
      fetchOrderById(id as string, user.accessToken).then(order => {
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
