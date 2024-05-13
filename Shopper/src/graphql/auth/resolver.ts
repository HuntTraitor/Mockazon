import { Args, Mutation, Query, Resolver } from 'type-graphql';
import {
  AuthenticatedWithId,
  Credentials,
  SignUpResponse,
  Sub,
} from './schema';
import { AuthService } from '@/graphql/auth/service';

@Resolver()
export class AuthResolver {
  @Mutation(() => SignUpResponse)
  async signUp(
    @Args() credentials: Credentials
  ): Promise<SignUpResponse | null> {
    return new AuthService().signUp(credentials);
  }

  @Query(() => AuthenticatedWithId)
  async login(@Args() sub: Sub): Promise<AuthenticatedWithId | null> {
    return new AuthService().getUserWithSub(sub);
  }
}
