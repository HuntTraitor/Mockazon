import { UUID } from '@/graphql/types';
import { GraphQLError } from 'graphql/error';
import { ShopperOrder } from './schema';
import { Product } from '@/graphql/product/schema';

export class OrderService {
  public async getOrder(id: UUID): Promise<ShopperOrder> {
    const order = await fetch(
      `http://${process.env.MICROSERVICE_URL || 'localhost'}:3012/api/v0/order/shopperOrder/${id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
      .then(response => {
        if (!response.ok) {
          throw new GraphQLError(response.statusText);
        }
        return response.json();
      })
      .then(order => {
        return order;
      });

    const products = await Promise.all(
      order.products.map(async (productId: UUID) => {
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
              throw new GraphQLError(response.statusText);
            }
            return response.json();
          })
          .then(product => {
            // FIXME: We need to look at the other fields not being used maybe?
            // such as active, created, posted.
            return {
              id: product.id,
              vendor_id: product.vendor_id,
              data: product.data,
            } as Product;
          });
      })
    );

    console.log('Products:', JSON.stringify(products, null, 2));
    order.products = products;

    return order;
  }
}
