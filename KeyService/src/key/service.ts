import { Key, UUID } from ".";
import {pool} from '../db'

export class KeyService {
  public async create(vendorId: UUID): Promise<Key> {
    const insert = `INSERT INTO api_key (vendor_id, requested, active) VALUES ($1, true, false) RETURNING key`
    const query = {
      text: insert,
      values: [`${vendorId}`]
    }

    const {rows} = await pool.query(query)
    console.log(rows)
    return rows[0]
  }
}