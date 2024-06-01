import {
  Card,
  Typography,
  Box,
  Divider,
  TextField,
  MenuItem,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
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
import AppBackDrop from '@/components/AppBackdrop';
import { enqueueSnackbar } from 'notistack';

const { basePath } = getConfig().publicRuntimeConfig;

const namespaces = [
  'products',
  'topHeader',
  'subHeader',
  'common',
  'signInDropdown',
  'accountDrawer',
  'viewProduct',
];

export const getServerSideProps: GetServerSideProps = async context => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale ?? 'en', namespaces)),
    },
  };
};

const ProductPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { t } = useTranslation('viewProduct');
  const [product, setProduct] = useState<Product>({} as Product);
  const [quantity, setQuantity] = useState('1');
  const [error, setError] = useState(false);
  const numbers = Array.from({ length: 5 }, (_, index) => index + 1);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(event.target.value);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const query = {
          query: `query getProduct{getProduct(
            productId: "${id}"
          ) {id data {brand name rating price deliveryDate image description}}}`,
        };

        const response = await fetch(`${basePath}/api/graphql`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(query),
        });

        const data = await response.json();

        if (data.errors) {
          enqueueSnackbar(t('errorFetchingProduct'), {
            variant: 'error',
            persist: false,
            autoHideDuration: 3000,
            anchorOrigin: { horizontal: 'center', vertical: 'top' },
          });
          setError(true);
        } else {
          setProduct(data.data.getProduct);
        }
      } catch (error) {
        setError(true);
        enqueueSnackbar(t('errorFetchingProduct'), {
          variant: 'error',
          persist: false,
          autoHideDuration: 3000,
          anchorOrigin: { horizontal: 'center', vertical: 'top' },
        });
      }
    };

    fetchProduct();
  }, [id, t]);

  if (product && product.data) {
    return (
      <Box className={styles.centerContainer}>
        <Card
          className={isMobile ? styles.cardWrapperMobile : styles.cardWrapper}
        >
          <Box className={isMobile ? styles.wrapperMobile : styles.wrapper}>
            <Box
              className={
                isMobile ? styles.productImageMobile : styles.productImage
              }
            >
              <Image
                src={product.data.image}
                alt={t('productImageAlt')}
                layout="fill"
                objectFit="contain"
                priority
              />
            </Box>
            <Box
              className={
                isMobile ? styles.checkoutCenterMobile : styles.checkoutCenter
              }
            >
              <Typography className={styles.productName}>
                {product.data.name}
              </Typography>
              <Typography className={styles.brandName}>
                {t('brand')}: {product.data.brand}
              </Typography>
              {!isMobile && (
                <>
                  <Divider />
                  <div style={{ marginBottom: '10px' }}>
                    <Price price={product.data.price.toString()} />
                  </div>
                  <Divider />
                </>
              )}
              <Typography className={styles.productDescription}>
                {product.data.description}
              </Typography>
            </Box>
            <div
              className={
                isMobile ? styles.checkoutWrapperMobile : styles.checkoutWrapper
              }
            >
              <Price price={product.data.price.toString()} />
              <DeliveryText deliveryDate={product.data.deliveryDate} />
              <TextField
                id="Quantity Selector"
                select
                label={t('quantity')}
                defaultValue="1"
                onChange={handleQuantityChange}
                aria-label={t('quantitySelector') ?? ''}
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
                    {t('shipsFrom')}
                  </Typography>
                  <Typography
                    variant="caption"
                    display="block"
                    className={styles.checkoutMoreInformationCaption}
                  >
                    {t('soldBy')}
                  </Typography>
                  <Typography
                    variant="caption"
                    display="block"
                    className={styles.checkoutMoreInformationCaption}
                  >
                    {t('customer')}
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
        </Card>
        <AppBackDrop />
      </Box>
    );
  } else if (error) {
    return (
      <Box className={styles.centerContainer}>
        <Card className={styles.cardWrapper}>
          <Box className={styles.wrapper}>
            <Typography className={styles.productName}>
              {t('productNotFound')}
            </Typography>
          </Box>
        </Card>
        <AppBackDrop />
      </Box>
    );
  } else {
    return null;
  }
};

ProductPage.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

export default ProductPage;
