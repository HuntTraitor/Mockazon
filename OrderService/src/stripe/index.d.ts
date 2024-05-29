import { UUID } from '../types';

export interface MetaData {
  items: {
    productId: UUID;
    vendorId: UUID;
  }[];
}

export interface LineItem {
  price_data: {
    currency: string;
    unit_amount: number;
    product_data: {
      name: string;
      images: string[];
      metadata: {
        productId: UUID;
        vendorId: UUID;
      };
    };
  };
  quantity: number;
}

export interface Session {
  id: UUID;
  url: string;
}

export interface Error {
  status: number;
  message: string;
}

export interface ShopperId {
  shopperId: UUID;
}

export enum Locale {
  en = 'en',
  es = 'es',
}

export interface SessionInput {
  lineItems: LineItem[];
  shopperId: ShopperId;
  origin: string;
  locale: Locale;
}
