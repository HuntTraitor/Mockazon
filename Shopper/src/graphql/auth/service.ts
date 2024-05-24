import {
  AuthenticatedWithId,
  Credentials,
  GoogleCredentials,
  SignUpResponse,
} from './schema';
import { GraphQLError } from 'graphql/error';
import { SessionUser } from '@/graphql/types/next';

export class AuthService {
  public async signUpGoogle(
    credentials: GoogleCredentials
  ): Promise<SignUpResponse> {
    const result = await fetch(
      `http://${process.env.MICROSERVICE_URL || 'localhost'}:3014/api/v0/shopper/signup`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      }
    ).then(response => {
      if (!response.ok) {
        if (response.status === 409) {
          throw new GraphQLError('Duplicate account');
        }
        throw response;
      }
      return response.json();
    });
    return result;
  }

  public async signUp(credentials: Credentials): Promise<SignUpResponse> {
    const result = await fetch(
      `http://${process.env.MICROSERVICE_URL || 'localhost'}:3014/api/v0/shopper/signup`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      }
    ).then(response => {
      if (!response.ok) {
        if (response.status === 409) {
          throw new GraphQLError('Duplicate account');
        }
        throw response;
      }
      return response.json();
    });
    return result;
  }

  public async loginGoogle(sub: string): Promise<AuthenticatedWithId | null> {
    const result = await fetch(
      `http://${process.env.MICROSERVICE_URL || 'localhost'}:3014/api/v0/shopper/login`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sub }),
      }
    )
      .then(response => {
        if (!response.ok) {
          throw new GraphQLError('Login error');
        }
        return response.json();
      })
      .then(authenticated => {
        return authenticated;
      });
    return result;
  }

  public async login(credentials: { email: string; password: string }) {
    const result = await fetch(
      `http://${process.env.MICROSERVICE_URL || 'localhost'}:3014/api/v0/shopper/login`,
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
          throw new GraphQLError('Login error');
        }
        return response.json();
      })
      .then(authenticated => {
        return authenticated;
      });
    return result;
  }

  public async check(authHeader?: string): Promise<SessionUser> {
    return new Promise((resolve, reject) => {
      if (!authHeader) {
        // console.error('No Authorization header provided');
        reject(new GraphQLError('Unauthorized'));
      } else {
        const tokens = authHeader.split(' ');
        if (tokens.length != 2 || tokens[0] !== 'Bearer') {
          console.error('Invalid Authorization header format');
          reject(new GraphQLError('Unauthorized'));
        } else {
          fetch(
            `http://localhost:3014/api/v0/shopper/check?accessToken=${tokens[1]}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            }
          )
            .then(async res => {
              if (!res.ok) {
                console.error('Response not OK:', res.status);
                throw new GraphQLError(await res.text());
              }
              const sessionUser = await res.json();
              console.log('Session user fetched:', sessionUser);
              return sessionUser;
            })
            .then(sessionUser => {
              console.log('Resolved session user:', sessionUser);
              resolve({ id: sessionUser.id });
            })
            .catch(error => {
              console.error('Fetch error:', error);
              reject(new GraphQLError('Unauthorized'));
            });
        }
      }
    });
  }
}
