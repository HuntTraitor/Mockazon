import { User, UUID } from "../types";
import { pool } from "../db";

export class RequestService {
  public async getAll(): Promise<User[]> {
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

  public async request(id: string): Promise<void> {
    const query = {
      text: "INSERT INTO request (account_id) VALUES ($1)",
      values: [id],
    };
    await pool.query(query);
    return;
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
