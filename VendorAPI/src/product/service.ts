/**
 * This service must communicate with the ProductService
 */

import { UUID } from '../types';
import type { NewProduct, Product } from './index';

export class ProductService {
  async getProducts(
    vendorId?: UUID,
    active?: boolean,
    page?: number,
    pageSize?: number,
    search?: string,
    orderBy?: string,
    descending?: boolean
  ): Promise<Product[] | undefined> {
    return new Promise((resolve, reject) => {
      const array = [];
      let url = `http://${process.env.MICROSERVICE_URL || 'localhost'}:3011/api/v0/product?`;
      if (vendorId) {
        array.push(`vendorId=${vendorId}`);
      }
      if (active !== undefined) {
        array.push(`active=${active}`);
      }
      if (page) {
        array.push(`page=${page}`);
      }
      if (pageSize) {
        array.push(`pageSize=${pageSize}`);
      }
      if (search) {
        array.push(`search=${search}`);
      }
      if (orderBy) {
        array.push(`orderBy=${orderBy}`);
      }
      if (descending) {
        array.push(`descending=${descending}`);
      }
      if (array.length) {
        url += array.join('&');
      }
      fetch(url, {
        method: 'GET',
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
        .then(authenticated => {
          resolve(authenticated);
        })
        .catch(err => {
          console.log(err);
          reject(err);
        });
    });
  }

  async create(product: NewProduct, vendor_id?: UUID): Promise<Product> {
    console.log(
      `http://${process.env.MICROSERVICE_URL || 'localhost'}:3011/api/v0/product?vendorId=${vendor_id}`
    );
    return new Promise((resolve, reject) => {
      fetch(
        `http://${process.env.MICROSERVICE_URL || 'localhost'}:3011/api/v0/product?vendorId=${vendor_id}`,
        {
          method: 'POST',
          body: JSON.stringify(product),
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

  async edit(productId: UUID, product: NewProduct): Promise<Product> {
    return new Promise((resolve, reject) => {
      fetch(
        `http://${process.env.MICROSERVICE_URL || 'localhost'}:3011/api/v0/product/${productId}`,
        {
          method: 'PUT',
          body: JSON.stringify(product),
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

  async setActiveStatus(productId: UUID, active: boolean): Promise<Product> {
    return new Promise((resolve, reject) => {
      fetch(
        `http://${process.env.MICROSERVICE_URL || 'localhost'}:3011/api/v0/product/${productId}/setActiveStatus?active=${active}`,
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
