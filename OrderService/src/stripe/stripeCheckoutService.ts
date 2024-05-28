import { UUID } from 'src/types';
import { LineItem, Session, Error } from '.';
import Stripe from 'stripe';

const checkoutSessions = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-04-10',
});

export class StripeCheckoutService {
  public async createCheckoutSession(
    lineItems: LineItem[],
    shopperId: UUID,
    origin: string,
    locale: Stripe.Checkout.SessionCreateParams.Locale,
  ): Promise<Session | Error> {
    // prepare metadata for transfer by serializing it
    const preparedMetadata = {
      shopperId: 'shopperId',
    };
    preparedMetadata.shopperId = shopperId;
    try {
      // Create Checkout Sessions from body params.
      let success_url = `${origin}/orders/success?sessionId={CHECKOUT_SESSION_ID}`;
      let cancel_url = `${origin}/cart?canceled=true`;
      if (locale === 'es') {
        success_url = `${origin}/es/orders/success?sessionId={CHECKOUT_SESSION_ID}`;
        cancel_url = `${origin}/es/cart?canceled=true`;
      }
      const session = await checkoutSessions.checkout.sessions.create({
        line_items: lineItems,
        metadata: preparedMetadata,
        mode: 'payment',
        success_url: success_url,
        cancel_url: cancel_url,
        locale: locale,
      });
      return { id: session.id, url: session.url as string };
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      return { status: err.statusCode, message: err.message };
    }
  }
}
