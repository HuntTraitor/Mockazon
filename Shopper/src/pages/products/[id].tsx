import { Card, Typography, Box, Divider } from '@mui/material';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
// import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
// import { useAppContext } from '@/contexts/AppContext';
import * as React from 'react';
import styles from '@/styles/ProductPage.module.css';
import Image from 'next/image';
import { Product } from '@/graphql/types';
import Price from '@/views/product/Price';
import DeliveryText from '@/views/product/DeliveryText';
import AddToCartButton from '@/views/product/AddToCartButton';
import { ReactElement } from 'react';
import Layout from '@/components/Layout';

// https://chat.openai.com/share/c61c7fd0-a650-42f8-b89f-db88f972d9ed
const ProductPage = () => {
  const router = useRouter();
  const { id } = router.query;
  // const { t } = useTranslation(['products', 'viewProduct']);
  const [product, setProduct] = useState({} as Product);
  const [error, setError] = useState('');
  // const { backDropOpen, setBackDropOpen } = useAppContext();

  // FIXME: Do not fetch to microservice from the browser
  useEffect(() => {
    fetch(
      `http://${process.env.MICROSERVICE_URL || 'localhost'}:3011/api/v0/product/${id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
      .then(response => {
        if (!response.ok) {
          throw response;
        }
        return response.json();
      })
      .then(product => {
        setProduct(product);
        console.log(product);
      })
      .catch(err => {
        console.log('401', err);
        setError('Could not fetch products');
      });
  }, [id]);

  console.log(product);

  if (product && product.data) {
    return (
      <>
        <Card sx={{ minWidth: 275 }}>
          <Box className={styles.wrapper}>
            <Box>
              <Image
                src={product.data.image}
                alt="product image"
                height={400}
                width={400}
              />
            </Box>
            <Box>
              <Typography>{product.data.name}</Typography>
              <Typography>{product.data.brand}</Typography>
              <Divider />
              <Price price={product.data.price.toString()} />
            </Box>
            <Box>
              <div>
                <Price price={product.data.price.toString()} />
                <DeliveryText deliveryDate={product.data.deliveryDate} />
                <AddToCartButton product={product} />
              </div>
            </Box>
          </Box>
        </Card>
      </>
    );
  } else {
    return <div>{error}</div>;
  }
};

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

ProductPage.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

export default ProductPage;
