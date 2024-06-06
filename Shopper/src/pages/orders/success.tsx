// Source links:
// - YouTube: https://www.youtube.com/watch?v=F4-HicJx3o8
// - GitHub: https://github.com/HamedBahram/stripe-payment

import { useRouter } from 'next/router';
import useSWR from 'swr';
import styles from '@/styles/success.module.css';
import TopNav from '@/views/TopNav';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MockazonMenuDrawer from '@/views/MockazonMenuDrawer';
import Image from 'next/image';
import {
  Typography,
  List,
  ListItem,
  Stack,
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material';
// import { useAppContext } from '@/contexts/AppContext';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'; // Assuming you have a CSS module file
import AppBackDrop from '@/components/AppBackdrop';
import { useTranslation } from 'next-i18next';
// TODO this entire page needs to be converted to graphQL

export const fetcher = async (url: RequestInfo, init?: RequestInit) => {
  const response = await fetch(url, init);
  return response.json();
};

interface Product {
  id: string;
  images: string[];
  description: string;
  url: string;
  name: string;
  price: number;
  quantity: number;
}

const namespaces = [
  'products',
  'topHeader',
  'common',
  'signInDropdown',
  'successOrder',
  'accountDrawer',
  'viewProduct',
];
export const getServerSideProps: GetServerSideProps = async context => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale ?? 'en', namespaces)),
      locale: context.locale ?? 'en',
    },
  };
};

// https://chatgpt.com/share/89b19118-0745-4848-aee9-44d975221970
const CheckoutSuccessPage = () => {
  const { t } = useTranslation('successOrder');
  const {
    query: { sessionId },
  } = useRouter();
  const URL = sessionId ? `/api/stripe/sessions/${sessionId}` : null;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const maxCharacterLength = 18;

  const { data: checkoutSession, error } = useSWR(URL, fetcher);

  if (error)
    return <Typography variant="h2">Failed to load the session</Typography>;

  const {
    customer_details: customer,
    line_items,
    payment_intent,
    amount_subtotal,
    amount_total,
    total_details,
  } = checkoutSession || {};

  const products = line_items?.data?.map(
    (item: {
      price: { product: Product; unit_amount: number };
      quantity: number;
      description: string;
    }) => ({
      ...item.price.product,
      price: item.price.unit_amount,
      quantity: item.quantity,
      description: item.description,
    })
  );

  const payment = payment_intent?.charges?.data[0]?.payment_method_details;
  const { amount_discount: discount, amount_tax: tax } = total_details || {};

  return (
    <div
      className={styles.ultraExterior}
      style={{ paddingTop: isMobile ? '3rem' : '1rem' }}
    >
      <TopNav />
      <div className={styles.exterior}>
        <div className={styles.container}>
          <div className={styles.header}>
            <Typography aria-label={t('successStatus')} variant="h2">
              {t('successStatus')}{' '}
              {
                <CheckCircleIcon
                  sx={{ width: '40px', height: '40px' }}
                  color="success"
                />
              }
            </Typography>
            <Typography variant="h6">{t('thanks')}</Typography>
            <Typography variant="h6">{t('appreciative')}</Typography>
          </div>

          <div className={styles.orderInfo}>
            {isMobile ? (
              <Typography style={{ fontWeight: 'bold' }}>
                {t('orderNumber')}: {payment_intent?.id}
              </Typography>
            ) : (
              <Typography variant="h4">
                {t('orderNumber')}: {payment_intent?.id}
              </Typography>
            )}
          </div>

          <div className={styles.orderDetails}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              {t('orderDetails')}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {t('items')}
            </Typography>
            <List>
              {products?.map((product: Product) => {
                return (
                  <ListItem
                    key={product.id}
                    sx={{
                      gap: '10px',
                      border: '1px solid #e0e0e0',
                      justifyItems: 'space-between',
                      backgroundColor: '#f9f9f9',
                      marginBottom: '10px',
                      padding: '15px',
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <Box
                      className={
                        isMobile
                          ? styles.imageContainerMobile
                          : styles.imageContainer
                      }
                    >
                      <Image
                        src={product.images[0]}
                        alt={product.description}
                        layout="fill"
                        objectFit="contain"
                      />
                    </Box>
                    <Stack>
                      <div
                        className={
                          isMobile
                            ? styles.productNameMobile
                            : styles.productName
                        }
                      >
                        {isMobile ? (
                          <Typography>
                            {product.name.length > maxCharacterLength
                              ? `${product.name.slice(0, maxCharacterLength)}...`
                              : product.name}
                          </Typography>
                        ) : (
                          <Typography>{product.name}</Typography>
                        )}
                        {!isMobile && (
                          <Typography>
                            <strong>
                              {t('productDetails.productDescription')}:{' '}
                            </strong>
                            {product.description}
                          </Typography>
                        )}
                        <Typography>
                          <strong>{t('productDetails.quantity')}: </strong>
                          {product.quantity}{' '}
                        </Typography>
                        <Typography>
                          <strong>{t('productDetails.price')}: </strong>
                          {(product.price / 100).toLocaleString('en-us', {
                            style: 'currency',
                            currency: 'USD',
                          })}
                        </Typography>
                      </div>
                    </Stack>
                  </ListItem>
                );
              })}
            </List>
            <div className={styles.customerInfo}>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                {t('yourInfo')}
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {t('payment')}
              </Typography>
              <div>
                {payment?.card && (
                  <div>
                    <strong>{t('paymentDetails.paymentInfo')}:</strong>
                    <div>
                      <p>{payment.card.wallet}</p>
                      <p>{payment.card.brand.toUpperCase()}</p>
                      <p>
                        {t('paymentDetails.endingWith')} `{payment.card.last4}`
                      </p>
                      <p>
                        {t('paymentDetails.expiresOn')} {payment.card.exp_month}{' '}
                        / {payment.card.exp_year}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <div>
                <strong>{t('billing')}:</strong>
                <address>
                  <span>
                    {t('billingDetails.name')}: {customer?.name}
                  </span>
                  <br />
                  <span>
                    {t('billingDetails.email')}: {customer?.email}
                  </span>
                  <br />
                  <span>
                    {t('billingDetails.country')}: {customer?.address.country}
                  </span>
                  <br />
                  <span>
                    {t('billingDetails.postalCode')}:{' '}
                    {customer?.address.postal_code}
                  </span>
                </address>
              </div>
            </div>

            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {t('summary')}
            </Typography>
            <div className={styles.summary}>
              <div>
                <strong>{t('summaryDetails.subtotal')}:</strong>{' '}
                <span>
                  {(amount_subtotal / 100).toLocaleString('en-CA', {
                    style: 'currency',
                    currency: 'CAD',
                  })}
                </span>
              </div>
              <div>
                <strong>{t('summaryDetails.discount')}:</strong>{' '}
                <span>
                  -
                  {(discount / 100).toLocaleString('en-CA', {
                    style: 'currency',
                    currency: 'CAD',
                  })}
                </span>
              </div>
              <div>
                <strong>{t('summaryDetails.tax')}:</strong>{' '}
                <span>
                  {(tax / 100).toLocaleString('en-CA', {
                    style: 'currency',
                    currency: 'CAD',
                  })}
                </span>
              </div>
              <div>
                <strong>{t('summaryDetails.total')}:</strong>{' '}
                <span>
                  {(amount_total / 100).toLocaleString('en-CA', {
                    style: 'currency',
                    currency: 'CAD',
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
        <MockazonMenuDrawer />
        <AppBackDrop />
      </div>
    </div>
  );
};

export default CheckoutSuccessPage;
