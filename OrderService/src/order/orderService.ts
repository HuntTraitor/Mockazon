import { UUID } from 'src/types';
import {NewOrder, Order, UpdateOrder, ShopperOrder, ShopperOrderId, OrderProduct, OrderProductId} from '.';
import { pool } from '../db';

export class OrderService {
  public async create(NewOrder: NewOrder, vendorId: UUID): Promise<Order> {
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

  public async getAllOrders(
    productId?: UUID,
    shopperId?: UUID,
    vendorId?: UUID
  ): Promise<Order[]> {
    let select = `SELECT * FROM vendor_order`;
    const values = [];
    const conditions = [];

    if (productId) {
      conditions.push(`product_id = $${values.length + 1}`);
      values.push(productId);
    }

    if (shopperId) {
      conditions.push(`shopper_id = $${values.length + 1}`);
      values.push(shopperId);
    }

    if (vendorId) {
      conditions.push(`vendor_id = $${values.length + 1}`);
      values.push(vendorId);
    }

    if (conditions.length > 0) {
      select += ' WHERE ';
    }

    select += conditions.join(' AND ');

    const query = {
      text: select,
      values: values,
    };
    const { rows } = await pool.query(query);
    return rows;
  }

  public async getOrder(orderId: UUID): Promise<Order> {
    const select = `SELECT * FROM vendor_order WHERE id = $1`;
    const query = {
      text: select,
      values: [`${orderId}`],
    };
    const { rows } = await pool.query(query);
    return rows[0];
  }

  public async deleteOrder(orderId: UUID): Promise<Order> {
    const deleteQuery = `DELETE FROM vendor_order WHERE id = $1 RETURNING *`;
    const query = {
      text: deleteQuery,
      values: [`${orderId}`],
    };
    const { rows } = await pool.query(query);
    return rows[0];
  }

  public async updateOrder(
    orderId: UUID,
    updates: UpdateOrder
  ): Promise<Order> {
    const update = `UPDATE vendor_order
    SET data = data || $1::jsonb
    WHERE id = $2
    RETURNING *`;

    const query = {
      text: update,
      values: [updates, orderId],
    };
    const { rows } = await pool.query(query);
    return rows[0];
  }

  public async getShopperOrder(orderId: UUID): Promise<ShopperOrder> {
    const select = `SELECT * FROM shopper_order WHERE id = $1`;
    const query = {
      text: select,
      values: [`${orderId}`],
    };
    const { rows } = await pool.query(query);
    let order = rows[0];

    // Get the product ids in the order
    const productSelect = `SELECT product_id AS id FROM order_product WHERE order_id = $1`;
    const productQuery = {
      text: productSelect,
      values: [`${orderId}`],
    };
    const { rows: products } = await pool.query(productQuery);

    if (products.length) order.products = products.map(product => product.id);
    order = { ...order, ...order.data, data: undefined };
    return order;
  }

  public async getAllShopperOrders(shopperId: UUID): Promise<ShopperOrder[]> {
    const arr: ShopperOrder[] = [];
    const select = `SELECT * FROM shopper_order WHERE shopper_id = $1`;
    const query = {
      text: select,
      values: [`${shopperId}`],
    };
    const { rows } = await pool.query(query);

    const promises = rows.map(async order => {
      const res = await this.getShopperOrder(order.id);
      arr.push(res);
    });
    await Promise.all(promises);
    return arr;
  }

  public async createShopperOrder(newOrder: ShopperOrder, shopperId: string): Promise<ShopperOrder & ShopperOrderId | undefined> {
    const insert = `INSERT INTO shopper_order(shopper_id, data) VALUES 
    ($1, $2) RETURNING *`;

    const query = {
      text: insert,
      values: [
        `${shopperId}`,
        newOrder,
      ],
    };
    const { rows } = await pool.query(query);
    return rows[0];
  }

  public async createOrderProduct(orderProduct: OrderProduct): Promise<OrderProduct & OrderProductId | undefined> {
    const insert = `INSERT INTO order_product(order_id, product_id) VALUES 
    ($1, $2) RETURNING *`;

    const query = {
      text: insert,
      values: [
        orderProduct.shopper_order_id,
        orderProduct.product_id,
      ],
    };
    const { rows } = await pool.query(query);
    return rows[0];
  }
}
