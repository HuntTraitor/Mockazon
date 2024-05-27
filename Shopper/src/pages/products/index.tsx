import { Container, Grid, Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import TopNav from '@/views/TopNav';
import MockazonMenuDrawer from '@/views/MockazonMenuDrawer';
// import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import getConfig from 'next/config';
import ProductCard from '@/views/product/ProductCard';
import { Product } from '@/graphql/types';
import AppBackDrop from '@/components/AppBackdrop';

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

const Index = () => {
  const [products, setProducts] = useState([] as Product[]);
  const router = useRouter();
  const { vendorId, active, page, pageSize, search, orderBy, descending } =
    router.query;
  // const { t } = useTranslation('products');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vendorId, active, page, pageSize, search, orderBy, descending]);

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
      <>
        <Container style={{ marginTop: '20px', maxWidth: '100%' }}>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={1}>
              {products.map((product, index) => (
                <Grid item key={index}>
                  <ProductCard product={product} />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
        <MockazonMenuDrawer />
        <AppBackDrop />
      </>
    );
  }

  return (
    <>
      {error && <p>{error}</p>}
      <TopNav />
      <Container style={{ marginTop: '20px', maxWidth: '100%' }}>
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
