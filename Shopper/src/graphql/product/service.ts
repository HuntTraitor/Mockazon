import { Product } from './schema';
import { GraphQLError } from 'graphql';

export class ProductService {
  public async getProduct(productId: string): Promise<Product> {
    const url = `http://${process.env.MICROSERVICE_URL || 'localhost'}:3011/api/v0/product/${productId}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching product with ID ${productId}`);
      }

      return await response.json();
    } catch (err) {
      console.error(err);
      throw new GraphQLError('Internal Server Error');
    }
  }

  public async getProducts(
    vendorId?: string,
    active?: boolean,
    page?: number,
    pageSize?: number,
    search?: string,
    orderBy?: string,
    descending?: boolean
  ): Promise<Product[]> {
    const params = new URLSearchParams();

    if (vendorId) params.append('vendorId', vendorId);
    if (active !== undefined) params.append('active', active.toString());
    if (page) params.append('page', page.toString());
    if (pageSize) params.append('pageSize', pageSize.toString());
    if (search) params.append('search', search);
    if (orderBy) params.append('orderBy', orderBy);
    if (descending !== undefined)
      params.append('descending', descending.toString());

    const url = `http://${process.env.MICROSERVICE_URL || 'localhost'}:3011/api/v0/product?${params.toString()}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error fetching products');
      }

      return await response.json();
    } catch (err) {
      console.error(err);
      throw new GraphQLError('Internal Server Error');
    }
  }
}
