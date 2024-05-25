import { UUID } from '@/graphql/types';
import { GraphQLError } from 'graphql/error';
import { ShopperOrder } from './schema';

export class OrderService {
  public async getOrder(id: UUID, accessToken: string): Promise<ShopperOrder> {
    const order = await fetch(
      `http://${process.env.MICROSERVICE_URL || 'localhost'}:3012/api/v0/order/shopperOrder/${id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
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

    return order;
  }
}
