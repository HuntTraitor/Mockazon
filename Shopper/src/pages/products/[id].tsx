import {
  Container,
  Card,
  CardContent,
  Typography,
  Backdrop,
} from '@mui/material';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import TopNav from '@/views/TopNav';
import MockazonMenuDrawer from '@/views/MockazonMenuDrawer';
import { useAppContext } from '@/contexts/AppContext';

interface Product {
  id: string;
  data: {
    brand?: string;
    name?: string;
    rating?: string;
    price?: number;
    deliveryDate?: string;
    image?: string;
  };
}

// https://chat.openai.com/share/c61c7fd0-a650-42f8-b89f-db88f972d9ed
const ProductPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { t } = useTranslation(['products', 'viewProduct']);
  const [product, setProduct] = useState({} as Product);
  const [error, setError] = useState('');
  const { backDropOpen, setBackDropOpen } = useAppContext();

  // FIXME: Do not fetch to microservice from the browser
  useEffect(() => {
    fetch(
      `http://${process.env.MICROSERVICE_URL || 'localhost'}:3011/api/v0/product/${id}`,
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
      .then(product => {
        setProduct(product);
        console.log(product);
      })
      .catch(err => {
        console.log('401', err);
        setError('Could not fetch products');
      });
  }, [id]);

  if (product && product.data) {
    return (
      <>
        <TopNav />
        <Container style={{ marginTop: '50px' }}>
          <Card style={{ display: 'flex' }}>
            <div style={{ flex: '2', paddingRight: '10px' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.data.image}
                alt={product.data.name}
                style={{
                  width: '100%',
                  height: 'auto',
                }}
              />
            </div>

            <CardContent
              style={{ flex: '3', display: 'flex', flexDirection: 'column' }}
            >
              <Typography
                variant="h3"
                component="h2"
                style={{ fontWeight: 'bold', marginBottom: '20px' }}
              >
                {product.data.brand} {product.data.name}
              </Typography>

              <Typography
                variant="subtitle1"
                component="p"
                style={{ marginTop: '20px' }}
              >
                {t('products:rating')}: {product.data.rating}
              </Typography>

              <Typography
                variant="subtitle1"
                component="p"
                style={{ marginTop: '20px' }}
              ></Typography>
            </CardContent>

            <CardContent
              style={{
                flex: '1',
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid #ccc',
                padding: '10px',
              }}
            >
              <Typography
                variant="h4"
                component="h2"
                style={{ fontWeight: 'bold' }}
              >
                ${product.data.price}
              </Typography>

              <Typography
                aria-label={'buy new'}
                variant="subtitle1"
                component="p"
                style={{ marginTop: '10px' }}
              >
                {t('viewProduct:buyNew')}
              </Typography>

              <Typography variant="subtitle1" component="p">
                {t('viewProduct:primeShipping')}
              </Typography>

              <Typography variant="subtitle1" component="p">
                {t('viewProduct:freeDelivery')}
              </Typography>

              <Typography variant="subtitle1" component="p">
                {t('viewProduct:deliverTo')}
              </Typography>
            </CardContent>
          </Card>
        </Container>
        <MockazonMenuDrawer />
        <Backdrop
          open={backDropOpen}
          style={{ zIndex: 1, position: 'fixed' }}
          onClick={() => setBackDropOpen(false)}
        />
      </>
    );
  } else {
    return <div>{error}</div>;
  }
};

export const getServerSideProps: GetServerSideProps = async context => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale ?? 'en', [
        'products',
        'viewProduct',
      ])),
    },
  };
};

export default ProductPage;
