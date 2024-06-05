import {
  Container,
  Grid,
  Box,
  Typography,
  Pagination,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useEffect, useState, useContext } from 'react';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import TopNav from '@/views/TopNav';
import MockazonMenuDrawer from '@/views/MockazonMenuDrawer';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import getConfig from 'next/config';
import ProductCard from '@/views/product/MainPageProductCard';
import { Product } from '@/graphql/types';
import AppBackDrop from '@/components/AppBackdrop';
import styles from '@/styles/MainPage.module.css';
import ProductCarousel from '../../views/ProductCarousel';
import { LoggedInContext } from '@/contexts/LoggedInUserContext';
import { enqueueSnackbar } from 'notistack';
import { Order } from '@/graphql/types';
import AccountDrawer from '@/views/AccountDrawer';

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

const Index = () => {
  const [products, setProducts] = useState([] as Product[]);
  const [newProducts, setNewProducts] = useState([] as Product[]);
  const [productCount, setProductCount] = useState(0);
  const [orders, setOrders] = useState([] as Product[]);
  const router = useRouter();
  const { vendorId, active, page, pageSize, search, orderBy, descending } =
    router.query;
  const [currentPage, setCurrentPage] = useState(1);
  const { accessToken, user } = useContext(LoggedInContext);
  const { t } = useTranslation(['products', 'common']);

  useEffect(() => {
    fetchProducts();

    if (JSON.stringify(user) === '{}') {
      return;
    }

    fetchAllOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    vendorId,
    active,
    page,
    pageSize,
    search,
    orderBy,
    descending,
    currentPage,
  ]);

  useEffect(() => {
    fetchProductCount();
    fetchNewProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlePageChange = (event: any, value: any) => {
    setCurrentPage(value);
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const fetchProductCount = () => {
    const query = { query: `query getProductCount {getProductCount}` };
    fetch(`${basePath}/api/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(query),
    })
      .then(response => response.json())
      .then(json => {
        setProductCount(json.data.getProductCount);
      })
      .catch(() => {
        return;
      });
  };

  const fetchNewProducts = () => {
    const variables: { [key: string]: string | boolean | number } = {
      page: 1,
      orderBy: 'posted',
      descending: true,
    };

    if (vendorId) variables.vendorId = vendorId.toString();
    if (active !== undefined) variables.active = active === 'true';
    if (page) variables.page = parseInt(page as string);
    if (pageSize) variables.pageSize = parseInt(pageSize as string);
    if (search) variables.search = search.toString();
    if (orderBy) variables.orderBy = orderBy.toString();
    if (descending !== undefined) variables.descending = descending === 'true';

    const filteredVariables = Object.fromEntries(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(variables).filter(([_, v]) => v !== undefined)
    );

    const query = {
      query: `
      query GetProducts(
        $vendorId: UUID,
        $active: Boolean,
        $search: String,
        $page: Int,
        $orderBy: String,
        $descending: Boolean
      ) {
        getProducts(
          vendorId: $vendorId,
          active: $active,
          page: $page,
          pageSize: 20,
          search: $search,
          orderBy: $orderBy,
          descending: $descending
        ) {
          id
          data {
            brand
            name
            rating
            price
            deliveryDate
            image
          }
        }
      }`,
      variables: filteredVariables,
    };

    fetch(`${basePath}/api/graphql`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(query),
    })
      .then(response => response.json())
      .then(data => {
        if (data.errors && data.errors.length > 0) {
          console.error('Error fetching products');
          // enqueueSnackbar(t('products:errorFetchingProducts'), {
          //   variant: 'error',
          //   persist: false,
          //   autoHideDuration: 3000,
          //   anchorOrigin: { horizontal: 'center', vertical: 'top' },
          // });
          return;
        }
        setNewProducts(data.data.getProducts);
      })
      .catch(() => {
        //console.error('Error fetching products:', error);
        enqueueSnackbar(t('products:errorFetchingProducts'), {
          variant: 'error',
          persist: false,
          autoHideDuration: 3000,
          anchorOrigin: { horizontal: 'center', vertical: 'top' },
        });
      });
  };

  const fetchProducts = () => {
    const variables: { [key: string]: string | boolean | number } = {
      page: currentPage,
    };

    if (vendorId) variables.vendorId = vendorId.toString();
    if (active !== undefined) variables.active = active === 'true';
    if (page) variables.page = parseInt(page as string);
    if (pageSize) variables.pageSize = parseInt(pageSize as string);
    if (search) variables.search = search.toString();
    if (orderBy) variables.orderBy = orderBy.toString();
    if (descending !== undefined) variables.descending = descending === 'true';

    const filteredVariables = Object.fromEntries(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(variables).filter(([_, v]) => v !== undefined)
    );

    const query = {
      query: `
      query GetProducts(
        $vendorId: UUID,
        $active: Boolean,
        $search: String,
        $page: Int,
        $orderBy: String,
        $descending: Boolean
      ) {
        getProducts(
          vendorId: $vendorId,
          active: $active,
          page: $page,
          pageSize: 10,
          search: $search,
          orderBy: $orderBy,
          descending: $descending
        ) {
          id
          data {
            brand
            name
            rating
            price
            deliveryDate
            image
          }
        }
      }`,
      variables: filteredVariables,
    };

    fetch(`${basePath}/api/graphql`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(query),
    })
      .then(response => response.json())
      .then(data => {
        if (data.errors && data.errors.length > 0) {
          //console.error('Error fetching products:', data.errors);
          // enqueueSnackbar(t('products:errorFetchingProducts'), {
          //   variant: 'error',
          //   persist: false,
          //   autoHideDuration: 3000,
          //   anchorOrigin: { horizontal: 'center', vertical: 'top' },
          // });
          return;
        }
        setProducts(data.data.getProducts);
      })
      .catch(() => {
        console.error('Error fetching products');
        // enqueueSnackbar(t('products:errorFetchingProducts'), {
        //   variant: 'error',
        //   persist: false,
        //   autoHideDuration: 3000,
        //   anchorOrigin: { horizontal: 'center', vertical: 'top' },
        // });
      });
  };

  const fetchAllOrders = () => {
    const query = {
      query: `query GetAllOrders {
        getAllOrders {
          products {
            id
            quantity
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
        }
      }`,
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
        if (data.errors && data.errors.length > 0) {
          console.error('Error fetching orders');
          // enqueueSnackbar(t('products:errorFetchingOrders'), {
          //   variant: 'error',
          //   persist: false,
          //   autoHideDuration: 3000,
          //   anchorOrigin: { horizontal: 'center', vertical: 'top' },
          // });
          return;
        }

        const orderProducts = data.data.getAllOrders.flatMap(
          (order: Order) => order.products
        );
        setOrders(orderProducts);
      })
      .catch(() => {
        console.error('Error fetching orders');
        // enqueueSnackbar(t('products:errorFetchingOrders'), {
        //   variant: 'error',
        //   persist: false,
        //   autoHideDuration: 3000,
        //   anchorOrigin: { horizontal: 'center', vertical: 'top' },
        // });
      });
  };

  if (
    !vendorId &&
    !active &&
    !page &&
    !pageSize &&
    !search &&
    !orderBy &&
    !descending
  ) {
    return (
      <div className={styles.exterior}>
        <Container
          className={
            isMobile
              ? `${styles.mobileContent} ${styles.gradientContainer}`
              : `${styles.content} ${styles.gradientContainer}`
          }
        >
          <Box className={isMobile ? styles.titleMobile : styles.title}>
            <h1>{t('common:welcomeToMockazon')}</h1>
            <h2>{t('common:secondaryWelcome')}</h2>
          </Box>
          <div>
            <ProductCarousel
              title={t('products:whatNew')}
              products={newProducts}
              ariaLabel={t('products:whatNew')}
            />
            {orders.length > 0 && (
              <ProductCarousel
                title={t('products:buyAgain')}
                products={orders}
                ariaLabel={t('products:buyAgain')}
              />
            )}
          </div>
          <Box
            className={isMobile ? styles.productListMobile : styles.productList}
          >
            <div className={styles.productlistContent}>
              <Typography
                variant={isMobile ? 'subtitle1' : 'h6'}
                sx={{
                  fontWeight: 'bold',
                  textAlign: isMobile ? 'left' : 'center',
                }}
              >
                {t('products:moreProducts')}
              </Typography>
              <Grid container spacing={1} justifyContent="center">
                {products.slice().map((product, index) => (
                  <Grid item key={index}>
                    <ProductCard
                      ariaLabel={t('products:moreProducts')}
                      product={product}
                    />
                  </Grid>
                ))}
              </Grid>
              <Box display="flex" justifyContent="center" marginTop={2}>
                <Pagination
                  count={Math.ceil(productCount / 10)}
                  page={currentPage}
                  onChange={handlePageChange}
                />
              </Box>
            </div>
          </Box>
        </Container>
        <MockazonMenuDrawer />
        <AppBackDrop />
      </div>
    );
  }

  return (
    <>
      <TopNav />
      <Container sx={{ paddingTop: isMobile ? '3rem' : '' }}>
        <Box
          className={isMobile ? styles.productListMobile : styles.productList}
        >
          <div className={styles.productlistContent}>
            <Typography
              variant={isMobile ? 'subtitle1' : 'h6'}
              sx={{
                fontWeight: 'bold',
                textAlign: isMobile ? 'left' : 'center',
                paddingLeft: isMobile ? '0.5rem' : '',
                paddingBottom: '0.5rem',
              }}
            >
              {t('products:results')}
            </Typography>
            <Grid container spacing={1} justifyContent="center">
              {products.map((product, index) => (
                <Grid item key={index}>
                  <ProductCard
                    ariaLabel={`search-product-${product.data.name}`}
                    product={product}
                  />
                </Grid>
              ))}
            </Grid>
          </div>
        </Box>
      </Container>
      <AccountDrawer />
      <MockazonMenuDrawer />
      <AppBackDrop />
    </>
  );
};

export default Index;
