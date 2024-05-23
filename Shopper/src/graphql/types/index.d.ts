/**
 * Stringified UUIDv4.
 * See [RFC 4112](https://tools.ietf.org/html/rfc4122)
 * @pattern [0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}
 * @example "52907745-7672-470e-a803-a2f8feb52944"
 */
export type UUID = string;

export type Order = {
  id: string;
  createdAt: string;
  shippingAddress: {
    name: string;
    addressLine1: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
  subtotal: number;
  totalBeforeTax: number;
  tax: number;
  total: number;
};

export type ShippingAddress = {
  name: string;
  addressLine1: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

export interface Product {
  id: string;
  data: {
    brand?: string;
    name: string;
    rating?: string;
    price: number;
    deliveryDate: string;
    image: string;
  };
}