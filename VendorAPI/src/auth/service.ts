import { SessionUser, UUID } from '../types';

export class AuthService {
  public async check(apiKey?: UUID): Promise<SessionUser> {
    return new Promise((resolve, reject) => {
      if (!apiKey) {
        reject(new Error('Unauthorized'));
      } else {
        fetch(
          `http://${process.env.MICROSERVICE_URL || 'localhost'}:3013/api/v0/key/validate?apiKey=${apiKey}`,
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
          .then(sessionUser => {
            resolve({ id: sessionUser.vendor_id });
          })
          .catch(() => {
            reject(new Error('Unauthorized'));
          });
      }
    });
  }

  public async checkOwnership(
    vendor_id?: UUID,
    order_id?: UUID
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      fetch(
        `http://${process.env.MICROSERVICE_URL || 'localhost'}:3012/api/v0/order/${order_id}`,
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
        .then(data => {
          resolve(data.vendor_id === vendor_id);
        })
        .catch(() => {
          reject(new Error('Unauthorized'));
        });
    });
  }
}
