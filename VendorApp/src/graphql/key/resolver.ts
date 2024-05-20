import { Query, Resolver, Arg, Mutation, Ctx, Authorized } from 'type-graphql';
import { Key } from './schema';
import { KeyService } from './service';
import type { NextApiRequest } from 'next';

@Resolver()
export class KeyResolver {
  @Query(() => [Key])
  @Authorized("vendor")
  async keys(@Ctx() request: NextApiRequest): Promise<Key[]> {
    console.log(request.user)
    return new KeyService().list(request.user.id);
  }

  @Authorized("vendor")
  @Mutation(() => Key)
  async setActiveStatus(@Arg('apiKey') apiKey: string): Promise<Key> {
    return new KeyService().setActiveStatus(apiKey);
  }
  @Authorized("vendor")
  @Mutation(() => Key)
  async postAPIKeyRequest(@Ctx() request: NextApiRequest): Promise<Key> {
    return new KeyService().postAPIKeyRequest(request.user.id);
  }
}
