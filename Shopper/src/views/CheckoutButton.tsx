import { loadStripe } from '@stripe/stripe-js';
import styles from '@/styles/cart.module.css';

import PropTypes from 'prop-types';
import Subtotal from '@/views/Subtotal';
import getConfig from 'next/config';

interface Product {
  id: string;
  quantity: string;
  data: {
    getProduct: {
      data: {
        brand?: string;
        name?: string;
        rating?: string;
        price?: string;
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
}: {
  productsWithContent: Product[];
  shopperId: string;
  subtotal: number;
}) {
  const { basePath } = getConfig().publicRuntimeConfig;

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    const stripe = await stripePromise;
    if (!stripe) return;

    const lineItems = productsWithContent.map(p => ({
      price_data: {
        currency: 'usd',
        unit_amount: parseInt(p.data.getProduct.data.price as string),
        product_data: {
          name: p.data.getProduct.data.name,
          images: [p.data.getProduct.data.image],
        },
      },
      quantity: parseInt(p.quantity),
    }));

    const query = `
      mutation CreateStripeCheckoutSession($lineItems: [LineItem!]!, $shopperId: ShopperId!, $origin: String!) {
        createStripeCheckoutSession(
        lineItems: $lineItems, 
        shopperId: $shopperId, 
        origin: $origin) {
          id
          url
        }
      }
    `;

    const variables = {
      lineItems: lineItems, // ensure this is an array of objects matching LineItemInput
      shopperId: { shopperId },
      origin: window.location.origin,
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
          Proceed to checkout
        </button>
      </section>
    </form>
  );
}

CheckoutButton.propTypes = {
  productsWithContent: PropTypes.array.isRequired,
  shopperId: PropTypes.string.isRequired,
  subtotal: PropTypes.number.isRequired,
};
