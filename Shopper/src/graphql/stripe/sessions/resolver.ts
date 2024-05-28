import { Args, Mutation, Resolver } from 'type-graphql';
import {
  CheckoutSessionInput,
  LineItem,
  Session,
  ShopperId,
} from './schema';
import { StripeService } from '@/graphql/stripe/sessions/service';
import { Locale } from '@/graphql/stripe/sessions/schema';

@Resolver()
export class StripeCheckoutResolver {
  @Mutation(() => Session)
  async createStripeCheckoutSession(
    @Args() input: CheckoutSessionInput
  ): Promise<Session> {
    const {
      lineItems,
      shopperId,
      origin,
      locale,
    }: {
      lineItems: LineItem[];
      shopperId: ShopperId;
      origin: string;
      locale: Locale;
    } = input;
    return new StripeService().createCheckoutSession(
      lineItems,
      shopperId,
      origin,
      locale,
    );
  }
}
