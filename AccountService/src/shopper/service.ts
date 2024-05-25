import { CreateUserInput, LoginInput, ShippingAddress, Order } from ".";
import { SessionUser, Account } from "../types";
import { pool } from "../db";
import * as jwt from "jsonwebtoken";

export class ShopperService {
  // sub stands for subject and is the unique google identifier
  public async login(loginInput: LoginInput) {
    const { sub, email, password } = loginInput;
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

    const { rows } = await pool.query(query);
    console.log(rows[0]);
    if (rows[0]) {
      const user = rows[0];
      const accessToken = jwt.sign(
        {
          id: user.id,
          role: user.data.role,
        },
        `${process.env.MASTER_SECRET}`,
        {
          expiresIn: "1d",
          algorithm: "HS256",
        },
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
    const { sub, email, name, password } = data;
    const select = `SELECT * FROM shopper WHERE data->>'email' = $1`;
    const { rows: existingUsers } = await pool.query(select, [email]);
    if (existingUsers[0]) {
      return undefined;
    }

    const insert = `
      INSERT INTO shopper(data) 
      VALUES (
        jsonb_build_object(
          'sub', $1::text, 
          'email', $2::text, 
          'name', $3::text, 
          'role', $4::text, 
          'suspended', false, 
          'pwhash', crypt($5::text, '87')
        )
      ) 
      RETURNING *`;
    const query = {
      text: insert,
      values: [sub, email, name, "Shopper", password],
    };
    const result = await pool.query(query);
    const rows = result.rows;

    const user = rows[0];
    const accessToken = jwt.sign(
      {
        id: user.id,
        role: user.data.role,
      },
      `${process.env.MASTER_SECRET}`,
      {
        expiresIn: "1d",
        algorithm: "HS256",
      },
    );

    return {
      ...user,
      accessToken: accessToken,
    };
  }

  public async check(accessToken: string): Promise<SessionUser> {
    return new Promise((resolve, reject) => {
      try {
        jwt.verify(
          accessToken,
          `${process.env.MASTER_SECRET}`,
          (err: jwt.VerifyErrors | null, decoded?: object | string) => {
            if (err) {
              reject(err);
            }
            const account = decoded as Account;
            resolve({ id: account.id, role: account.role });
          },
        );
      } catch (e) {
        reject(e);
      }
    });
  }

  public async getShippingInfo(userId: string): Promise<string[] | undefined> {
    try {
      const select = `SELECT * FROM shopper WHERE id = $1`;
      const query = {
        text: select,
        values: [`${userId}`],
      };
      const { rows } = await pool.query(query);
      if (rows[0].data.shippingInfo) {
        return rows[0].data.shippingInfo;
      } else {
        return [];
      }
    } catch (error) {
      return undefined;
    }
  }

  public async createShippingInfo(data: {
    userId: string;
    shippingInfo: ShippingAddress;
  }): Promise<string[]> {
    try {
      const select = `SELECT * FROM shopper WHERE id = $1`;
      const { rows } = await pool.query({
        text: select,
        values: [`${data.userId}`],
      });

      const currentShippingInfo = rows[0]?.data.shippingInfo || [];

      const updatedShippingInfo = [...currentShippingInfo, data.shippingInfo];

      const update = `UPDATE shopper SET data = jsonb_set(data, '{shippingInfo}', $1::jsonb) WHERE id = $2 RETURNING *`;
      const query = {
        text: update,
        values: [JSON.stringify(updatedShippingInfo), `${data.userId}`],
      };
      const { rows: updatedRows } = await pool.query(query);
      return updatedRows[0].data.shippingInfo;
    } catch (error) {
      throw new Error("Failed to add shipping info");
    }
  }

  public async getOrderHistory(userId: string): Promise<string[] | undefined> {
    try {
      const select = `SELECT * FROM shopper WHERE id = $1`;
      const query = {
        text: select,
        values: [`${userId}`],
      };
      const { rows } = await pool.query(query);

      if (rows[0].data.orderHistory) {
        return rows[0].data.orderHistory;
      } else {
        return [];
      }
    } catch (error) {
      return undefined;
    }
  }

  public async createOrderHistory(data: {
    userId: string;
    order: Order;
  }): Promise<string[]> {
    try {
      const select = `SELECT * FROM shopper WHERE id = $1`;
      const { rows } = await pool.query({
        text: select,
        values: [`${data.userId}`],
      });
      const currentOrderHistory = rows[0]?.data.orderHistory || [];

      const updatedOrderHistory = [...currentOrderHistory, data.order];
      const update = `UPDATE shopper SET data = jsonb_set(data, '{orderHistory}', $1::jsonb) WHERE id = $2 RETURNING *`;
      const query = {
        text: update,
        values: [JSON.stringify(updatedOrderHistory), `${data.userId}`],
      };
      const { rows: updatedRows } = await pool.query(query);
      return updatedRows[0].data.orderHistory;
    } catch (error) {
      throw new Error("Failed to add order history");
    }
  }
}
