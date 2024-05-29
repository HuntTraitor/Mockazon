import { UUID } from 'src/types';
import { ShoppingCart, ShoppingCartItem, ShoppingCartRemoveInput } from '.';
import { pool } from '../db';
import { NewOrder } from '../order';

export class ShoppingCartService {
  public async addToShoppingCart(
    NewOrder: NewOrder
  ): Promise<ShoppingCartItem> {
    // get the current cart
    const cart = await this.getShoppingCart(NewOrder.shopper_id);

    // if the cart already has the product, update the quantity
    const existingProduct = cart.find(
      item => item.product_id === NewOrder.product_id
    );
    if (existingProduct) {
      NewOrder.quantity = (
        Number(NewOrder.quantity) + Number(existingProduct.data.quantity)
      ).toString();
      return this.updateShoppingCart(NewOrder);
    }

    const insert = `INSERT INTO shopping_cart_item(shopper_id, product_id, data) VALUES 
    ($1, $2, $3) RETURNING *`;
    const orderData = {
      quantity: NewOrder.quantity,
    };

    const query = {
      text: insert,
      values: [`${NewOrder.shopper_id}`, `${NewOrder.product_id}`, orderData],
    };
    const { rows } = await pool.query(query);
    return rows[0];
  }

  public async getShoppingCart(shopperId: UUID): Promise<ShoppingCart> {
    const select = `SELECT * FROM shopping_cart_item WHERE shopper_id = $1`;
    const query = {
      text: select,
      values: [`${shopperId}`],
    };
    const { rows }: { rows: ShoppingCartItem[] } = await pool.query(query);
    return rows;
  }

  public async removeFromShoppingCart(
    NewOrder: ShoppingCartRemoveInput
  ): Promise<ShoppingCartRemoveInput> {
    const remove = `DELETE FROM shopping_cart_item WHERE shopper_id = $1 AND product_id = $2 RETURNING *`;
    const query = {
      text: remove,
      values: [`${NewOrder.shopper_id}`, `${NewOrder.product_id}`],
    };
    const { rows } = await pool.query(query);
    return { product_id: rows[0].product_id, shopper_id: rows[0].shopper_id };
  }

  public async updateShoppingCart(
    NewOrder: NewOrder
  ): Promise<ShoppingCartItem> {
    const update = `UPDATE shopping_cart_item SET data = $3 WHERE shopper_id = $1 AND product_id = $2 RETURNING *`;
    const orderData = {
      quantity: NewOrder.quantity,
    };
    const query = {
      text: update,
      values: [`${NewOrder.shopper_id}`, `${NewOrder.product_id}`, orderData],
    };
    const { rows } = await pool.query(query);
    return rows[0];
  }
}
