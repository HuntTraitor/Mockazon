import {
  Controller,
  Get,
  Path,
  Put,
  Post,
  Route,
  SuccessResponse,
  Response,
  Query,
} from 'tsoa';

import { Key, SessionUser, UUID, KeyObj } from '.';
import { KeyService } from './service';

@Route('key')
export class KeyController extends Controller {
  @Post('{vendorId}/request')
  @SuccessResponse('201', 'Accepted')
  public async request(@Path() vendorId: UUID): Promise<Key | undefined> {
    const key = await new KeyService().create(vendorId);
    return key;
  }

  @Get('validate')
  @Response('404', 'Not Found')
  public async get(@Query() apiKey: UUID): Promise<SessionUser | undefined> {
    const user = await new KeyService().get(apiKey);
    if (!user) {
      this.setStatus(401);
    }
    return user;
  }

  @Get('{vendorId}')
  public async getKeys(@Path() vendorId: UUID): Promise<KeyObj[]> {
    const keys = await new KeyService().getAll(vendorId);
    return keys;
  }

  @Put('{apiKey}/active')
  @Response('409', 'Error Setting Status')
  public async setActiveStatus(@Path() apiKey: UUID): Promise<Key | undefined> {
    const key = await new KeyService().setActiveStatus(apiKey);
    if (!key) {
      this.setStatus(409);
    }
    return key;
  }
}
