import { Query, Resolver } from 'type-graphql'; //Authorized

import { Request } from './schema';
import { RequestService } from './service';

@Resolver()
export class RequestResolver {
  // @Authorized('member') // At some point we want to restrict access for this query to admin only
  @Query(() => [Request])
  async request(): Promise<Request[]> {
    // console.log(`User requesting Accounts List is: ${request.user.id})`);
    return new RequestService().all();
  }
}
