/**
 * This service must communicate with the OrderService
 */
import { UUID } from '../types';
import type { Order, UpdateOrder } from './index';

export class OrderService {
  async getOrders(vendorId: UUID): Promise<Order[]> {
    return new Promise((resolve, reject) => {
      fetch(
        `http://${process.env.MICROSERVICE_URL || 'localhost'}:3012/api/v0/order?vendorId=${vendorId}`
      )
        .then(res => {
          if (!res.ok) {
            throw res;
          }
          return res.json();
        })
        .then(data => {
          resolve(data);
        })
        .catch(err => {
          console.log(err);
          reject(err);
        });
    });
  }

  async update(orderId: UUID, order: UpdateOrder): Promise<Order> {
    return new Promise((resolve, reject) => {
      const params = [
        order.quantity !== undefined && `quantity=${order.quantity}`,
        order.shipped !== undefined && `shipped=${order.shipped}`,
        order.delivered !== undefined && `delivered=${order.delivered}`,
      ]
        .filter(Boolean)
        .join('&');

      const link = `http://${process.env.MICROSERVICE_URL || 'localhost'}:3012/api/v0/order/${orderId}${params ? '?' + params : ''}`;
      fetch(link, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(res => {
          if (!res.ok) {
            throw res;
          }
          return res.json();
        })
        .then(data => {
          resolve(data);
        })
        .catch(err => {
          console.error(err);
          reject(err);
        });
    });
  }

  async setShipped(orderId: UUID, shipped: boolean): Promise<Order> {
    return new Promise((resolve, reject) => {
      fetch(
        `http://${process.env.MICROSERVICE_URL || 'localhost'}:3012/api/v0/order/${orderId}/shipped?shipped=${shipped}`,
        {
          method: 'PUT',
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
        .then(data => {
          resolve(data);
        })
        .catch(err => {
          console.log(err);
          reject(err);
        });
    });
  }

  async setDelivered(orderId: UUID, delivered: boolean): Promise<Order> {
    return new Promise((resolve, reject) => {
      fetch(
        `http://${process.env.MICROSERVICE_URL || 'localhost'}:3012/api/v0/order/${orderId}/delivered?delivered=${delivered}`,
        {
          method: 'PUT',
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
        .then(data => {
          resolve(data);
        })
        .catch(err => {
          console.log(err);
          reject(err);
        });
    });
  }
}
