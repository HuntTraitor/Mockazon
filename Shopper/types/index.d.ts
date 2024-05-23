export interface Product {
  id: string;
  quantity: string;
  data: {
    getProduct: {
      id: string;
      data: {
        brand?: string;
        name?: string;
        rating?: string;
        price?: number;
        deliveryDate?: string;
        image?: string;
      };
    };
  };
}

interface ProductFromFetch {
  id: string;
  product_id: string;
  shopper_id: string;
  vendor_id: string;
  data: {
    quantity: string;
  };
}
