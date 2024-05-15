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

    if (rows[0]) {
      const user = rows[0];
      const accessToken = jwt.sign(
        {
          id: user.id,
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
    const insert = `
      INSERT INTO request(data) 
      VALUES (
        jsonb_build_object(
          'email', $1::text,
          'pwhash', crypt($2::text, gen_salt('bf')),
          'name', $3::text,
          'role', 'vendor',
          'suspended', false
        )
      )
      RETURNING *
    `;

    const query = {
      text: insert,
      values: [vendor.email, vendor.password, vendor.name],
    };

    let rows;
    try {
      const result = await pool.query(query);
      rows = result.rows;
    } catch (e) {
      console.error("Error creating vendor account:", e);
      throw e;
    }

    if (rows && rows[0]) {
      return rows[0];
    } else {
      throw new Error("Failed to create vendor account");
    }
  }
}
