// MobileCart.tsx

import styles from '@/styles/cart.module.css';
import {
  Container,
  Grid,
  Card,
  Box,
  CardActionArea,
  Divider,
  Typography,
} from '@mui/material';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import CheckoutButton from '@/views/CheckoutButton';
import { Product } from '../../../types';
import Image from 'next/image';
import Price from '../product/Price';

interface MobileCartProps {
  products: Product[];
  subtotal: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any;
  locale: string;
  handleRemove: (productId: string) => void;
  handleQuantityChange: (productId: string, quantity: string) => void;
}

const MobileCart: React.FC<MobileCartProps> = ({
  products,
  subtotal,
  user,
  locale,
  handleRemove,
  handleQuantityChange,
}) => {
  const { t } = useTranslation(['products', 'cart']);

  return (
    <div className={styles.exterior}>
      <Container className={styles.containerMobile}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <div>
              <CheckoutButton
                subtotal={subtotal}
                productsWithContent={products}
                shopperId={user.id}
                locale={locale}
              />
            </div>
          </Grid>
          <Grid item xs={12}>
            <div className={styles.cart}>
              <Divider />
              {products.map((product, index) => (
                <Box key={product.id + '_index_' + index}>
                  <Card className={styles.cardMobile} variant={'outlined'}>
                    <Box className={styles.cardContentMobile}>
                      <Link
                        aria-label={`product-link-${product.id}`}
                        className={styles.productLink}
                        href={`/products/${product.data.getProduct.id}`}
                      >
                        <CardActionArea>
                          <Box className={styles.imageContainerMobile}>
                            <Image
                              src={`${product.data.getProduct.data.image}`}
                              alt="Product image"
                              layout="fill"
                              objectFit="contain"
                            />
                          </Box>
                        </CardActionArea>
                      </Link>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          marginLeft: '1rem',
                        }}
                      >
                        <Link
                          aria-label={`product-link-${product.id}`}
                          className={styles.productLink}
                          href={`/products/${product.data.getProduct.id}`}
                        >
                          <Typography className={styles.productNameMobile}>
                            {`${product.data.getProduct.data.brand} ${product.data.getProduct.data.name}`}
                          </Typography>
                        </Link>
                        <Price
                          price={`${Number(product.data.getProduct.data.price).toFixed(2)}`}
                        />
                        <Typography
                          style={{ fontSize: '0.8rem' }}
                          aria-label={`deliveryDate is ${product.data.getProduct.data.deliveryDate}`}
                        >
                          {t('FREE delivery')}:{' '}
                          {new Intl.DateTimeFormat('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                          }).format(
                            new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                          )}
                        </Typography>
                        <Box className={styles.quantityControlMobile}>
                          <button
                            className={styles.quantityButton}
                            onClick={() =>
                              handleQuantityChange(
                                product.data.getProduct.id,
                                (parseInt(product.quantity) - 1).toString()
                              )
                            }
                            disabled={parseInt(product.quantity) <= 1}
                          >
                            -
                          </button>
                          <Typography className={styles.quantityDisplay}>
                            {product.quantity}
                          </Typography>
                          <button
                            className={styles.quantityButton}
                            onClick={() =>
                              handleQuantityChange(
                                product.data.getProduct.id,
                                (parseInt(product.quantity) + 1).toString()
                              )
                            }
                            disabled={parseInt(product.quantity) >= 10}
                          >
                            +
                          </button>
                        </Box>
                        <Typography
                          aria-label={`${t('cart:Delete')} ${product.data.getProduct.data.name}`}
                          style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}
                          className={styles.removeText}
                          onClick={() =>
                            handleRemove(product.data.getProduct.id)
                          }
                        >
                          {t('cart:Delete')}
                        </Typography>
                      </Box>
                    </Box>
                  </Card>
                  {<Divider />}
                </Box>
              ))}
            </div>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default MobileCart;
