import { ShopperId, ShoppingCartItem } from './schema';
import { GraphQLError } from 'graphql/error';
import { SessionUser } from '@/graphql/types/next';

export class ShoppingCartService {
  public async getShoppingCart(
    shopperId: ShopperId
  ): Promise<ShoppingCartItem[]> {
    const result = await fetch(
      `http://${process.env.MICROSERVICE_URL || 'localhost'}:3012/api/v0/shoppingCart?shopperId=${shopperId.shopperId}`,
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
      .then(authenticated => {
        return authenticated;
      })
      .catch(err => {
        console.log(err);
        throw new GraphQLError('Internal Server Error');
      });
    return result;
  }

}
