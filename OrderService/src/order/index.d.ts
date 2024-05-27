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
  quantity: number;
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

export interface ShopperOrderProduct {
  id: UUID;
  quantity: number;
}

export interface ShopperOrder {
  tax: number;
  total: number;
  shipped: boolean;
  subtotal: number;
  createdAt: Date;
  delivered: boolean;
  deliveryTime: string;
  paymentDigits: string;
  paymentMethod: string;
  shippingAddress: {
    city: string;
    name: string;
    state: string;
    country: string;
    postalCode: string;
    addressLine1: string;
  };
}

export interface ShopperOrderId {
  id: UUID;
}

export interface UpdateOrder {
  quantity?: Quantity;
  shipped?: boolean;
  delivered?: boolean;
}
