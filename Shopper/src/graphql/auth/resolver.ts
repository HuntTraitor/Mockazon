import { Args, Mutation, Query, Resolver } from 'type-graphql';
import {
  AuthenticatedWithId,
  SignUpResponse,
  SignUpArgs,
  LoginInput,
} from './schema';
import { AuthService } from '@/graphql/auth/service';

@Resolver()
export class AuthResolver {
  @Mutation(() => SignUpResponse)
  async signUp(
    @Args() { credentials, googleCredentials }: SignUpArgs
  ): Promise<SignUpResponse | null> {
    if (googleCredentials && credentials) {
      throw new Error('Invalid input');
    } else if (googleCredentials) {
      return new AuthService().signUpGoogle(googleCredentials);
    } else if (credentials) {
      return new AuthService().signUp(credentials);
    } else {
      throw new Error('Invalid input');
    }
  }

  @Query(() => AuthenticatedWithId)
  async login(
    @Args() { sub, email, password }: LoginInput
  ): Promise<AuthenticatedWithId | null> {
    if (sub) {
      return new AuthService().loginGoogle(sub);
    } else if (email && password) {
      return new AuthService().login({ email, password });
    } else {
      throw new Error('Invalid input');
    }
  }
}
