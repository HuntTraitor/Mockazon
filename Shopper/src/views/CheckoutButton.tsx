import { loadStripe } from '@stripe/stripe-js';
import styles from '@/styles/cart.module.css';

import PropTypes from 'prop-types';
import Subtotal from '@/views/Subtotal';
import getConfig from 'next/config';
import { useTranslation } from 'next-i18next';

enum Locale {
  en = 'en',
  es = 'es',
}

interface Product {
  id: string;
  quantity: string;
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

// Make sure to call `loadStripe` outside of a component’s render to avoid recreating the `Stripe` object on every render.
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

export default function CheckoutButton({
  subtotal,
  productsWithContent,
  shopperId,
  locale,
}: {
  productsWithContent: Product[];
  shopperId: string;
  subtotal: number;
  locale: string;
}) {
  const { basePath } = getConfig().publicRuntimeConfig;
  const { t } = useTranslation(['products', 'cart']);

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    const stripe = await stripePromise;
    if (!stripe) return;

    const lineItems = productsWithContent.map(p => ({
      price_data: {
        currency: 'usd',
        // unit amount is in cents so multiply by 100
        unit_amount: (p.data.getProduct.data.price as number) * 100,
        product_data: {
          name: p.data.getProduct.data.name,
          images: [p.data.getProduct.data.image],
        },
      },
      quantity: parseInt(p.quantity),
    }));

    const query = `
      mutation CreateStripeCheckoutSession($lineItems: [LineItem!]!, $shopperId: ShopperId!, $origin: String!, $locale: Locale!) {
        createStripeCheckoutSession(
        lineItems: $lineItems, 
        shopperId: $shopperId, 
        origin: $origin,
        locale: $locale
        ) {
          id
          url
        }
      }
    `;

    const variables = {
      lineItems: lineItems, // ensure this is an array of objects matching LineItemInput
      shopperId: { shopperId },
      origin: window.location.origin,
      locale: Locale[locale as keyof typeof Locale],
    };

    fetch(`${basePath}/api/graphql`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables }),
    })
      .then(res => {
        return res.json();
      })
      .then(async session => {
        if (session.errors) {
          console.log(session.errors[0].message);
          return;
        }
        // Redirect to Stripe Checkout
        const result = await stripe.redirectToCheckout({
          sessionId: session.data.createStripeCheckoutSession.id,
        });

        if (result.error) {
          console.error(result.error.message);
        }
      })
      .catch(err => {
        console.error(err);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <section className={styles.section}>
        <Subtotal
          numberOfProducts={productsWithContent.length}
          subtotal={subtotal}
        />
        <button className={styles.checkoutButton} type="submit" role="link">
          {t('cart:proceedToCheckout')}
        </button>
      </section>
    </form>
  );
}

CheckoutButton.propTypes = {
  productsWithContent: PropTypes.array.isRequired,
  shopperId: PropTypes.string.isRequired,
  subtotal: PropTypes.number.isRequired,
  locale: PropTypes.string,
};
