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

  // FIXME: This function is not implemented
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
