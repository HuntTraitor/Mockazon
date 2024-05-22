import { Arg, Mutation, Query, Resolver, Authorized } from 'type-graphql'; //Authorized

import { Account } from './schema';
import { AccountService } from './service';

@Resolver()
export class AccountResolver {
  @Authorized("admin")
  @Query(() => [Account])
  async account(): Promise<Account[]> {
    return new AccountService().all();
  }

  @Mutation(() => Account)
  async approveVendor(@Arg('VendorId') vendorId: string): Promise<Account> {
    return new AccountService().approve(vendorId);
  }
}
