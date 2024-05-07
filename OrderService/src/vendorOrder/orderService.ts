import { UUID } from 'src/types';
import { NewVendorOrder, VendorOrder } from '.';
import { pool } from '../db';

export class OrderService {
  public async create(
    NewOrder: NewVendorOrder,
    vendorId: UUID
  ): Promise<VendorOrder> {
    const insert = `INSERT INTO vendor_order(product_id, shopper_id, vendor_id, data) VALUES 
    ($1, $2, $3, $4) RETURNING *`;

    const orderData = {
      purchaseDate: new Date().toISOString(),
      quantity: NewOrder.quantity,
      shipped: false,
      delivered: false,
    };

    const query = {
      text: insert,
      values: [
        `${NewOrder.product_id}`,
        `${NewOrder.shopper_id}`,
        `${vendorId}`,
        orderData,
      ],
    };
    const { rows } = await pool.query(query);
    return rows[0];
  }

  // public async getAllOrders(
  //   productId?: UUID,
  //   shopperId?: UUID,
  //   vendorId?: UUID,
  // ): Promise<Order[]> {
  //   let select = `SELECT * FROM "order" WHERE 1=1`;
  //   const values = [];

  //   if (productId) {
  //     select += ` AND product_id = $${values.length + 1}`;
  //     values.push(productId);
  //   }

  //   if (shopperId) {
  //     select += ` AND shopper_id = $${values.length + 1}`;
  //     values.push(shopperId);
  //   }

  //   if (vendorId) {
  //     select += ` AND vendor_id = $${values.length + 1}`
  //     values.push(vendorId)
  //   }
  //   const query = {
  //     text: select,
  //     values: values,
  //   };
  //   const { rows } = await pool.query(query);
  //   return rows;
  // }

  // public async getOrder(orderId: UUID): Promise<Order> {
  //   const select = `SELECT * FROM "order" WHERE id = $1`;
  //   const query = {
  //     text: select,
  //     values: [`${orderId}`],
  //   };
  //   const { rows } = await pool.query(query);
  //   return rows[0];
  // }

  // public async deleteOrder(orderId: UUID): Promise<Order> {
  //   const deleteQuery = `DELETE FROM "order" WHERE id = $1 RETURNING *`;
  //   const query = {
  //     text: deleteQuery,
  //     values: [`${orderId}`],
  //   };
  //   const { rows } = await pool.query(query);
  //   return rows[0];
  // }

  // public async updateOrder(
  //   orderId: UUID,
  //   updates: UpdateOrder
  // ): Promise<Order> {
  //   const update = `UPDATE "order"
  //   SET data = data || $1::jsonb
  //   WHERE id = $2
  //   RETURNING *`;

  //   const query = {
  //     text: update,
  //     values: [updates, orderId],
  //   };
  //   const { rows } = await pool.query(query);
  //   return rows[0];
  // }
}
