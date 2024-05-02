import { UUID } from "../types";
/**
 * Price of a Product
 * https://www.regextester.com/93999
 * @pattern ^([0-9]*[\.]{0,1}[0-9]{0,2})$
 * @example 100.00
 */
type Price = string;
export interface NewProduct {
  name: string;
  price: Price;
  // FIXME: Add more product properties
}
export interface Product {
  id: UUID;
  vendor_id: UUID
  data: {
    name: string;
    price: Price;
  }
  // FIXME: Add more product properties
}