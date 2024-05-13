import {
  AuthenticatedWithId,
  Credentials,
  SignUpResponse,
  Sub,
} from './schema';
import { GraphQLError } from 'graphql/error';
import { SessionUser } from '@/graphql/types/next';

export class AuthService {
  public async signUp(credentials: Credentials): Promise<SignUpResponse> {
    const result = await fetch(
      `http://${process.env.MICROSERVICE_URL || 'localhost'}:3010/api/v0/authenticate/signup`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      }
    )
      .then(response => {
        if (!response.ok) {
          if (response.status === 409) {
            throw new GraphQLError('Duplicate account');
          }
          throw response;
        }
        return response.json();
      })
      .catch(err => {
        if (err.message === 'Duplicate account') {
          throw new GraphQLError('Duplicate account');
        }
        console.log(err);
        throw new GraphQLError('Internal Server Error');
      });
    return result;
  }

  public async getUserWithSub(sub: Sub): Promise<AuthenticatedWithId | null> {
    const result = await fetch(
      `http://${process.env.MICROSERVICE_URL || 'localhost'}:3010/api/v0/authenticate/user?sub=${sub.sub}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
      .then(response => {
        if (!response.ok) {
          throw response;
        }
        return response.json();
      })
      .then(authenticated => {
        return authenticated;
      })
      .catch(err => {
        console.log(err);
        throw new GraphQLError('Internal Server Error');
      });
    return result;
  }

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
