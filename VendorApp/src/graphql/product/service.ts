import { Product } from './schema';

export class ProductService {
  public async list(vendor_id: string): Promise<Product[]> {
    return new Promise((resolve, reject) => {
      fetch(
        `http://${process.env.MICROSERVICE_URL || 'localhost'}:3011/api/v0/product?vendor=${vendor_id}`,
        {
          method: 'GET',
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
        .then(product => {
          resolve(product);
        })
        .catch(() => {
          reject(new Error('Error retrieving products for this vendor'));
        });
    });
  }
}
