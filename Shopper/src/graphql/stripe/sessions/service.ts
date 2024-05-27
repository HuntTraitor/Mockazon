import { LineItem, Locale, MetaData, Session, ShopperId } from './schema';
import { GraphQLError } from 'graphql/error';

export class StripeService {
  public async createCheckoutSession(
    lineItems: LineItem[],
    shopperId: ShopperId,
    origin: string,
    locale: Locale,
    metadata: MetaData
  ): Promise<Session> {
    const result = await fetch(
      `http://${process.env.MICROSERVICE_URL || 'localhost'}:3012/api/v0/stripeCheckout`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lineItems,
          shopperId,
          origin,
          locale,
          metadata,
        }),
      }
    )
      .then(response => {
        if (!response.ok) {
          throw response;
        }
        return response.json();
      })
      .then(authenticated => {
        return authenticated;
      })
      .catch(err => {
        console.error(err);
        throw new GraphQLError('Internal Server Error');
      });
    return result;
  }
}
