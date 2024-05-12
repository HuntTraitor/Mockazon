import { UUID } from 'src/types';
import { ShoppingCart, ShoppingCartItem } from '.';
import { pool } from '../db';
import { NewOrder } from '../order';

export class ShoppingCartService {
  public async create(
    NewOrder: NewOrder,
    vendorId: UUID
  ): Promise<ShoppingCartItem> {
    const insert = `INSERT INTO shopping_cart(product_id, shopper_id, vendor_id, data) VALUES 
    ($1, $2, $3, $4) RETURNING *`;
    // ('d1c689b1-b7a7-4100-8b2d-309908b444f5', 'f067f4e8-c8b7-44d5-97af-0996b04acb65', 'e3c5a0f2-7d18-42c9-b0f4-85951d850360', '{"quantity": "3"}');
    const orderData = {
      quantity: NewOrder.quantity,
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

  public async getShoppingCart(shopperId: UUID): Promise<ShoppingCart> {
    const select = `SELECT * FROM shopping_cart WHERE shopper_id = $1`;
    const query = {
      text: select,
      values: [`${shopperId}`],
    };
    const { rows }: { rows: ShoppingCartItem[] } = await pool.query(query);
    return rows;
  }
}
