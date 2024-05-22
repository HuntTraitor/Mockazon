// Source links:
// - YouTube: https://www.youtube.com/watch?v=F4-HicJx3o8
// - GitHub: https://github.com/HamedBahram/stripe-payment

import styles from '@/styles/success.module.css';
import TopNav from '@/views/TopNav';
import MockazonMenuDrawer from '@/views/MockazonMenuDrawer';
import { Backdrop } from '@mui/material';
import { useAppContext } from '@/contexts/AppContext';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'; // Assuming you have a CSS module file

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
  const { backDropOpen, setBackDropOpen } = useAppContext();

  return (
    <>
      <TopNav />
      <h1>Payment Successful</h1>
      <p>Thank you for your order.</p>
      <p>
        We appreciate your business and are currently processing your order. You
        will receive a confirmation soon!
      </p>
      <MockazonMenuDrawer />
      <Backdrop
        aria-label={'backdrop'}
        open={backDropOpen}
        className={styles.backdrop}
        onClick={() => setBackDropOpen(false)}
      />
    </>
  );
};

export default CheckoutSuccessPage;
