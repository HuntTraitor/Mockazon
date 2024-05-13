import { GraphQLError } from 'graphql';
import { SessionUser } from '../../types/next';
import { Credentials, Message } from './schema';

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
        `http://${process.env.MICROSERVICE_URL || 'localhost'}:3014/api/v0/authenticate/vendor/signup`,
        {
          method: 'POST',
          body: JSON.stringify(credentials),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
        .then(res => {
          console.log(res);
          if (!res.ok) {
            throw res;
          }
          return res.json();
        })
        .then(() => {
          resolve({ content: 'Account successfully requested' });
        })
        .catch(err => {
          console.log(err);
          reject(new GraphQLError('Request failed, please try again'));
        });
    });
  }

  // public async login(credentials: Credentials): Promise<Authenticated>  {
  //   return new Promise((resolve, reject) => {
  //     fetch('http://localhost:3011/api/v0/authenticate', {
  //       method: 'POST',
  //       body: JSON.stringify(credentials),
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
  //       .then((authenticated) => {
  //         resolve(authenticated)
  //       })
  //       .catch((err) => {
  //         console.log(err)
  //         reject(new Error("Unauthorised"))
  //       });
  //   });
  // }

  public async check(
    authHeader?: string,
    scopes?: string[]
  ): Promise<SessionUser> {
    console.log(authHeader);
    console.log(scopes);
    return new Promise(resolve => {
      resolve({ id: '123' });
    });
  }
}
