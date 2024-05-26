import OrderCard from '../../views/order/OrderCard';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Order } from '@/graphql/types';
import {
  Grid,
  Container,
  Typography,
  Box,
  // TextField,
  // Button,
  // Tabs,
  // Tab,
} from '@mui/material';
import TopNav from '@/views/TopNav';
// import Search from '@mui/icons-material/Search';
import React, { useState, useEffect, useContext, useCallback } from 'react';
import { LoggedInContext } from '@/contexts/LoggedInUserContext';
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

export default function Index() {
  const [Orders, setOrders] = useState([] as Order[]);
  const { accessToken, user } = useContext(LoggedInContext);

  const fetchOrders = useCallback(() => {
    // this could be altered to take arguments for filtering in the future
    const query = {
      query: `query getAllOrders {
        getAllOrders {
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
          shipped
          delivered
          deliveryTime
          products {
            id
            data {
              brand
              name
              rating
              price
              deliveryDate
              image
              description
            }
          }
          total
      }}`,
    };
    fetch(`${basePath}/api/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(query),
    })
      .then(response => response.json())
      .then(data => {
        setOrders(data.data.getAllOrders);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, [accessToken]);

  useEffect(() => {
    if (JSON.stringify(user) === '{}') {
      return;
    }
    fetchOrders();
  }, [accessToken, user, fetchOrders]);

  if (JSON.stringify(user) === '{}') {
    // router.push('/login');
    return null;
  }

  return (
    <>
      <TopNav />
      <Container style={{ marginTop: '20px' }}>
        <Box
          sx={{
            height: '100px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
          }}
        >
          <Typography variant="h4" align="center" style={{ marginTop: '20px' }}>
            Your Orders
          </Typography>
          {/* <Box>
            <TextField
              id="outlined-basic"
              variant="outlined"
              style={{
                width: '300px',
                height: '50px',
              }}
              placeholder='Search all orders'
              InputProps={{
                startAdornment: (
                  <Search style={{ color: 'black', marginRight: '10px' }} />
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-placeholder': { color: 'black' },
              }}
            />
            <Button
              variant="contained"
              color="primary"
              style={{
                height: '50px',
                width: '100px',
                backgroundColor: '#000000',
                color: '#ffffff',
                borderRadius: '10px',
              }}
            >
            Search
            </Button>
          </Box> */}{' '}
          {/* Search bar and button, half-baked maybe feature */}
        </Box>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          {/* <Tabs >
            <Tab label="Orders" sx={{ color: '#007185' }} />
          </Tabs> */}{' '}
          {/* Tabs for filtering types of orders such as delivered or not, buy again, etc... */}
        </Box>
        <Typography
          sx={{
            color: 'black',
            fontSize: '14px',
            fontWeight: '700',
          }}
        >
          {Orders.length} Orders {/* placed in */}
        </Typography>
        {/* Time range selector if doable*/}
        <Grid container spacing={2}>
          {Orders.map(order => (
            <Grid item key={order.id} xs={12}>
              <OrderCard order={order} />{' '}
              {/* pass order as prop or something */}
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}
