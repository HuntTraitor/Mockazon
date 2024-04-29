import {Request} from "express";
import {AuthService} from './authService';
import {SessionUser} from '../types';

export function expressAuthentication(
  request: Request,
  securityName: string,
  scopes?: string[]
): Promise<SessionUser> {
  return new AuthService().check(request.headers.authorization, scopes);
}