import {CreateUserInput, LoginInput} from '.';
import {pool} from '../db';
import * as jwt from 'jsonwebtoken';

export class ShopperService {
  // sub stands for subject and is the unique google identifier
  public async login(loginInput: LoginInput) {
    const {sub, email, password} = loginInput;

    console.log('logging in', loginInput);
    let select;
    let values;

    if (sub) {
      select = `SELECT * FROM shopper WHERE data->>'sub' = $1`;
      values = [sub];
    } else {
      select = `SELECT * FROM shopper WHERE data->>'email' = $1 
                AND crypt($2, data->>'pwhash') = data->>'pwhash'`;
      values = [email, password];
    }

    const query = {
      text: select,
      values: values,
    };

    const {rows} = await pool.query(query);
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

  public async createUser(data: CreateUserInput) {
    const insert = `INSERT INTO shopper(data) VALUES (jsonb_build_object('sub', $1::text, 'email', $2::text, 'name', $3::text, 'username', 'temp', 'role', $4::text, 'suspended', false, 'password', $5::text)) RETURNING *`;
    const query = {
      text: insert,
      values: [data.sub, data.email, data.name, 'Shopper', data.password],
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
}
