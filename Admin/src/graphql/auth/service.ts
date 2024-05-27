/*
#######################################################################
#
# Copyright (C) 2022-2024 David C. Harrison. All right reserved.
#
# You may not use, distribute, publish, or modify this code without
# the express written permission of the copyright holder.
#
#######################################################################
*/

import { Credentials, Authenticated } from './schema';
import { SessionUser } from '../../types/next';

export class AuthService {
  public async login(credentials: Credentials): Promise<Authenticated> {
    return new Promise((resolve, reject) => {
      fetch(
        `http://${process.env.MICROSERVICE_URL || 'localhost'}:3014/api/v0/admin/login`,
        {
          method: 'POST',
          body: JSON.stringify(credentials),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
        .then(res => {
          if (!res.ok) {
            throw res;
          }
          return res.json();
        })
        .then(authenticated => {
          resolve(authenticated);
        })
        .catch(err => {
          console.error(err);
          reject(new Error('Unauthorised'));
        });
    });
  }

  public async check(
    authHeader?: string,
    roles?: string[]
  ): Promise<SessionUser> {
    return new Promise((resolve, reject) => {
      if (!authHeader) {
        reject(new Error('Unauthorised'));
      } else {
        const tokens = authHeader.split(' ');
        if (tokens.length != 2 || tokens[0] !== 'Bearer') {
          reject(new Error('Unauthorised'));
        } else {
          fetch(
            'http://localhost:3014/api/v0/admin/check?accessToken=' + tokens[1],
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            }
          )
            .then(res => {
              if (!res.ok) {
                throw res;
              }
              return res.json();
            })
            .then(sessionUser => {
              if (roles) {
                if (!roles.includes(sessionUser.role)) {
                  reject(new Error('Unauthorised'));
                }
              }
              resolve({ id: sessionUser.id });
            })
            .catch(() => {
              reject(new Error('Unauthorised'));
            });
        }
      }
    });
  }
}
