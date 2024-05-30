import { Key } from './schema';

export class KeyService {
  public async list(vendor_id: string): Promise<Key[]> {
    return new Promise(resolve => {
      fetch(
        `http://${process.env.MICROSERVICE_URL || 'localhost'}:3013/api/v0/key/${vendor_id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
        .then(res => {
          return res.json();
        })
        .then(product => {
          resolve(product);
        });
    });
  }

  public async setActiveStatus(key: string): Promise<Key> {
    return new Promise((resolve, reject) => {
      fetch(
        `http://${process.env.MICROSERVICE_URL || 'localhost'}:3013/api/v0/key/${key}/active`,
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
        .then(product => {
          resolve(product);
        })
        .catch(() => {
          reject(new Error('Error setting active status'));
        });
    });
  }

  public async postAPIKeyRequest(vendor_id: string): Promise<Key> {
    return new Promise(resolve => {
      fetch(
        `http://${process.env.MICROSERVICE_URL || 'localhost'}:3013/api/v0/key/${vendor_id}/request`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
        .then(res => {
          return res.json();
        })
        .then(product => {
          resolve(product);
        });
    });
  }
}
