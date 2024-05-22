import { Args, Mutation, Resolver } from 'type-graphql';
import { CheckoutSessionInput, Session } from './schema';
import { StripeService } from '@/graphql/stripe/sessions/service';

@Resolver()
export class StripeCheckoutResolver {
  @Mutation(() => Session)
  async createStripeCheckoutSession(
    @Args() { lineItems, shopperId, origin }: CheckoutSessionInput
  ): Promise<Session> {
    return new StripeService().createCheckoutSession(
      lineItems,
      shopperId,
      origin
    );
  }
}
