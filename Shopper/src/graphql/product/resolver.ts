import { Args, Query, Resolver } from 'type-graphql';
import { Product, ProductId, GetProductsArgs } from './schema';
import { ProductService } from '@/graphql/product/service';

@Resolver()
export class ProductResolver {
  private productService = new ProductService();

  @Query(() => Product)
  async getProduct(@Args() { productId }: ProductId): Promise<Product> {
    return this.productService.getProduct(productId);
  }

  @Query(() => [Product])
  async getProducts(@Args() args: GetProductsArgs): Promise<Product[]> {
    const { vendorId, active, page, pageSize, search, orderBy, descending } =
      args;
    return this.productService.getProducts(
      vendorId,
      active,
      page,
      pageSize,
      search,
      orderBy,
      descending
    );
  }
}
