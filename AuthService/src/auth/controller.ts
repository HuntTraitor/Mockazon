import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Response,
  Route,
  SuccessResponse,
} from 'tsoa';

import { Authenticated, CreateVendor, Credentials } from '.';
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
          return account;
        }
      )
      .catch(() => {
        this.setStatus(401);
        return undefined;
      });
  }
  // sub stands for subject and is the unique google identifier
  @Get('user')
  public async getUserWithSub(@Query() sub: string) {
    const user = await new AuthService().getUserWithSub(sub);
    if (!user) {
      this.setStatus(404);
    }
    return user;
  }

  // sub stands for subject and is the unique google identifier
  @Post('signup')
  public async createUserWithSub(
    @Body() data: { sub: string; email: string; name: string }
  ) {
    const user = await new AuthService().createUserWithSub(data);
    if (!user) {
      this.setStatus(400);
      return;
    }
    return {
      id: user.id,
      name: user.data.name,
      email: user.data.email,
      role: user.data.role,
      sub: user.data.sub,
    };
  }

  @Post('/vendor/signup')
  @SuccessResponse('201', 'Account Created')
  public async createVendor(@Body() credentials: CreateVendor) {
    const user = await new AuthService().createVendorAccount(credentials);
    if (!user) {
      this.setStatus(400);
      return;
    }
    return {
      id: user.id,
      name: user.data.name,
      email: user.data.email,
      role: user.data.role,
      sub: user.data.sub,
    };
  }
}
