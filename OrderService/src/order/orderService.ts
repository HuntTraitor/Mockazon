import { NewOrder, Order } from ".";
import { pool } from '../db';

export class OrderService {
  public async create( productId: string, NewOrder: NewOrder,): Promise<Order> {
    const insert = `INSERT INTO "order"(product_id, data) VALUES 
    ($1, $2) RETURNING *`

    const query = {
      text: insert,
      values: [productId, NewOrder]
    }
    const {rows} = await pool.query(query)
    return rows[0]
  }

  public async getOrdersByProductId(productId: string): Promise<Order[]> {
    const select = `SELECT * FROM "order" WHERE product_id = $1`
    const query = {
      text: select,
      values: [`${productId}`]
    }
    const {rows} = await pool.query(query)
    return rows
  }
}
