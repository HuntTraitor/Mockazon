import { GraphQLError } from 'graphql';
import { SessionUser } from '../../types/next';
import { Credentials, Message } from './schema';
import { Authenticated } from './schema';

// interface User {
//   id: string;
//   email: string;
//   name: string;
//   roles: string[];
// }

export class AuthService {
  public async signup(credentials: Credentials): Promise<Message> {
    return new Promise((resolve, reject) => {
      fetch(
        `http://${process.env.MICROSERVICE_URL || 'localhost'}:3014/api/v0/vendor/signup`,
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
        .then(() => {
          resolve({ content: 'Account successfully requested' });
        })
        .catch(() => {
          reject(new GraphQLError('Request failed, please try again'));
        });
    });
  }

  public async login(credentials: Credentials): Promise<Authenticated> {
    return new Promise((resolve, reject) => {
      fetch(`http://${process.env.MICROSERVICE_URL || 'localhost'}:3014/api/v0/vendor/login`, {
        method: 'POST',
        body: JSON.stringify(credentials),
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
        .catch(() => {
          reject(new GraphQLError('Unauthorised'));
        });
    });
  }

  public async check(authHeader?: string): Promise<SessionUser> {
    return new Promise((resolve, reject) => {
      if (!authHeader) {
        reject(new GraphQLError('Unauthorized'));
      } else {
        const tokens = authHeader.split(' ');
        if (tokens.length != 2 || tokens[0] !== 'Bearer') {
          reject(new GraphQLError('Unauthorized'));
        } else {
          fetch(
            `http://${process.env.MICROSERVICE_URL || 'localhost'}:3014/api/v0/vendor/check?accessToken=` +
              tokens[1],
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
              resolve({ id: sessionUser.id });
            })
            .catch(() => {
              reject(new GraphQLError('Unauthorized'));
            });
        }
      }
    });
  }
}
