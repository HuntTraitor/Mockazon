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
  const apiKey = request.headers['x-api-key'] as string;
  return new AuthService().check(apiKey);
}
