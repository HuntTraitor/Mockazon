import { Args, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { AddItem, RemoveItem, ShoppingCartItem } from './schema';
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

  @Authorized()
  @Mutation(() => ShoppingCartItem)
  async removeFromShoppingCart(
    @Args() item: RemoveItem,
    @Ctx() request: NextApiRequest
  ): Promise<RemoveItem> {
    return new ShoppingCartService().removeFromShoppingCart(
      item,
      request.user.id
    );
  }
}
