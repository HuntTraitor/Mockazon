import { User } from ".";
import { pool } from "../db";

export class AccountService {
  public async getAll(): Promise<User[]> {
    const query = {
      text: "SELECT * FROM account",
    };

    const { rows } = await pool.query(query);
    return rows;
  }
}
