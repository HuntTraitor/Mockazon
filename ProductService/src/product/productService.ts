import { UUID } from "src/types";
import { NewProduct, Product} from ".";
import {pool} from '../db';
export class ProductService {
  public async create(product: NewProduct, vendor_id?: UUID): Promise<Product|undefined>{
    if (vendor_id) {
      let insert = `INSERT INTO product(vendor_id, data) VALUES ($1::UUID, jsonb_build_object('name', $2::TEXT, 'price', $3::TEXT))`;
      insert += ` RETURNING *`;
      const query = {
        text: insert,
        values: [`${vendor_id}`, `${product.name}`, `${product.price}`]
      };
      const {rows} = await pool.query(query);
      return rows[0];
    }
    return undefined;
  }
}