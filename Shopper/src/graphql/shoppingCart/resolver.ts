import { Args, Mutation, Query, Resolver } from 'type-graphql';
import { AddItem, ShopperId, ShoppingCartItem } from './schema';
import { ShoppingCartService } from '@/graphql/shoppingCart/service';

@Resolver()
export class ShoppingCartResolver {
  @Query(() => [ShoppingCartItem])
  async getShoppingCart(
    @Args() shopperId: ShopperId
  ): Promise<ShoppingCartItem[]> {
    return new ShoppingCartService().getShoppingCart(shopperId);
  }

  @Mutation(() => ShoppingCartItem)
  async addToShoppingCart(
    @Args() item: AddItem
  ): Promise<ShoppingCartItem> {
    return new ShoppingCartService().addToShoppingCart(item);
  }
}
