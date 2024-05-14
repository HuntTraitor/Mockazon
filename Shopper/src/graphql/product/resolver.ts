import { Args, Query, Resolver } from 'type-graphql';
import { Product, ProductId } from './schema';
import { ProductService } from '@/graphql/product/service';

@Resolver()
export class ProductResolver {
  @Query(() => Product)
  async getProduct(@Args() productId: ProductId): Promise<Product> {
    return new ProductService().getProduct(productId.productId);
  }

  @Query(() => [Product])
  async getProducts(): Promise<Product[]> {
    return new ProductService().getProducts();
  }
}
