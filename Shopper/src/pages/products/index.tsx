import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Backdrop,
} from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import TopNav from '@/views/TopNav';
import MockazonMenuDrawer from '@/views/MockazonMenuDrawer';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import useLoadLocalStorageUser from '@/views/useLoadUserFromLocalStorage';
import { LoggedInContext } from '@/contexts/LoggedInUserContext';
import { useAppContext } from '@/contexts/AppContext';
import { useRouter } from 'next/router';
import getConfig from 'next/config';
import { useSnackbar } from 'notistack';
import Image from 'next/image';

const { basePath } = getConfig().publicRuntimeConfig;

interface Product {
  id: number;
  data: {
    brand?: string;
    name?: string;
    rating?: string;
    price?: number;
    deliveryDate?: string;
    image?: string;
  };
}

const namespaces = [
  'products',
  'topHeader',
  'subHeader',
  'common',
  'signInDropdown',
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
  const { t } = useTranslation('products');
  const [error, setError] = useState('');
  const { user, setUser, setAccessToken } = useContext(LoggedInContext);
  const { backDropOpen, setBackDropOpen } = useAppContext();
  const { enqueueSnackbar } = useSnackbar();
  useLoadLocalStorageUser(setUser, setAccessToken);

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

  const addToShoppingCart = (productId: string) => {
    const query = {
      query: `mutation AddToShoppingCart {
        addToShoppingCart(productId: "${productId}", shopperId: "${user.id}", quantity: "1") {
          id
          product_id
          shopper_id
          data { 
            quantity
          }
        }
      }`,
    };

    fetch(`${basePath}/api/graphql`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(query),
    })
      .then(response => response.json())
      .then(shoppingCart => {
        if (shoppingCart.errors && shoppingCart.errors.length > 0) {
          throw new Error(shoppingCart.errors[0].message);
        }
        enqueueSnackbar('Added to shopping cart', {
          variant: 'success',
          persist: false,
          autoHideDuration: 3000,
          anchorOrigin: { horizontal: 'center', vertical: 'top' },
        });
        console.log(shoppingCart);
      })
      .catch(err => {
        console.log(err);
        enqueueSnackbar('Could not add product to cart', {
          variant: 'error',
          persist: false,
          autoHideDuration: 3000,
          anchorOrigin: { horizontal: 'center', vertical: 'top' },
        });
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
        <TopNav />
        <Container style={{ marginTop: '20px' }}>
          <Typography variant="h4" align="center" style={{ color: 'blue' }}>
            Welcome to the Homepage
          </Typography>
          {/* FIXME Add more homepage content here */}
        </Container>
        <MockazonMenuDrawer />
        <Backdrop
          aria-label={'backdrop'}
          open={backDropOpen}
          style={{ zIndex: 1, position: 'fixed' }}
          onClick={() => setBackDropOpen(false)}
        />
      </>
    );
  }

  return (
    <>
      {error && <p>{error}</p>}
      <TopNav />
      <Container style={{ marginTop: '20px' }}>
        <Typography style={{ color: 'blue' }} variant="h4" align="center">
          Products
        </Typography>
        <Grid container spacing={3}>
          {products.length > 0 ? (
            products.map(
              product =>
                product.data && (
                  <Grid item key={product.id} xs={12}>
                    <Card style={{ display: 'flex' }}>
                      <Image
                        src={product.data.image || '/no-image.png'}
                        alt={product.data.name || 'No Image'}
                        width={200}
                        height={200}
                        objectFit="cover"
                      />
                      <CardContent style={{ flex: 1 }}>
                        <Link
                          aria-label={`product-link-${product.id}`}
                          style={{ color: 'blue' }}
                          href={`/products/${product.id}`}
                        >
                          <Typography
                            variant="h6"
                            component="h2"
                            style={{ fontWeight: 'bold' }}
                          >
                            {product.data.brand}
                          </Typography>
                        </Link>
                        <Typography variant="h6" component="h2">
                          {product.data.name}
                        </Typography>
                        <Typography
                          aria-label={`rating is ${product.data.rating}`}
                          variant="subtitle1"
                          component="p"
                        >
                          {t('rating')}: {product.data.rating}
                        </Typography>
                        <Typography
                          aria-label={`price is ${product.data.price}`}
                          variant="subtitle1"
                          component="p"
                        >
                          {t('price')}: ${product.data.price}
                        </Typography>
                        <Typography
                          aria-label={`deliveryDate is ${product.data.deliveryDate}`}
                          variant="subtitle1"
                          component="p"
                        >
                          {t('deliveryDate')}: {product.data.deliveryDate}
                        </Typography>
                        <Link
                          aria-label={`add-shopping-cart-${product.id}`}
                          style={{ color: 'blue' }}
                          href={`/`}
                          onClick={() => addToShoppingCart(`${product.id}`)}
                        >
                          <Typography
                            component="p"
                            style={{ fontWeight: 'bold' }}
                          >
                            Add to Shopping Cart
                          </Typography>
                        </Link>
                      </CardContent>
                    </Card>
                  </Grid>
                )
            )
          ) : (
            <Typography variant="h6" align="center">
              No products found
            </Typography>
          )}
        </Grid>
      </Container>
      <MockazonMenuDrawer />
      <Backdrop
        open={backDropOpen}
        style={{ zIndex: 1, position: 'fixed' }}
        onClick={() => setBackDropOpen(false)}
      />
    </>
  );
};

export default Index;
