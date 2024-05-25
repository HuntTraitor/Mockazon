import { Card, Typography, Box, Divider, Button, TextField, MenuItem } from '@mui/material';
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
import getConfig from 'next/config';
const { basePath } = getConfig().publicRuntimeConfig;


const currencies = [
  {
    value: 'USD',
    label: '$',
  },
  {
    value: 'EUR',
    label: '€',
  },
  {
    value: 'BTC',
    label: '฿',
  },
  {
    value: 'JPY',
    label: '¥',
  },
];

const ProductPage = () => {
  const router = useRouter();
  const { id } = router.query;
  // const { t } = useTranslation(['products', 'viewProduct']);
  const [product, setProduct] = useState({} as Product);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState('1');
  const numbers = Array.from({ length: 5 }, (_, index) => index + 1);
  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(event.target.value)
  }
  console.log(quantity)
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
      <Box className={styles.centerContainer}>
        <Card sx={{maxWidth: 1500, minWidth: 175 }} className={styles.cardWrapper}>
          <Box className={styles.wrapper}>
            <Box className={styles.productImage}>
              <Image
                src={product.data.image}
                alt="product image"
                fill
                priority
              />
            </Box>
            <Box className={styles.checkoutCenter}>
              <Typography className={styles.productName}>{product.data.name}</Typography>
              <Typography className={styles.brandName}>Brand: {product.data.brand}</Typography>
              <Divider />
              <div style={{marginBottom: '10px'}}>
                <Price price={product.data.price.toString()}/>
              </div>
              <Divider />
              <Typography className={styles.productDescription} >🎁【2024 Fathers Day Gifts For Dad】Our glass with funny saying "To Dad from The Reasons You Drink", it's could be as a Father's Day gifts for dad, men, father, grandpa, husband and friend.Whether at home or on birthday party. The glass not just suitable for beer,also wonderful drinking glasses for wine, whiskey, cocktail, soda water,cola and other drinks.</Typography>
            </Box>
            <Box>
              <div className={styles.checkoutWrapper}>
                <Price price={product.data.price.toString()} />
                <DeliveryText deliveryDate={product.data.deliveryDate} />
                <TextField
                  id="outlined-select-currency"
                  select
                  label="Quantity"
                  defaultValue="1"
                  onChange={handleQuantityChange}
                >
                  {numbers.map((number) => (
                    <MenuItem key={number} value={number}>
                      {number}
                    </MenuItem>
                  ))}
                </TextField>
                <AddToCartButton product={product} quantity={quantity}/>
                <Box className={styles.checkoutMoreInformation}>
                  <Box>
                    <Typography variant="caption" display="block" className={styles.checkoutMoreInformationCaption}>Ships from</Typography>
                    <Typography variant="caption" display="block" className={styles.checkoutMoreInformationCaption}>Sold by</Typography>
                    <Typography variant="caption" display="block" className={styles.checkoutMoreInformationCaption}>Customer</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" display="block">Mockazon</Typography>
                    <Typography variant="caption" display="block">{product.data.brand}</Typography>
                    <Typography variant="caption" display="block">User</Typography>
                  </Box>
                </Box>
              </div>
            </Box>
          </Box>
        </Card>
      </Box>
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
