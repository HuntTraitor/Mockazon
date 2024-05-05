import { User } from ".";
import { pool } from "../db";

export class UserService {
  public async getAll(): Promise<User[]> {
    const query = {
      text: "SELECT * FROM user_account",
    };

    const { rows } = await pool.query(query);
    return rows;
  }
}
