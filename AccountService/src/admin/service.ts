import { User, UUID } from "../types";
import { pool } from "../db";
import { Credentials, Authenticated } from "../types";
// import { SessionUser } from "../types";
import * as jwt from "jsonwebtoken";

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
    const query = {
      text: "SELECT id, data->>'email' AS email, data->>'name' AS name, data->>'username' AS username, data->>'role' AS role, (data->>'suspended')::boolean AS suspended FROM account",
    };
    const { rows } = await pool.query(query);

    const users: User[] = rows.map((row) => ({
      id: row.id,
      email: row.email,
      name: row.name,
      username: row.username,
      role: row.role,
      suspended: row.suspended,
    }));

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
      username: row.data.username,
      role: row.data.role,
      suspended: row.data.suspended,
    }));
    console.log(users);
    return users;
  }

  public async suspend(id: UUID): Promise<void> {
    const query = {
      text: "UPDATE account SET data = jsonb_set(data, '{suspended}', to_jsonb(true), false) WHERE id = $1",
      values: [id],
    };

    await pool.query(query);
  }

  public async resume(id: UUID): Promise<void> {
    const query = {
      text: "UPDATE account SET data = jsonb_set(data, '{suspended}', to_jsonb(false), false) WHERE id = $1",
      values: [id],
    };

    await pool.query(query);
  }

  public async approve(id: string): Promise<void> {
    const query = {
      text: "DELETE FROM request WHERE id = $1",
      values: [id],
    };
    await pool.query(query);

    const updateQuery = {
      text: "UPDATE account SET data = jsonb_set(data, '{role}', '\"vendor\"') WHERE id = $1",
      values: [id],
    };
    await pool.query(updateQuery);

    return;
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
