import { Query, Resolver, Arg, Mutation, Ctx, Authorized } from 'type-graphql';
import { Key } from './schema';
import { KeyService } from './service';
import type { NextApiRequest } from 'next'

@Resolver()
export class KeyResolver {
  // @Authorized("vendor")
  @Query(() => [Key])
  @Authorized()
  async key(
    @Ctx() request: NextApiRequest
  ): Promise<Key[]> {
    return new KeyService().list(request.user.id);
  }

  @Mutation(() => Key)
  async setActiveStatus(@Arg('apiKey') apiKey: string): Promise<Key> {
    return new KeyService().setActiveStatus(apiKey);
  }
}
