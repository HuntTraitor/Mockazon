import { Request } from 'express';
import { SessionUser } from '../types';
import { AuthService } from './service';

export function expressAuthentication(
  request: Request,
  securityName: string,
  scopes?: string[]
): Promise<SessionUser> {
  return new AuthService().check(request.headers.authorization, scopes);
}
