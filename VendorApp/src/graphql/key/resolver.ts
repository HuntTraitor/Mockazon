import { Query, Resolver, Arg, Mutation } from 'type-graphql';
import { Key } from './schema';
import { KeyService } from './service';

@Resolver()
export class KeyResolver {
  // @Authorized("vendor")
  @Query(() => [Key])
  async key(@Arg('vendor_id') vendor_id: string): Promise<Key[]> {
    return new KeyService().list(vendor_id);
  }

  @Mutation(() => Key)
  async setActiveStatus(@Arg('apiKey') apiKey: string): Promise<Key> {
    return new KeyService().setActiveStatus(apiKey);
  }
}
