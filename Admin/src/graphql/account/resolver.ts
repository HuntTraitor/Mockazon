import { Query, Resolver, Ctx } from 'type-graphql'; //Authorized
import type { NextApiRequest } from 'next';

import { Account } from './schema';
import { AccountService } from './service';

@Resolver()
export class AccountResolver {
  // @Authorized('member') // At some point we want to restrict access for this query to admin only
  @Query(() => [Account])
  async book(@Ctx() request: NextApiRequest): Promise<Account[]> {
    console.log(`User requesting Accounts List is: ${request.user.id})`);
    return new AccountService().all();
  }
}
