import { Key } from './schema';

export class KeyService {
  public async list(vendor_id: string): Promise<Key[]>  {
    return new Promise((resolve, reject) => {
      fetch(`http://${process.env.MICROSERVICE_URL || 'localhost'}:3013/api/v0/key/${vendor_id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw res
          }
          return res.json()
        })
        .then((product) => {
          resolve(product)
        })
        .catch(() => {
          reject(new Error("Error retrieving keys for this vendor"))
        });
    });
  }

  // public async setActiveStatus(key: string): Promise<Key>  {
  //   return new Promise((resolve, reject) => {
  //     fetch(`http://${process.env.MICROSERVICE_URL || 'localhost'}:3013/api/v0/key/${key}`, {
  //       method: 'GET',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //     })
  //       .then((res) => {
  //         if (!res.ok) {
  //           throw res
  //         }
  //         return res.json()
  //       })
  //       .then((product) => {
  //         resolve(product)
  //       })
  //       .catch(() => {
  //         reject(new Error("Error retrieving keys for this vendor"))
  //       });
  //   });
  // }
}
