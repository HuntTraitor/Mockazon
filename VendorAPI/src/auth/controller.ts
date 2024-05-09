import {
  Post,
  Route,
  Response,
  Body,
  Controller,
  Get,
  Security,
  Request,
} from 'tsoa';
import { VendorInfo } from '.';
import { SessionUser } from '../types';

@Route('authtest')
export class AuthController extends Controller {
  @Post()
  @Security('ApiKeyAuth')
  @Response('401', 'Unauthorized')
  public async authtest(
    @Request() request: Express.Request
  ): Promise<SessionUser | undefined> {
    return request.user;
  }
}
