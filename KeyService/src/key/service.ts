import { Key, SessionUser, UUID, KeyObj } from '.';
import { pool } from '../db';

export class KeyService {
  public async create(vendorId: UUID): Promise<Key> {
    const insert = `INSERT INTO api_key (vendor_id, requested, active) VALUES ($1, true, false) RETURNING key`;
    const query = {
      text: insert,
      values: [`${vendorId}`],
    };

    const { rows } = await pool.query(query);
    return rows[0];
  }

  public async get(apiKey: UUID): Promise<SessionUser> {
    const select = `SELECT vendor_id FROM api_key WHERE key = $1`;
    const query = {
      text: select,
      values: [`${apiKey}`],
    };
    const { rows } = await pool.query(query);
    return rows[0];
  }

  public async getAll(vendorID: UUID): Promise<KeyObj[]> {
    const select = `SELECT * FROM api_key WHERE vendor_id = $1`;
    const query = {
      text: select,
      values: [`${vendorID}`],
    };
    const { rows } = await pool.query(query);
    return rows;
  }

  public async setActiveStatus(apiKey: UUID): Promise<Key | undefined> {
    let select = `UPDATE api_key SET active = CASE WHEN active IS TRUE THEN FALSE ELSE TRUE END WHERE key = $1`;
    select += ` RETURNING *`;
    const query = {
      text: select,
      values: [`${apiKey}`],
    };
    const { rows } = await pool.query(query);
    return rows.length > 0 ? rows[0] : undefined;
  }
}
