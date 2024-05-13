import { pool } from "../db";
import * as jwt from "jsonwebtoken";

export class ShopperService {
  // sub stands for subject and is the unique google identifier
  public async getUserWithSub(sub: string) {
    const select = `SELECT * FROM shopper` + ` WHERE data->>'sub' = $1`;
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
          expiresIn: "30m",
          algorithm: "HS256",
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
    const insert = `INSERT INTO shopper(data) VALUES (jsonb_build_object('sub', $1::text, 'email', $2::text, 'name', $3::text, 'role', $4::text)) RETURNING *`;
    const query = {
      text: insert,
      values: [data.sub, data.email, data.name, "Shopper"],
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
          expiresIn: "30m",
          algorithm: "HS256",
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
