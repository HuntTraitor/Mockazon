import {Request} from 'express'
import { AuthService } from './service'
import { SessionUser } from '../types'

export function expressAuthentication(
  request: Request,
  securityName: string,
  scopes?: string[]
): Promise<SessionUser> {
  return new AuthService().check(request.headers.authorization, scopes);
}