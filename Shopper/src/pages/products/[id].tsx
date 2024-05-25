import {
  Card,
  Typography,
  Box,
  Divider,
  TextField,
  MenuItem,
} from '@mui/material';
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
  const [quantity, setQuantity] = useState('1');
  const numbers = Array.from({ length: 5 }, (_, index) => index + 1);
  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(event.target.value);
  };
  useEffect(() => {
    const query = {
      query: `query getProduct{getProduct(
        productId: "${id}"
      ) {id data {brand name rating price deliveryDate image description}}}`,
    };

    fetch(`${basePath}/api/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(query),
    })
      .then(response => {
        return response.json();
      })
      .then(product => {
        if (product.errors) {
          console.error('Error fetching product:', product);
          setError('Could not fetch product');
        } else {
          setProduct(product.data.getProduct);
        }
      });
  }, [id]);

  if (product && product.data) {
    return (
      <Box className={styles.centerContainer}>
        <Card
          sx={{ maxWidth: 1500, minWidth: 175 }}
          className={styles.cardWrapper}
        >
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
              <Typography className={styles.productName}>
                {product.data.name}
              </Typography>
              <Typography className={styles.brandName}>
                Brand: {product.data.brand}
              </Typography>
              <Divider />
              <div style={{ marginBottom: '10px' }}>
                <Price price={product.data.price.toString()} />
              </div>
              <Divider />
              <Typography className={styles.productDescription}>
                {product.data.description}
              </Typography>
            </Box>
            <Box>
              <div className={styles.checkoutWrapper}>
                <Price price={product.data.price.toString()} />
                <DeliveryText deliveryDate={product.data.deliveryDate} />
                <TextField
                  id="Quantity Selector"
                  select
                  label="Quantity"
                  defaultValue="1"
                  onChange={handleQuantityChange}
                  aria-label="Quantity Selector"
                  data-testid="Quantity Selector"
                >
                  {numbers.map(number => (
                    <MenuItem
                      key={number}
                      value={number}
                      aria-label="Quantity number"
                    >
                      {number}
                    </MenuItem>
                  ))}
                </TextField>
                <AddToCartButton product={product} quantity={quantity} />
                <Box className={styles.checkoutMoreInformation}>
                  <Box>
                    <Typography
                      variant="caption"
                      display="block"
                      className={styles.checkoutMoreInformationCaption}
                    >
                      Ships from
                    </Typography>
                    <Typography
                      variant="caption"
                      display="block"
                      className={styles.checkoutMoreInformationCaption}
                    >
                      Sold by
                    </Typography>
                    <Typography
                      variant="caption"
                      display="block"
                      className={styles.checkoutMoreInformationCaption}
                    >
                      Customer
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" display="block">
                      Mockazon
                    </Typography>
                    <Typography variant="caption" display="block">
                      {product.data.brand}
                    </Typography>
                    <Typography variant="caption" display="block">
                      User
                    </Typography>
                  </Box>
                </Box>
              </div>
            </Box>
          </Box>
        </Card>
        <AppBackDrop />
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
