import * as jwt from 'jsonwebtoken';

/* Microservice book example */
import { Authenticated, CreateVendor, Credentials } from '.';
import { pool } from '../db';
import { SessionUser } from '../types';

export class AuthService {
  public async login(
    credentials: Credentials
  ): Promise<Authenticated | undefined> {
    const select =
      `SELECT * FROM account` +
      ` WHERE data->>'email' = $1` +
      ` AND crypt($2, data->>'pwhash') = data->>'pwhash'`;

    const query = {
      text: select,
      values: [credentials.email, credentials.password],
    };
    const { rows } = await pool.query(query);

    console.log(credentials);

    if (rows[0]) {
      const user = rows[0];
      const accessToken = jwt.sign(
        {
          id: user.id,
          role: user.data.role,
        },
        `${process.env.MASTER_SECRET}`,
        {
          expiresIn: '30m',
          algorithm: 'HS256',
        }
      );
      return { id: user.id, name: user.data.name, accessToken: accessToken };
    } else {
      return undefined;
    }
  }

  public async check(accessToken: string): Promise<SessionUser | undefined> {
    return new Promise((resolve, reject) => {
      jwt.verify(
        accessToken,
        `${process.env.MASTER_SECRET}`,
        (err: jwt.VerifyErrors | null, decoded?: object | string) => {
          if (err) {
            reject(err);
          }
          const account = decoded as SessionUser;
          resolve({ id: account.id, role: account.role });
        }
      );
    });
  }

  // sub stands for subject and is the unique google identifier
  public async getUserWithSub(sub: string) {
    const select = `SELECT * FROM account` + ` WHERE data->>'sub' = $1`;
    const query = {
      text: select,
      values: [sub],
    };
    const { rows } = await pool.query(query);
    if (rows[0]) {
      const user = rows[0];
      const accessToken = jwt.sign(
        {
          id: user.id,
          role: user.data.role,
        },
        `${process.env.MASTER_SECRET}`,
        {
          expiresIn: '30m',
          algorithm: 'HS256',
        }
      );
      return {
        id: user.id,
        name: user.data.name,
        accessToken: accessToken,
        role: user.data.role,
      };
    } else {
      return undefined;
    }
  }

  public async createUserWithSub(data: {
    sub: string;
    email: string;
    name: string;
  }) {
    const insert = `INSERT INTO account(data) VALUES (jsonb_build_object('sub', $1::text, 'email', $2::text, 'name', $3::text, 'role', $4::text)) RETURNING *`;
    const query = {
      text: insert,
      values: [data.sub, data.email, data.name, 'Shopper'],
    };
    let rows;
    try {
      const result = await pool.query(query);
      rows = result.rows;
    } catch (exception) {
      console.log(exception);
    }
    if (rows && rows[0]) {
      const user = rows[0];
      const accessToken = jwt.sign(
        {
          id: user.id,
          role: user.data.role,
        },
        `${process.env.MASTER_SECRET}`,
        {
          expiresIn: '30m',
          algorithm: 'HS256',
        }
      );
      return {
        ...user,
        accessToken: accessToken,
      };
    } else {
      return undefined;
    }
  }

  public async createVendorAccount(vendor: CreateVendor) {
    const insert = `INSERT INTO account(data) VALUES (
      jsonb_build_object(
        'name', $1::text, 
        'email', $2::text, 
        'pwhash', crypt($3::text, '87'),
        'role', 'pending_vendor'
      )) 
    RETURNING *`;

    const query = {
      text: insert,
      values: [vendor.name, vendor.email, vendor.password],
    };
    let rows;
    try {
      const result = await pool.query(query);
      rows = result.rows;
    } catch (e) {
      console.log(e);
    }
    if (rows && rows[0]) {
      return rows[0];
    } else {
      return undefined;
    }
  }
}
