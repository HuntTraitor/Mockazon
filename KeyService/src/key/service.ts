import { Key, UUID } from '.';
import { pool } from '../db';

export class KeyService {
  public async create(vendorId: UUID): Promise<Key> {
    const insert = `INSERT INTO api_key (vendor_id, requested, active) VALUES ($1, true, false) RETURNING key`;
    const query = {
      text: insert,
      values: [`${vendorId}`],
    };

    try {
      const { rows } = await pool.query(query);
    } catch (e) {
      console.log(e)
    }
    const { rows } = await pool.query(query);
    return rows[0];
  }
}
