import { Args, Query, Resolver } from 'type-graphql';
import { ShopperId, ShoppingCartItem } from './schema';
import { ShoppingCartService } from '@/graphql/shoppingCart/service';

@Resolver()
export class ShoppingCartResolver {
  @Query(() => [ShoppingCartItem])
  async getShoppingCart(
    @Args() shopperId: ShopperId
  ): Promise<ShoppingCartItem[]> {
    return new ShoppingCartService().getShoppingCart(shopperId);
  }
}
