import { Request } from 'express';
import { AuthService } from './service';
import { SessionUser } from '../types';

export function expressAuthentication(
  request: Request,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  securityName: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  scopes?: string[]
): Promise<SessionUser> {
  let apiKey;
  if (Array.isArray(request.headers['x-api-key'])) {
    apiKey = request.headers['x-api-key'][0];
  } else {
    apiKey = request.headers['x-api-key'];
  }
  return new AuthService().check(apiKey);
}
