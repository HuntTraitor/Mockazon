import * as jwt from "jsonwebtoken"

import {SessionUser} from "../types"
import {Credentials, Authenticated, User} from '.';
import { pool } from "../db";

export class AuthService {
  public async login(credentials: Credentials): Promise<Authenticated|undefined> {
    const select = 
    `SELECT * FROM member` +
    ` WHERE data->>'email' = $1` +
    ` AND crypt($2, data->>'pwhash') = data->>'pwhash'`

    const query = {
      text: select,
      values: [credentials.email, credentials.password]
    }
    const {rows} = await pool.query(query)

    if (rows[0]) {
      const user = rows[0]
      const accessToken = jwt.sign(
        {id: user.id, email: user.data.email, name: user.data.name, roles: user.data.roles},
        `${process.env.MASTER_SECRET}`, {
          expiresIn: '30m',
          algorithm: 'HS256',
        });
      return {id: user.id, name: user.data.name, accessToken: accessToken}
    } else {
      return undefined
    }
  }


  public async check(authHeader?: string, scopes?: string[]): Promise<SessionUser> {
    return new Promise((resolve, reject) => {
      if (!authHeader) {
        reject(new Error("Unauthorised"))
      } else {
        const token = authHeader.split(' ')[1];
        jwt.verify(token,
          `${process.env.MASTER_SECRET}`,
          (err: jwt.VerifyErrors | null, decoded?: object | string) => {
            const user = decoded as User
            if (err) {
              reject(err);
            } else if (scopes) {
              for (const scope of scopes) {
                if (!user.roles || !user.roles.includes(scope)) {
                  reject(new Error("Unauthorised"))
                }
              }
            }
            resolve({id: user.id, email: user.email, name: user.name})
          }
        )
      }
    })
  }
}