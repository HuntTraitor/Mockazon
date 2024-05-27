import { UUID } from '../types';
import { AddItem, RemoveItem, ShoppingCartItem } from './schema';
import { GraphQLError } from 'graphql/error';

export class ShoppingCartService {
  public async getShoppingCart(shopperId: UUID): Promise<ShoppingCartItem[]> {
    const result = await fetch(
      `http://${process.env.MICROSERVICE_URL || 'localhost'}:3012/api/v0/shoppingCart?shopperId=${shopperId}`,
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
        console.error(err);
        throw new GraphQLError('Internal Server Error');
      });
    return result;
  }

  public async addToShoppingCart(
    item: AddItem,
    shopperId: UUID
  ): Promise<ShoppingCartItem> {
    const result = await fetch(
      `http://${process.env.MICROSERVICE_URL || 'localhost'}:3012/api/v0/shoppingCart`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shopper_id: shopperId,
          product_id: item.productId,
          quantity: item.quantity,
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
        console.error(err);
        throw new GraphQLError('Internal Server Error');
      });
    return result;
  }

  public async removeFromShoppingCart(
    item: RemoveItem,
    shopper_id: UUID
  ): Promise<RemoveItem> {
    const result = await fetch(
      `http://${process.env.MICROSERVICE_URL || 'localhost'}:3012/api/v0/shoppingCart`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shopper_id: shopper_id,
          product_id: item.productId,
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
        console.error(err);
        throw new GraphQLError('Internal Server Error');
      });
    return result;
  }
}
