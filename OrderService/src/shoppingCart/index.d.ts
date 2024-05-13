import { UUID } from '../types';
import { Quantity } from '../order';

/**
 * orders from 1-999
 * @pattern ^([1-9][0-9]{0,2})$
 * @example 1
 */

export interface ShoppingCartItem {
  id: UUID;
  product_id: UUID;
  shopper_id: UUID;
  vendor_id: UUID;
  data: {
    quantity: Quantity;
  };
}

export interface ShoppingCartInput {
  product_id: UUID;
  shopper_id: UUID;
  quantity: Quantity;
}

export type ShoppingCart = ShoppingCartItem[];
