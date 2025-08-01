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
  data: {
    quantity: Quantity;
  };
}

export interface ShoppingCartItemID {
  id: UUID;
}

export interface ShoppingCartInput {
  product_id: UUID;
  shopper_id: UUID;
  quantity: Quantity;
}

export interface ShoppingCartRemoveInput {
  product_id: UUID;
  shopper_id: UUID;
}

export type ShoppingCart = ShoppingCartItem[];
