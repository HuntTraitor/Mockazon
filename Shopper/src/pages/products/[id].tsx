import { Card, Typography, Box, Divider } from '@mui/material';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
// import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import * as React from 'react';
import styles from '@/styles/ProductPage.module.css';
import Image from 'next/image';
import { Product } from '@/graphql/types';
import Price from '@/views/product/Price';
import DeliveryText from '@/views/product/DeliveryText';
import AddToCartButton from '@/views/product/AddToCartButton';
import { ReactElement } from 'react';
import Layout from '@/components/Layout';
import getConfig from 'next/config';
const { basePath } = getConfig().publicRuntimeConfig;
import AppBackDrop from '@/components/AppBackdrop';

const ProductPage = () => {
  const router = useRouter();
  const { id } = router.query;
  // const { t } = useTranslation(['products', 'viewProduct']);
  const [product, setProduct] = useState({} as Product);
  const [error, setError] = useState('');
  useEffect(() => {
    const query = {
      query: `query getProduct{getProduct(
        productId: "${id}"
      ) {id data {brand name rating price deliveryDate image}}}`,
    };

    fetch(`${basePath}/api/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(query),
    })
      .then(response => {
        console.log(response);
        if (!response.ok) {
          throw response;
        }
        return response.json();
      })
      .then(product => {
        setProduct(product.data.getProduct);
      })
      .catch(err => {
        console.error('Error fetching product:', err);
        setError('Could not fetch products');
      });
  }, [id]);

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
                priority
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
        <AppBackDrop />
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
