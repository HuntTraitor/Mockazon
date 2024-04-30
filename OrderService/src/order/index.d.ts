import { UUID } from "../../../AuthService/src/types";

/**
 * @pattern ^[2-9][0-9]*
 * @example 1
 */

export type Quantity = number;

export interface NewOrder {
  purchaseDate: Date;
  quantity: Quantity;
}

export interface Order {
  id: UUID;
  product_id: UUID;
  data: {
    purchaseDate: Date;
    quantity: Quantity;
  }
}