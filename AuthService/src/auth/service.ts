import * as jwt from "jsonwebtoken";

/* Microservice book example */
import { Authenticated, Credentials } from ".";
import { pool } from "../db";
import { SessionUser } from "../types";

export class AuthService {
  public async login(
    credentials: Credentials,
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
        },
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
          expiresIn: "30m",
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
}
