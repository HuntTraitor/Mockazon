import {
  Order,
  ShippingAddress,
  OrderInput,
  ShippingAddressInput,
} from './schema';
import { GraphQLError } from 'graphql';

export class AccountService {
  public async getOrderHistory(id: string): Promise<Order[]> {
    try {
      const response = await fetch(
        `http://${process.env.MICROSERVICE_URL || 'localhost'}:3014/api/v0/shopper/orderhistory?userId=${id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new GraphQLError('Failed to fetch order history');
      }

      const data = await response.json();
      return data as Order[];
    } catch (error) {
      return [];
    }
  }

  public async addOrderHistory(
    id: string,
    orderInput: OrderInput
  ): Promise<Order | undefined> {
    try {
      const response = await fetch(
        `http://${process.env.MICROSERVICE_URL || 'localhost'}:3014/api/v0/shopper/orderhistory?userId=${id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderInput),
        }
      );

      if (!response.ok) {
        throw new GraphQLError('Failed to add order history');
      }

      const data = await response.json();
      return data as Order;
    } catch (error) {
      return undefined;
    }
  }

  public async getShippingInfo(id: string): Promise<ShippingAddress[]> {
    try {
      const response = await fetch(
        `http://${process.env.MICROSERVICE_URL || 'localhost'}:3014/api/v0/shopper/shippinginfo?userId=${id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new GraphQLError('Failed to fetch shipping info');
      }

      const data = await response.json();
      return data as ShippingAddress[];
    } catch (error) {
      return [];
    }
  }

  public async addShippingInfo(
    id: string,
    shippingInfoInput: ShippingAddressInput
  ): Promise<ShippingAddress | undefined> {
    try {
      const response = await fetch(
        `http://${process.env.MICROSERVICE_URL || 'localhost'}:3014/api/v0/shopper/shippinginfo?userId=${id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(shippingInfoInput),
        }
      );

      if (!response.ok) {
        throw new GraphQLError('Failed to add shipping info');
      }

      const data = await response.json();
      return data as ShippingAddress;
    } catch (error) {
      return undefined;
    }
  }
}
