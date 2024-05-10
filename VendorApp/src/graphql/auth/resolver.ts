import { Args, Query, Resolver } from 'type-graphql';
import {
  Authenticated,
  Credentials,
  Message,
  SignupCredentials,
} from './schema';
import { AuthService } from './service';

@Resolver()
export class AuthResolver {
  @Query(() => Message)
  async signup(@Args() credentials: SignupCredentials): Promise<Message> {
    return new AuthService().signup(credentials);
  }

  // @Query(() => Authenticated)
  // async login(
  //   @Args() credentials: Credentials,
  // ): Promise<Authenticated> {
  //   return new AuthService().login(credentials)
  // }
}
