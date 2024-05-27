import { pool } from "../db";
import { Authenticated, Credentials } from "../types";
import * as jwt from "jsonwebtoken";
import { CreateVendor } from "./index";
import { SessionUser, Account } from "../types";

export class VendorService {
  public async exists(email: string): Promise<boolean> {
    const select = `SELECT * FROM request WHERE data->>'email' = $1`;
    const query = {
      text: select,
      values: [email],
    };
    const { rows } = await pool.query(query);

    return rows.length > 0;
  }

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

    const result = await pool.query(query);
    const rows = result.rows;

    return rows[0];
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
}
