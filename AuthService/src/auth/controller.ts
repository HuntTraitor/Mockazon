import { Body, Controller, Get, Post, Query, Response, Route } from 'tsoa';

import { Authenticated, Credentials } from '.';
import { SessionUser } from '../types';
import { AuthService } from './service';

@Route('authenticate')
export class AuthController extends Controller {
  @Post()
  @Response('401', 'Unauthorised')
  public async login(
    @Body() credentials: Credentials
  ): Promise<Authenticated | undefined> {
    return new AuthService()
      .login(credentials)
      .then(
        async (
          user: Authenticated | undefined
        ): Promise<Authenticated | undefined> => {
          if (!user) {
            this.setStatus(401);
          }
          return user;
        }
      );
  }

  @Get()
  @Response('401', 'Unauthorized')
  public async check(
    @Query() accessToken: string
  ): Promise<SessionUser | undefined> {
    return new AuthService()
      .check(accessToken)
      .then(
        async (
          account: SessionUser | undefined
        ): Promise<SessionUser | undefined> => {
          if (!account) {
            this.setStatus(401);
          }
          return account;
        }
      );
  }
}
