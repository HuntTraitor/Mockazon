import { Container, Grid, Box, Typography, Pagination } from '@mui/material';
import { useEffect, useState, useContext } from 'react';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import TopNav from '@/views/TopNav';
import MockazonMenuDrawer from '@/views/MockazonMenuDrawer';
import { useRouter } from 'next/router';
import getConfig from 'next/config';
import ProductCard from '@/views/product/MainPageProductCard';
import { Product } from '@/graphql/types';
import AppBackDrop from '@/components/AppBackdrop';
import styles from '@/styles/MainPage.module.css';
import ProductCarousel from '../../views/ProductCarousel';
import { LoggedInContext } from '@/contexts/LoggedInUserContext';

const { basePath } = getConfig().publicRuntimeConfig;

const namespaces = [
  'products',
  'topHeader',
  'subHeader',
  'common',
  'signInDropdown',
  'viewProduct',
];
export const getServerSideProps: GetServerSideProps = async context => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale ?? 'en', namespaces)),
    },
  };
};

const itemsPerPage = 10;

const Index = () => {
  const [products, setProducts] = useState([] as Product[]);
  const [orders, setOrders] = useState([] as Product[]);
  const router = useRouter();
  const { vendorId, active, page, pageSize, search, orderBy, descending } =
    router.query;
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState('');
  const { accessToken } = useContext(LoggedInContext);

  useEffect(() => {
    fetchProducts();
    fetchAllOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vendorId, active, page, pageSize, search, orderBy, descending]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlePageChange = (event: any, value: any) => {
    setCurrentPage(value);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);

  const fetchProducts = () => {
    const variables: { [key: string]: string | boolean | number } = {};

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
        $page: Int,
        $pageSize: Int,
        $search: String,
        $orderBy: String,
        $descending: Boolean
      ) {
        getProducts(
          vendorId: $vendorId,
          active: $active,
          page: $page,
          pageSize: $pageSize,
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
          console.error('Error fetching products:', data.errors);
          setError('Could not fetch products');
          return;
        }
        setProducts(data.data.getProducts);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
        setError('Could not fetch products');
      });
  };

  const fetchAllOrders = () => {
    const query = {
      query: `query getAllOrders {
        getAllOrders {
          id
          products {
            id
            data {
              image
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
        console.log('data:', data);
        setOrders(data.data.getAllOrders);
      })
      .catch(error => {
        console.error('Error:', error);
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
        <Container className={`${styles.content} ${styles.gradientContainer}`}>
          <Box className={styles.title}>
            <h1>Welcome to Mockazon</h1>
            <h2>Where you can find the best deals on the internet</h2>
          </Box>
          <div className={styles.carouselContainer}>
            <ProductCarousel title={`What's New`} products={products} />
            <ProductCarousel title={`Buy Again`} products={orders} />
          </div>
          <Box className={styles.productList}>
            <div className={styles.productlistContent}>
              <Typography
                variant="h6"
                sx={{ fontWeight: 'bold', textAlign: 'center' }}
              >
                {`More Products`}
              </Typography>
              <Grid container spacing={1} justifyContent="center">
                {currentItems
                  .slice()
                  .sort(() => Math.random() - 0.5)
                  .map((product, index) => (
                    <Grid item key={index}>
                      <ProductCard product={product} />
                    </Grid>
                  ))}
              </Grid>
              <Box display="flex" justifyContent="center" marginTop={2}>
                <Pagination
                  count={Math.ceil(products.length / itemsPerPage)}
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
      {error && <p>{error}</p>}
      <TopNav />
      <Container style={{ marginTop: '20px', maxWidth: '75%' }}>
        <Grid container spacing={1}>
          {products.map((product, index) => (
            <Grid item key={index}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      </Container>
      <MockazonMenuDrawer />
      <AppBackDrop />
    </>
  );
};

export default Index;
