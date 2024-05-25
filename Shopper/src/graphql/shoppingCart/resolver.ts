import { Args, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { AddItem, ShoppingCartItem } from './schema';
import { ShoppingCartService } from '@/graphql/shoppingCart/service';
import type { NextApiRequest } from 'next';

@Resolver()
export class ShoppingCartResolver {
  @Authorized()
  @Query(() => [ShoppingCartItem])
  async getShoppingCart(
    @Ctx() request: NextApiRequest
  ): Promise<ShoppingCartItem[]> {
    return new ShoppingCartService().getShoppingCart(request.user.id);
  }

  @Mutation(() => ShoppingCartItem)
  @Authorized()
  async addToShoppingCart(
    @Args() item: AddItem,
    @Ctx() request: NextApiRequest
  ): Promise<ShoppingCartItem> {
    return new ShoppingCartService().addToShoppingCart(item, request.user.id);
  }
}
