import { User, UUID } from "../types";
import { pool } from "../db";
import { Credentials, Authenticated } from "../types";
// import { SessionUser } from "../types";
import * as jwt from "jsonwebtoken";
import { Vendor } from "../vendor";

export class AdminService {
  public async login(
    credentials: Credentials,
  ): Promise<Authenticated | undefined> {
    const select =
      `SELECT * FROM administrator` +
      ` WHERE data->>'email' = $1` +
      ` AND crypt($2, data->>'pwhash') = data->>'pwhash'`;

    const query = {
      text: select,
      values: [credentials.email, credentials.password],
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
        },
      );
      return { id: user.id, name: user.data.name, accessToken: accessToken };
    } else {
      return undefined;
    }
  }

  // public async check(accessToken: string): Promise<SessionUser | undefined> {
  //   return new Promise((resolve, reject) => {
  //     jwt.verify(
  //       accessToken,
  //       `${process.env.MASTER_SECRET}`,
  //       (err: jwt.VerifyErrors | null, decoded?: object | string) => {
  //         if (err) {
  //           reject(err);
  //         }
  //         const account = decoded as SessionUser;
  //         resolve({ id: account.id, role: account.role });
  //       }
  //     );
  //   });
  // }

  public async accounts(): Promise<User[]> {
    const shopperQuery = {
      text: `
        SELECT
          id AS shopper_id,
          data->>'email' AS shopper_email,
          data->>'name' AS shopper_name,
          data->>'role' AS shopper_role,
          (data->>'suspended')::boolean AS shopper_suspended
        FROM
          shopper
      `,
    };

    const vendorQuery = {
      text: `
        SELECT
          id AS vendor_id,
          data->>'email' AS vendor_email,
          data->>'name' AS vendor_name,
          data->>'role' AS vendor_role,
          (data->>'suspended')::boolean AS vendor_suspended
        FROM
          vendor
      `,
    };

    const { rows: shopperRows } = await pool.query(shopperQuery);
    const shoppers: User[] = shopperRows.map((row) => ({
      id: row.shopper_id,
      email: row.shopper_email,
      name: row.shopper_name,
      role: row.shopper_role,
      suspended: row.shopper_suspended,
    }));

    const { rows: vendorRows } = await pool.query(vendorQuery);
    const vendors: User[] = vendorRows.map((row) => ({
      id: row.vendor_id,
      email: row.vendor_email,
      name: row.vendor_name,
      role: row.vendor_role,
      suspended: row.vendor_suspended,
    }));

    const users: User[] = [...shoppers, ...vendors];

    return users;
  }

  public async requests(): Promise<User[]> {
    const select = `SELECT * FROM request ORDER BY created_at DESC`;
    const query = {
      text: select,
      values: [],
    };
    const { rows } = await pool.query(query);
    const users: User[] = rows.map((row) => ({
      id: row.id,
      email: row.data.email,
      name: row.data.name,
      role: row.data.role,
      suspended: row.data.suspended,
    }));

    return users;
  }

  public async suspend(id: UUID): Promise<void> {
    const shopperQuery = {
      text: "UPDATE shopper SET data = jsonb_set(data, '{suspended}', to_jsonb(true), false) WHERE id = $1",
      values: [id],
    };
    const vendorQuery = {
      text: "UPDATE vendor SET data = jsonb_set(data, '{suspended}', to_jsonb(true), false) WHERE id = $1",
      values: [id],
    };

    try {
      const shopperResult = await pool.query(shopperQuery);
      const vendorResult = await pool.query(vendorQuery);

      if (shopperResult.rowCount === 0 && vendorResult.rowCount === 0) {
        throw new Error("No matching user found");
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async resume(id: UUID): Promise<void> {
    const shopperQuery = {
      text: "UPDATE shopper SET data = jsonb_set(data, '{suspended}', to_jsonb(false), false) WHERE id = $1",
      values: [id],
    };
    const vendorQuery = {
      text: "UPDATE vendor SET data = jsonb_set(data, '{suspended}', to_jsonb(false), false) WHERE id = $1",
      values: [id],
    };

    try {
      const shopperResult = await pool.query(shopperQuery);
      const vendorResult = await pool.query(vendorQuery);

      if (shopperResult.rowCount === 0 && vendorResult.rowCount === 0) {
        throw new Error("No matching user found");
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async approve(id: string): Promise<Vendor> {
    const query = {
      text: "SELECT data FROM request WHERE id = $1",
      values: [id],
    };

    const { rows } = await pool.query(query);

    if (rows.length === 0) {
      throw new Error("Request not found");
    }

    const data = rows[0].data;

    const insertQuery = {
      text: "INSERT INTO vendor (data) VALUES ($1)",
      values: [data],
    };

    await pool.query(insertQuery);

    const deleteQuery = {
      text: "DELETE FROM request WHERE id = $1 RETURNING *",
      values: [id],
    };

    const res = await pool.query(deleteQuery);
    const user: Vendor = {
      id: res.rows[0].id,
      email: res.rows[0].data.email,
      name: res.rows[0].data.name,
      role: res.rows[0].data.role,
      suspended: res.rows[0].data.suspended,
    };
    return user;
  }

  public async reject(id: string): Promise<void> {
    const query = {
      text: "DELETE FROM request WHERE id = $1",
      values: [id],
    };
    await pool.query(query);
    return;
  }
}
