// DesktopCart.tsx

import styles from '@/styles/cart.module.css';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CardActionArea,
  Divider,
  useTheme,
  useMediaQuery,
  Select,
  MenuItem,
} from '@mui/material';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import MockazonMenuDrawer from '@/views/MockazonMenuDrawer';
import CheckoutButton from '@/views/CheckoutButton';
import Subtotal from '@/views/Subtotal';
import { Product } from '../../../types';
import AppBackDrop from '@/components/AppBackdrop';
import Image from 'next/image';

interface DesktopCartProps {
  products: Product[];
  subtotal: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any;
  locale: string;
  handleRemove: (productId: string) => void;
  handleQuantityChange: (productId: string, quantity: string) => void;
}

const DesktopCart: React.FC<DesktopCartProps> = ({
  products,
  subtotal,
  user,
  locale,
  handleRemove,
  handleQuantityChange,
}) => {
  const { t } = useTranslation(['products', 'cart']);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <div className={styles.exterior}>
      <Container
        className={isMobile ? styles.containerMobile : styles.container}
      >
        <Grid container spacing={2}>
          <Grid id={'cart'} className={styles.topDivider} item xs={12} md={9}>
            <div className={styles.cart}>
              <div className={styles.cartHeader}>
                <Typography className={`${styles.h1}`} variant="h1">
                  {t('cart:title')}
                </Typography>
                <div className={styles.priceHeader}>
                  <Typography
                    style={{ fontSize: '0.8rem' }}
                  >{`Price`}</Typography>
                </div>
                <Divider />
              </div>
              {products.map((product, index) => (
                <Box key={product.id + '_index_' + index}>
                  <Card className={styles.card} variant={'outlined'}>
                    <Box className={styles.cardImageBorder}>
                      <Link
                        aria-label={`product-link-${product.id}`}
                        className={styles.productLink}
                        href={`/products/${product.data.getProduct.id}`}
                      >
                        <CardActionArea>
                          <Box
                            className={
                              isMobile
                                ? styles.imageContainerMobile
                                : styles.imageContainer
                            }
                          >
                            <Image
                              style={{ outline: '2px solid #f0eeee' }}
                              src={`${product.data.getProduct.data.image}`}
                              alt="Product image"
                              layout="fill"
                              objectFit="contain"
                            />
                          </Box>
                        </CardActionArea>
                      </Link>
                    </Box>
                    <CardContent sx={{ flex: 'auto' }}>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                          }}
                        >
                          <Link
                            aria-label={`product-link-${product.id}`}
                            className={styles.productLink}
                            href={`/products/${product.data.getProduct.id}`}
                          >
                            <Typography className={styles.productName}>
                              {`${product.data.getProduct.data.brand} ${product.data.getProduct.data.name}`}
                            </Typography>
                          </Link>
                          <Typography
                            style={{ fontSize: '0.8rem' }}
                            aria-label={`deliveryDate is ${product.data.getProduct.data.deliveryDate}`}
                          >
                            {t('FREE delivery')}:{' '}
                            {new Intl.DateTimeFormat('en-US', {
                              weekday: 'long',
                              month: 'short',
                              day: 'numeric',
                            }).format(
                              new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                            )}
                          </Typography>
                          <Link
                            aria-label={`add-shopping-cart-${product.id}`}
                            className={styles.deleteLink}
                            href={`/cart`}
                          >
                            <Box className={styles.cardToolbar}>
                              <Select
                                aria-label={`Quantity Selector for ${product.id}`}
                                className={styles.quantityDropdown}
                                value={product.quantity}
                                onChange={e =>
                                  handleQuantityChange(
                                    product.data.getProduct.id,
                                    e.target.value as string
                                  )
                                }
                                MenuProps={{
                                  anchorOrigin: {
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                  },
                                  transformOrigin: {
                                    vertical: 'top',
                                    horizontal: 'left',
                                  },
                                  PaperProps: {
                                    style: {
                                      maxHeight: '350px',
                                      width: '20px',
                                      backgroundColor: 'white',
                                      boxShadow:
                                        '0px 2px 8px rgba(0, 0, 0, 0.15)',
                                      borderRadius: '4px',
                                    },
                                  },
                                }}
                              >
                                {Array.from({ length: 10 }, (_, i) => (
                                  <MenuItem
                                    key={i + 1}
                                    value={`${i + 1}`}
                                    style={{ fontSize: '12px' }} // Adjust the font size as needed
                                  >
                                    Qty: {i + 1}
                                  </MenuItem>
                                ))}
                              </Select>
                              <Divider orientation="vertical" flexItem />
                              <Typography
                                aria-label={`${t('cart:Delete')} ${product.data.getProduct.data.name}`}
                                style={{
                                  fontSize: '0.8rem',
                                  marginLeft: '0.5rem',
                                }}
                                className={styles.removeText}
                                onClick={() =>
                                  handleRemove(product.data.getProduct.id)
                                }
                              >
                                {t('cart:Delete')}
                              </Typography>
                            </Box>
                          </Link>
                        </Box>
                        <Box
                          sx={{
                            display: 'flex',
                          }}
                        >
                          <Typography
                            style={{ fontSize: '1.2rem', fontWeight: 'bold' }}
                            aria-label={`price is ${product.data.getProduct.data.price}`}
                          >
                            {`$${Number(product.data.getProduct.data.price).toFixed(2)}`}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                  {<Divider />}
                </Box>
              ))}
              <div className={styles.cartSubtotal}>
                <Subtotal
                  numberOfProducts={products
                    .map(p => parseInt(p.quantity))
                    .reduce((a, b) => a + b, 0)}
                  subtotal={subtotal}
                />
              </div>
            </div>
          </Grid>
          <Grid
            id={'buyItNow'}
            className={styles.topDivider}
            item
            xs={12}
            md={3}
          >
            <div>
              <CheckoutButton
                subtotal={subtotal}
                productsWithContent={products}
                shopperId={user.id}
                locale={locale}
              />
            </div>
            <Card className={styles.buyAgainBox}>{}</Card>
          </Grid>
        </Grid>
      </Container>
      <MockazonMenuDrawer />
      <AppBackDrop />
    </div>
  );
};

export default DesktopCart;
