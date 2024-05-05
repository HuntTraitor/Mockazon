import { Controller, Path, Post, Route, SuccessResponse } from 'tsoa';

import { Key, UUID } from '.';
import { KeyService } from './service';

@Route('key')
export class KeyController extends Controller {
  @Post('{vendorId}/request')
  @SuccessResponse('201', 'Accepted')
  public async request(@Path() vendorId: UUID): Promise<Key | undefined> {
    const key = await new KeyService().create(vendorId);
    return key;
  }
}
