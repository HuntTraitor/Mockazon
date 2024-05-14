import { Product } from './schema';
import { GraphQLError } from 'graphql/error';

export class ProductService {
  public async getProduct(productId: string): Promise<Product> {
    return await fetch(
      `http://${process.env.MICROSERVICE_URL || 'localhost'}:3011/api/v0/product/${productId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
      .then(response => {
        if (!response.ok) {
          throw response;
        }
        return response.json();
      })
      .catch(err => {
        console.log(err);
        throw new GraphQLError('Internal Server Error');
      });
  }

  public async getProducts(): Promise<Product[]> {
    return await fetch(
      `http://${process.env.MICROSERVICE_URL || 'localhost'}:3011/api/v0/product`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
      .then(response => {
        if (!response.ok) {
          throw response;
        }
        return response.json();
      })
      .catch(err => {
        console.log(err);
        throw new GraphQLError('Internal Server Error');
      });
  }
}
