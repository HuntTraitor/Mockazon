import { Authorized, Resolver, Query, Arg } from 'type-graphql';
import { ShopperOrder } from './schema';
import { OrderService } from '@/graphql/order/service';
import type { UUID } from '@/graphql/types';

@Resolver()
export class OrderResolver {
  @Authorized()
  @Query(() => ShopperOrder)
  async getOrder(
    @Arg('id', () => String) id: UUID
  ): Promise<ShopperOrder> {
    const order = await new OrderService().getOrder(id);
    if (!order) {
      throw new Error('Order not found');
    }
    return order;
  }
}
