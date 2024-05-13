import { User, UUID } from "../types";
import { pool } from "../db";

export class AdminService {
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
    const requestQuery = {
      text: "SELECT account_id, created_at FROM request ORDER BY created_at ASC",
    };
    const { rows: requestRows } = await pool.query(requestQuery);

    const accountIds = requestRows.map((row) => row.account_id);

    const accountQuery = {
      text: "SELECT id, data->>'email' AS email, data->>'name' AS name, data->>'username' AS username, data->>'role' AS role, data->>'suspended' AS suspended FROM account WHERE id = ANY($1)",
      values: [accountIds],
    };
    const { rows: accountRows } = await pool.query(accountQuery);

    const userMap: Record<UUID, User> = {};
    accountRows.forEach((row) => {
      userMap[row.id] = {
        id: row.id,
        email: row.email,
        name: row.name,
        username: row.username,
        role: row.role,
        suspended: row.suspended,
      };
    });

    const users: User[] = requestRows.map(
      (requestRow) => userMap[requestRow.account_id]
    );
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
      text: "DELETE FROM request WHERE account_id = $1",
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
      text: "DELETE FROM request WHERE account_id = $1",
      values: [id],
    };
    await pool.query(query);
    return;
  }
}
