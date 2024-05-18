import { AddItem, ShopperId, ShoppingCartItem } from './schema';
import { GraphQLError } from 'graphql/error';

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

  public async addToShoppingCart(
    item: AddItem
  ): Promise<ShoppingCartItem> {
    const result = await fetch(
      `http://${process.env.MICROSERVICE_URL || 'localhost'}:3012/api/v0/shoppingCart`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shopper_id: item.shopperId,
          product_id: item.productId,
          quantity: item.quantity
        }),
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
