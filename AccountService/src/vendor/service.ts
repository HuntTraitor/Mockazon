import { pool } from "../db";
import { Authenticated, Credentials } from "../types";
import * as jwt from "jsonwebtoken";
import { CreateVendor } from "./index";

export class VendorService {
  public async login(
    credentials: Credentials,
  ): Promise<Authenticated | undefined> {
    const select =
      `SELECT * FROM vendor` +
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
          expiresIn: "30m",
          algorithm: "HS256",
        },
      );
      return { id: user.id, name: user.data.name, accessToken: accessToken };
    } else {
      return undefined;
    }
  }

  public async createVendorAccount(vendor: CreateVendor) {
    const insert = `INSERT INTO request(data) VALUES (
      jsonb_build_object(
        'name', $1::text, 
        'email', $2::text, 
        'pwhash', crypt($3::text, '87'),
        'role', 'vendor'
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
