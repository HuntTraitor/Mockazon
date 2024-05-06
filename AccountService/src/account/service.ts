import { User, UUID } from "../types";
import { pool } from "../db";

export class AccountService {
  public async getAll(): Promise<User[]> {
    const query = {
      text: "SELECT id, data->>'email' AS email, data->>'name' AS name, data->>'username' AS username, data->>'role' AS role, data->>'suspended' AS suspended FROM account",
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
}
