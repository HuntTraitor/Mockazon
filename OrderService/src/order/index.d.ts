import { UUID } from "../types/index";

/**
 * orders from 1-999
 * @pattern ^([1-9][0-9]{0,2})$
 * @example 1
 */
export type Quantity = string;

export interface NewOrder {
  purchaseDate: Date;
  quantity: Quantity;
  shipped: boolean;
  delivered: boolean;
}

export interface Order {
  id: UUID;
  product_id: UUID;
  data: {
    purchaseDate: Date;
    quantity: Quantity;
    shipped: boolean;
    delivered: boolean;
  }
}