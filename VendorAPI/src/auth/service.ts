import { Credentials, Authenticated } from '.';
import { SessionUser, UUID } from '../types';

export class AuthService {
  public async request(credentials: Credentials): Promise<Authenticated> {
    return new Promise((resolve, reject) => {
      fetch(
        `http://${
          process.env.MICROSERVICE_URL || 'localhost'
        }:3010/api/v0/authenticate`,
        {
          method: 'POST',
          body: JSON.stringify(credentials),
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
          console.log('resolved');
          resolve(authenticated);
        })
        .catch(err => {
          console.log(err);
          reject(new Error('Unauthorized'));
        });
    });
  }

  public async check(apiKey?: UUID): Promise<SessionUser> {
    return new Promise((resolve, reject) => {
      if (!apiKey) {
        reject(new Error('Unauthorized'));
      } else {
        fetch(
          `http://${process.env.MICROSERVICE_URL || 'localhost'}:3013/api/v0/key/validate?apiKey=` +
            apiKey,
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
}
