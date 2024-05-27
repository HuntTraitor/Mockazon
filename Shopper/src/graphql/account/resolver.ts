import { Query, Mutation, Resolver, Arg, Ctx, Authorized } from 'type-graphql';
import { ShippingAddress, ShippingAddressInput } from './schema';
import { AccountService } from './service';
import type { NextApiRequest } from 'next';

@Resolver()
export class AccountResolver {
  @Authorized('shopper')
  @Query(() => [ShippingAddress])
  async getShippingInfo(
    @Ctx() request: NextApiRequest
  ): Promise<ShippingAddress[]> {
    return new AccountService().getShippingInfo(request.user.id);
  }

  @Authorized('shopper')
  @Mutation(() => [ShippingAddress])
  async addShippingInfo(
    @Ctx() request: NextApiRequest,
    @Arg('shippingInfo') shippingInfo: ShippingAddressInput
  ): Promise<ShippingAddress[] | undefined> {
    return new AccountService().addShippingInfo(request.user.id, shippingInfo);
  }
}
