/**
 * This service must communicate with the OrderService
 */
import { UUID } from '../types';
import type { NewOrder, Order } from './index';

export class OrderService {
  async create(order: NewOrder, vendorId?: UUID): Promise<Order> {
    return new Promise((resolve, reject) => {
      fetch(
        `http://${process.env.MICROSERVICE_URL || 'localhost'}:3012/api/v0/vendororder?vendorId=${vendorId}`,
        {
          method: 'POST',
          body: JSON.stringify(order),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
        .then(res => {
          if (!res.ok) {
            throw res;
          }
          return res.json();
        })
        .then(authenticated => {
          resolve(authenticated);
        })
        .catch(err => {
          console.log(err);
          reject(err);
        });
    });
  }
}
