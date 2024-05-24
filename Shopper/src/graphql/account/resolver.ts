import { Query, Mutation, Resolver, Arg, Ctx } from 'type-graphql';
import {
  Order,
  ShippingAddress,
  OrderInput,
  ShippingAddressInput,
} from './schema';
import { AccountService } from './service';
import type { NextApiRequest } from 'next';

@Resolver()
export class AccountResolver {
  @Query(() => [Order])
  async getOrderHistory(@Ctx() request: NextApiRequest): Promise<Order[]> {
    return new AccountService().getOrderHistory(request.user.id);
  }

  @Mutation(() => Order)
  async addOrderHistory(
    @Ctx() request: NextApiRequest,
    @Arg('order') order: OrderInput
  ): Promise<Order | undefined> {
    return new AccountService().addOrderHistory(request.user.id, order);
  }

  @Query(() => [ShippingAddress])
  async getShippingInfo(
    @Ctx() request: NextApiRequest
  ): Promise<ShippingAddress[]> {
    return new AccountService().getShippingInfo(request.user.id);
  }

  @Mutation(() => ShippingAddress)
  async addShippingInfo(
    @Ctx() request: NextApiRequest,
    @Arg('shippingInfo') shippingInfo: ShippingAddressInput
  ): Promise<ShippingAddress | undefined> {
    return new AccountService().addShippingInfo(request.user.id, shippingInfo);
  }
}
