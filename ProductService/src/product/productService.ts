import { UUID } from "src/types";
import { NewProduct, Product} from ".";
import {pool} from '../db';
export class ProductService {
  public async create(product: NewProduct, vendor_id?: UUID): Promise<Product|undefined>{
    if (vendor_id) {
      const insert = `INSERT INTO product(vendor_id, data) VALUES ($1::UUID, jsonb_build_object('name', $2::TEXT, 'price', $3::TEXT)) RETURNING *`;
      const query = {
        text: insert,
        values: [`${vendor_id}`, `${product.name}`, `${product.price}`]
      };
      const {rows} = await pool.query(query);
      return rows[0];
    }
    return undefined;
  }

  public async disable(id: UUID, vendor_id?: UUID): Promise<Product|undefined>{
    if (vendor_id) {
      const insert = `UPDATE product SET active = false WHERE id = $1::UUID AND vendor_id = $2::UUID RETURNING *`;
      const query = {
        text: insert,
        values: [`${id}`, `${vendor_id}`]
      };
      const {rows} = await pool.query(query);
      return rows[0];
    }
    return undefined;
  }
}