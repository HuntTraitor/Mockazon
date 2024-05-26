import { Authorized, Resolver, Query, Arg, Ctx } from 'type-graphql';
import { ShopperOrder } from './schema';
import { OrderService } from '@/graphql/order/service';
import type { UUID } from '@/graphql/types';
import type { NextApiRequest } from 'next';

@Resolver()
export class OrderResolver {
  @Authorized()
  @Query(() => ShopperOrder)
  async getOrder(@Arg('id', () => String) id: UUID): Promise<ShopperOrder> {
    const order = await new OrderService().getOrder(id);
    if (!order) {
      throw new Error('Order not found');
    }
    return order;
  }

  @Authorized()
  @Query(() => [ShopperOrder])
  async getAllOrders(@Ctx() request: NextApiRequest): Promise<ShopperOrder[]> {
    const orders = await new OrderService().getAllOrders(request.user.id);
    return orders;
  }
}
