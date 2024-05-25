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
  // FIXME: The deliveryDate field on product needs to just be like "7 days" or some representation of that
  // However that field is not going to be used here. When placing an order, it needs to look at all the 
  // products' deliveryDate (which is again just a number of days) and then get the MAX of them, and 
  // make a timestamp of that into the future, and put it on deliveryTime. This is the time that will
  // show up for delivery on an order.
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
        shipped
        delivered
        deliveryTime
        products {
          id
          vendor_id
          data {
            name
            brand
            image
            price
            rating
            description
            deliveryDate
          }
        }
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
  return order;
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
        // FIXME: This needs to be handled globally, think back on the Authenticated Routes example
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
      <OrderCard order={order}/>
      <AppBackDrop />
    </>
  );
};

export default OrderView;
