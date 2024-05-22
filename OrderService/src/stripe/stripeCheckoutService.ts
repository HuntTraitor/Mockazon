import { UUID } from 'src/types';
import { LineItem, Session, Error } from '.';
import Stripe from 'stripe';

const checkoutSessions = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export class StripeCheckoutService {
  public async createCheckoutSession(
    lineItems: LineItem[],
    shopperId: UUID,
    origin: string
  ): Promise<Session | Error> {
    try {
      // Create Checkout Sessions from body params.
      const session = await checkoutSessions.checkout.sessions.create({
        line_items: lineItems,
        mode: 'payment',
        success_url: `${origin}/orders/success?sessionId={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/?canceled=true`,
      });
      return { id: session.id, url: session.url as string };
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      return { status: err.statusCode, message: err.message };
    }
  }
}
