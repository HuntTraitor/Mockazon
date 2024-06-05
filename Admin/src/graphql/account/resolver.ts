import { Arg, Mutation, Query, Resolver, Authorized } from 'type-graphql'; //Authorized

import { Account } from './schema';
import { AccountService } from './service';

@Resolver()
export class AccountResolver {
  @Authorized('admin')
  @Query(() => [Account])
  async account(): Promise<Account[]> {
    return new AccountService().all();
  }

  @Authorized('admin')
  @Mutation(() => Account)
  async approveVendor(@Arg('VendorId') vendorId: string): Promise<Account> {
    return new AccountService().approve(vendorId);
  }

  @Authorized('admin')
  @Mutation(() => Account)
  async rejectVendor(@Arg('VendorId') vendorId: string): Promise<Account> {
    return new AccountService().reject(vendorId);
  }

  @Authorized('admin')
  @Mutation(() => Account)
  async suspendAccount(@Arg('id') id: string): Promise<Account> {
    return new AccountService().suspend(id);
  }

  @Authorized('admin')
  @Mutation(() => Account)
  async resumeAccount(@Arg('id') id: string): Promise<Account> {
    return new AccountService().resume(id);
  }
}
