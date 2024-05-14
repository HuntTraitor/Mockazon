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
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import useLoadLocalStorageUser from '@/views/useLoadUserFromLocalStorage';
import { LoggedInContext } from '@/contexts/LoggedInUserContext';
import { useAppContext } from '@/contexts/AppContext';
import TopNav from '@/views/TopNav';

interface Product {
  id: number;
  data: {
    getProduct: {
      data: {
        brand?: string;
        name?: string;
        rating?: string;
        price?: number;
        deliveryDate?: string;
        image?: string;
      };
    };
  };
}

interface ProductFromFetch {
  id: string;
  product_id: string;
  shopper_id: string;
  vendor_id: string;
  data: {
    quantity: string;
  };
}

const namespaces = ['products', 'topHeader', 'common', 'signInDropdown'];
export const getServerSideProps: GetServerSideProps = async context => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale ?? 'en', namespaces)),
    },
  };
};

const Cart = () => {
  const [products, setProducts] = useState([] as Product[]);
  const { t } = useTranslation('products');
  const [error, setError] = useState('');
  const { user, setUser, setAccessToken } = useContext(LoggedInContext);
  const { backDropOpen, setBackDropOpen } = useAppContext();
  useLoadLocalStorageUser(setUser, setAccessToken);

  // https://chat.openai.com/share/66cd884d-cc95-4e82-8b4f-a4d035f844af
  useEffect(() => {
    if (JSON.stringify(user) === '{}') {
      return;
    }
    const query = {
      query: `query GetShoppingCart {
    getShoppingCart(shopperId: "${user.id}") {
      id
      product_id
      shopper_id
      vendor_id
      data {
        quantity
      }
    }
  }`,
    };
    fetch('/api/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(query),
    })
      .then(response => {
        if (!response.ok) {
          throw response;
        }
        return response.json();
      })
      .then(shoppingCartProducts => {
        const fetchPromises = shoppingCartProducts.data.getShoppingCart.map(
          (product: ProductFromFetch) => {
            const query = {
              query: `query GetProduct {
              getProduct(productId: "${product.product_id}") {
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
            };
            return fetch('/api/graphql', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(query),
            }).then(response => {
              if (!response.ok) {
                throw response;
              }
              return response.json();
            });
          }
        );
        Promise.all(fetchPromises)
          .then(productsWithContent => {
            setProducts(productsWithContent);
            console.log(productsWithContent);
          })
          .catch(err => {
            console.log('Error fetching shoppingCartProducts:', err);
            setError('Could not fetch shoppingCartProducts');
          });
      })
      .catch(err => {
        console.log('Error fetching shopping cart:', err);
        setError('Could not fetch shopping cart');
      });
  }, [user]);

  // https://chat.openai.com/share/86f158f1-110e-4905-ac4a-85ae8282f2c2
  return (
    <>
      {error && <p>{error}</p>}
      <TopNav />
      <Typography
        style={{ marginTop: '50px', color: 'blue' }}
        variant="h4"
        align="center"
      >
        Shopping Cart
      </Typography>
      <Container style={{ marginTop: '50px' }}>
        <Grid container spacing={3}>
          {products.map(product => (
            <Grid item key={product.id} xs={12}>
              <Card style={{ display: 'flex' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.data.getProduct.data.image}
                  alt={product.data.getProduct.data.name}
                  style={{
                    width: '150px',
                    height: '100%',
                    objectFit: 'cover',
                  }}
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
                      {product.data.getProduct.data.brand}
                    </Typography>
                  </Link>
                  <Typography variant="h6" component="h2">
                    {product.data.getProduct.data.name}
                  </Typography>
                  <Typography
                    aria-label={`rating is ${product.data.getProduct.data.rating}`}
                    variant="subtitle1"
                    component="p"
                  >
                    {t('products:rating')}:{' '}
                    {product.data.getProduct.data.rating}
                  </Typography>
                  <Typography
                    aria-label={`price is ${product.data.getProduct.data.price}`}
                    variant="subtitle1"
                    component="p"
                  >
                    {t('products:price')}: ${product.data.getProduct.data.price}
                  </Typography>
                  <Typography
                    aria-label={`deliveryDate is ${product.data.getProduct.data.deliveryDate}`}
                    variant="subtitle1"
                    component="p"
                  >
                    {t('products:deliveryDate')}:{' '}
                    {product.data.getProduct.data.deliveryDate}
                  </Typography>
                  <Link
                    aria-label={`add-shopping-cart-${product.id}`}
                    style={{ color: 'blue' }}
                    href={`/shoppingCart`}
                  >
                    <Typography component="p" style={{ fontWeight: 'bold' }}>
                      Remove
                    </Typography>
                  </Link>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      <Backdrop
        open={backDropOpen}
        style={{ zIndex: 1, position: 'fixed' }}
        onClick={() => setBackDropOpen(false)}
      />
    </>
  );
};

export default Cart;
