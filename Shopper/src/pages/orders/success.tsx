// Source links:
// - YouTube: https://www.youtube.com/watch?v=F4-HicJx3o8
// - GitHub: https://github.com/HamedBahram/stripe-payment

import { useRouter } from 'next/router';
import useSWR from 'swr';
import styles from '@/styles/success.module.css';
import TopNav from '@/views/TopNav';
import MockazonMenuDrawer from '@/views/MockazonMenuDrawer';
import { Backdrop } from '@mui/material';
import { useAppContext } from '@/contexts/AppContext';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'; // Assuming you have a CSS module file

// TODO this entire page needs to be converted to graphQL

const fetcher = async (url: RequestInfo, init?: RequestInit) => {
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

const namespaces = ['products', 'topHeader', 'common', 'signInDropdown'];
export const getServerSideProps: GetServerSideProps = async context => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale ?? 'en', namespaces)),
    },
  };
};

// https://chatgpt.com/share/89b19118-0745-4848-aee9-44d975221970
const CheckoutSuccessPage = () => {
  const {
    query: { sessionId },
  } = useRouter();
  const URL = sessionId ? `/api/stripe/sessions/${sessionId}` : null;
  const { backDropOpen, setBackDropOpen } = useAppContext();

  const { data: checkoutSession, error } = useSWR(URL, fetcher);

  if (error) return <div>Failed to load the session</div>;

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
    }) => ({
      ...item.price.product,
      price: item.price.unit_amount,
      quantity: item.quantity,
    })
  );

  const payment = payment_intent?.charges?.data[0]?.payment_method_details;
  const { amount_discount: discount, amount_tax: tax } = total_details || {};

  return (
    <>
      <TopNav />
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Payment Successful</h1>
          <p>Thank you for your order.</p>
          <p>
            We appreciate your business and are currently processing your order.
            You will receive a confirmation soon!
          </p>
        </div>

        <div className={styles.orderInfo}>
          <strong>Order Number:</strong> <span>{payment_intent?.id}</span>
        </div>

        <div className={styles.orderDetails}>
          <h2>Your Order</h2>
          <h3>Items</h3>
          {products?.map((product: Product) => (
            <div key={product.id} className={styles.product}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.images[0]}
                alt={product.description}
                height={200}
                width={200}
                className={styles.productImage}
              />
              <div className={styles.productDetails}>
                <h4>
                  <a href={product.url} className={styles.productLink}>
                    {product.name}
                  </a>
                </h4>
                <p>{product.description}</p>
                <div>
                  <strong>Quantity:</strong> <span>{product.quantity}</span>
                </div>
                <div>
                  <strong>Price:</strong>{' '}
                  <span>
                    {(product.price / 100).toLocaleString('en-CA', {
                      style: 'currency',
                      currency: 'CAD',
                    })}
                  </span>
                </div>
              </div>
            </div>
          ))}

          <div className={styles.customerInfo}>
            <h3>Your Information</h3>
            <h4>Payment</h4>
            <div>
              {payment?.card && (
                <div>
                  <strong>Payment Information:</strong>
                  <div>
                    <p>{payment.card.wallet}</p>
                    <p>{payment.card.brand.toUpperCase()}</p>
                    <p>Ending with {payment.card.last4}</p>
                    <p>
                      Expires on {payment.card.exp_month} /{' '}
                      {payment.card.exp_year}
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div>
              <strong>Billing Address:</strong>
              <address>
                <span>Name: {customer?.name}</span>
                <br />
                <span>Email: {customer?.email}</span>
                <br />
                <span>Country: {customer?.address.country}</span>
                <br />
                <span>Postal Code: {customer?.address.postal_code}</span>
              </address>
            </div>
          </div>

          <h3>Summary</h3>
          <div className={styles.summary}>
            <div>
              <strong>Subtotal:</strong>{' '}
              <span>
                {(amount_subtotal / 100).toLocaleString('en-CA', {
                  style: 'currency',
                  currency: 'CAD',
                })}
              </span>
            </div>
            <div>
              <strong>Discount:</strong>{' '}
              <span>
                -
                {(discount / 100).toLocaleString('en-CA', {
                  style: 'currency',
                  currency: 'CAD',
                })}
              </span>
            </div>
            <div>
              <strong>Tax:</strong>{' '}
              <span>
                {(tax / 100).toLocaleString('en-CA', {
                  style: 'currency',
                  currency: 'CAD',
                })}
              </span>
            </div>
            <div>
              <strong>Total:</strong>{' '}
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
      <Backdrop
        aria-label={'backdrop'}
        open={backDropOpen}
        className={styles.backdrop}
        style={{ zIndex: 1, position: 'fixed' }}
        onClick={() => setBackDropOpen(false)}
      />
    </>
  );
};

export default CheckoutSuccessPage;
