import { Container, Grid, Card, CardContent, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import ProductsHeaderBar from '@/views/ProductsHeaderBar';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';

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

const namespaces = ['products'];
export const getServerSideProps: GetServerSideProps = async context => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale ?? 'en', namespaces)),
    },
  };
};

const Index = () => {
  const [products, setProducts] = useState([] as Product[]);
  const { t } = useTranslation('products');
  const [error, setError] = useState('');
  useEffect(() => {
    fetch(
      `http://${process.env.MICROSERVICE_URL || 'localhost'}:3011/api/v0/product`,
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
      .then(products => {
        setProducts(products);
        console.log(products);
      })
      .catch(err => {
        console.log('401', err);
        setError('Could not fetch products');
      });
  }, []);

  // https://chat.openai.com/share/86f158f1-110e-4905-ac4a-85ae8282f2c2
  return (
    <>
      {error && <p>{error}</p>}
      <ProductsHeaderBar />
      <Container style={{ marginTop: '50px' }}>
        <Grid container spacing={3}>
          {products.map(product => (
            <Grid item key={product.id} xs={12}>
              <Card style={{ display: 'flex' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.data.image}
                  alt={product.data.name}
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
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
};

export default Index;
