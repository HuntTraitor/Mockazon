import { Authorized, Resolver, Query, Arg, Ctx } from 'type-graphql';
import { ShopperOrder } from './schema';
import { OrderService } from '@/graphql/order/service';
import type { NextApiRequest } from 'next';
import type { UUID } from '@/graphql/types';

@Resolver()
export class OrderResolver {
  @Authorized()
  @Query(() => ShopperOrder)
  async getOrder(
    @Arg('id', () => String) id: UUID,
    @Ctx() request: NextApiRequest
  ): Promise<ShopperOrder> {
    console.log('Getting order: ', id, request.user.id);
    const order = await new OrderService().getOrder(id, request.user.id);
    if (!order) {
      throw new Error('Order not found');
    }
    console.log('Returning order: ', order);
    return order;
  }
}
