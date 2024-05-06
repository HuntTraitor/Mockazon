/**
 * Define any types for products
 */
import { UUID } from '../types';

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
  properties: {
    [key: string]: string;
  };
}
export interface Product {
  id: UUID;
  vendor_id: UUID;
  data: {
    name: string;
    price: Price;
    properties: {
      [key: string]: string;
    };
  };
}

export interface Review {
  id: UUID;
  product_id: UUID;
  reviewer_id: UUID;
  created: Date;
  data: {
    rating: number;
    comment: string;
  };
}
