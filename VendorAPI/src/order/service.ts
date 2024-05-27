/**
 * This service must communicate with the OrderService
 */
import { UUID } from '../types';
import type { NewOrder, Order, UpdateOrder } from './index';

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

  async create(order: NewOrder, vendorId?: UUID): Promise<Order> {
    return new Promise((resolve, reject) => {
      fetch(
        `http://${process.env.MICROSERVICE_URL || 'localhost'}:3012/api/v0/order?vendorId=${vendorId}`,
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
      let link = `http://${process.env.MICROSERVICE_URL || 'localhost'}:3012/api/v0/order/${orderId}`;
      if (order.quantity) {
        link += `?quantity=${order.quantity}`;
      }
      if (order.shipped) {
        link += `?shipped=${order.shipped}`;
      }
      if (order.delivered) {
        link += `?delivered=${order.delivered}`;
      }
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
          console.log(err);
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
