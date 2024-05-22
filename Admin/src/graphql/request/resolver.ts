import { Query, Resolver, Authorized } from 'type-graphql'; //Authorized

import { Request } from './schema';
import { RequestService } from './service';

@Resolver()
export class RequestResolver {
  @Authorized("admin")
  @Query(() => [Request])
  async request(): Promise<Request[]> {
    // console.log(`User requesting Accounts List is: ${request.user.id})`);
    return new RequestService().all();
  }
}
