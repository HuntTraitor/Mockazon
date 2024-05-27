import { ShippingAddress, ShippingAddressInput } from './schema';
import { GraphQLError } from 'graphql';

export class AccountService {
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
  ): Promise<ShippingAddress[] | undefined> {
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
      return data as ShippingAddress[];
    } catch (error) {
      return undefined;
    }
  }
}
