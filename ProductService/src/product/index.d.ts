import { UUID } from '../types';

/**
 * URL of an image
 * @example "https://example.com/image.jpg"
 */
type URL = string;

/**
 * Price of a Product
 * https://www.regextester.com/93999
 * @pattern ^([0-9]*[\.]{0,1}[0-9]{0,2})$
 * @example 100.00
 */
type Price = string;
export interface NewProduct {
  name: string;
  brand: string;
  image: URL;
  rating: string;
  price: Price;
  description: string;
  deliveryDate: Date;
}
export interface Product {
  id: UUID;
  vendor_id: UUID;
  active: boolean;
  created: Date;
  posted: Date;
  data: {
    name: string;
    brand: string;
    image: URL;
    price: string;
    rating: string;
    description: string;
    deliveryDate: string;
  };
}

export interface NewReview {
  rating: number;
  comment: string;
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
