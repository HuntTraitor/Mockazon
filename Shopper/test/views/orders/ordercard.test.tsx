import React from 'react';
import { render } from '@testing-library/react';
import OrderCard from '../../../src/views/order/OrderCard';

const mockProducts = [
  {
    id: '1',
    data: {
      brand: 'Apple',
      name: 'iPhone 12',
      price: 1099.99,
      rating: '4 stars',
      description:
        'A14 Bionic chip, the fastest chip ever in a smartphone. Pro camera system for next-level low-light photography. It’s a beautiful leap forward.',
      deliveryDate: '2024-05-05',
      image:
        'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-12-pro-family-hero?wid=940&hei=1112&fmt=jpeg&qlt=80&.v=1604021662000',
    },
  },
];

const mockOrder = {
  id: '1',
  createdAt: '2024-05-05',
  shippingAddress: {
    name: 'Naomi Tratar',
    addressLine1: '6019 W. 74th st.',
    city: 'Los Angeles',
    state: 'CA',
    postalCode: '90045',
    country: 'United States',
  },
  paymentMethod: 'Credit Card',
  paymentDigits: 1234,
  subtotal: 22.16,
  totalBeforeTax: 22.16,
  tax: 0,
  shipped: false,
  delivered: false,
  deliveryTime: '2024-05-06',
  products: mockProducts,
  total: 22.16,
};

describe('OrderCard', () => {
  it('should display order information', () => {
    render(<OrderCard order={mockOrder} />);
  });
});
