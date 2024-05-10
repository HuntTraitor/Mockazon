import { SessionUser } from '../../types/next';
import { Credentials, Authenticated, Message } from './schema';
import { GraphQLError } from 'graphql';

interface User {
  id: string;
  email: string;
  name: string;
  roles: string[];
}

export class AuthService {
  public async signup(credentials: Credentials): Promise<Message> {
    return new Promise((resolve, reject) => {
      resolve({
        content: 'Signup Request sent!!',
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
    return new Promise((resolve, reject) => {
      resolve({ id: '123' });
    });
  }
}
