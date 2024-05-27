import { UUID } from '../types/index';

/**
 * orders from 1-999
 * @pattern ^([1-9][0-9]{0,2})$
 * @example 1
 */
export type Quantity = string;

export interface NewOrder {
  product_id: UUID;
  shopper_id: UUID;
  quantity: Quantity;
}

export interface OrderProduct {
  product_id: UUID;
  shopper_order_id: UUID;
}

export interface OrderProductId {
  id: UUID;
}

export interface Order {
  id: UUID;
  product_id: UUID;
  shopper_id: UUID;
  vendor_id: UUID;
  data: {
    shipped: boolean;
    quantity: Quantity;
    delivered: boolean;
    purchaseDate: Date;
  };
}

export interface ShopperOrder {
  createdAt: Date;
  paymentMethod: string;
  paymentDigits: string;
  shipped: boolean;
  subtotal: number;
  deliveryTime: string;
  delivered: boolean;
  tax: number;
  total: number;
  shippingAddress: {
    name: string;
    addressLine1: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  totalBeforeTax: string;
}

export interface ShopperOrderId {
  id: UUID;
}

export interface UpdateOrder {
  quantity?: Quantity;
  shipped?: boolean;
  delivered?: boolean;
}
