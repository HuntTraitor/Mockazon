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
    // FIXME: This endpoint needs to be converted to POST maybe
    const result = await fetch(
      `http://${process.env.MICROSERVICE_URL || 'localhost'}:3014/api/v0/shopper/login?sub=${sub.sub}`,
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
