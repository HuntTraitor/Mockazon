import { Query, Resolver, Arg } from 'type-graphql';
import { Product } from './schema';
import { ProductService } from './service';

@Resolver()
export class ProductResolver {
  // @Authorized("vendor")
  @Query(() => [Product])
  async product(@Arg('vendor_id') vendor_id: string): Promise<Product[]> {
    return new ProductService().list(vendor_id);
  }
}
