import { UUID } from "src/types";
import { NewOrder, Order, UpdateOrder } from ".";
import { pool } from '../db';

export class OrderService {
  public async create(NewOrder: NewOrder): Promise<Order> {
    const insert = `INSERT INTO "order"(product_id, account_id, data) VALUES 
    ($1, $2, $3) RETURNING *`
  
    const orderData = {
      purchaseDate: NewOrder.purchaseDate,
      quantity: NewOrder.quantity,
      shipped: false,
      delivered: false
    }

    const query = {
      text: insert,
      values: [`${NewOrder.product_id}`, `${NewOrder.account_id}`, orderData]
    }
    const {rows} = await pool.query(query)
    return rows[0]
  }

  public async getOrdersByProductId(productId: UUID): Promise<Order[]> {
    const select = `SELECT * FROM "order" WHERE product_id = $1`
    const query = {
      text: select,
      values: [`${productId}`]
    }
    const {rows} = await pool.query(query)
    return rows
  }

  public async getOrder(orderId: UUID): Promise<Order> {
    const select = `SELECT * FROM "order" WHERE id = $1`
    const query = {
      text: select,
      values: [`${orderId}`]
    }
    const {rows} = await pool.query(query)
    return rows[0]
  }

  public async deleteOrder(orderId: UUID): Promise<Order> {
    const deleteQuery = `DELETE FROM "order" WHERE id = $1 RETURNING *`
    const query = {
      text: deleteQuery,
      values: [`${orderId}`]
    }
    const {rows} = await pool.query(query)
    return rows[0]
  }

  public async updateOrder(orderId: UUID, updates: UpdateOrder): Promise<Order> {
    const update = `UPDATE "order"
    SET data = data || $1::jsonb
    WHERE id = $2
    RETURNING *`

    const query = {
      text: update,
      values: [updates, orderId]
    }
    const {rows} = await pool.query(query)
    return rows[0]
  }
}