export interface NewOrder {
  purchaseDate: string;
  quantity: number;
}

export interface Order {
  id: string;
  product_id: string;
  data: {
    purchaseDate: string;
    quantity: number;
  }
}