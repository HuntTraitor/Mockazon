import { Arg, Mutation, Query, Resolver } from 'type-graphql'; //Authorized

import { Account } from './schema';
import { AccountService } from './service';

@Resolver()
export class AccountResolver {
  // @Authorized('member') // At some point we want to restrict access for this query to admin only
  @Query(() => [Account])
  async account(): Promise<Account[]> {
    return new AccountService().all();
  }

  @Mutation(() => Account)
  async approveVendor(@Arg('VendorId') vendorId: string): Promise<Account> {
    return new AccountService().approve(vendorId);
  }
}
