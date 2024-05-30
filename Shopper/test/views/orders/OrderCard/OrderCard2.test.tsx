import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import OrderCard from '@/views/order/OrderCard';
import { graphql, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { enqueueSnackbar, SnackbarProvider } from 'notistack';
import { AppContext } from '@/contexts/AppContext';

let mutationPasses = true;
let graphQLError = true;

const handlers = [
  graphql.mutation('AddToShoppingCart', ({ query /*, variables*/ }) => {
    console.log(query);
    if (mutationPasses) {
      return HttpResponse.json({
        data: {
          addToShoppingCart: {
            id: 1,
            product_id: 'approved@email.com',
            shopper_id: 'approved account',
            data: {
              quantity: 3,
            },
          },
        },
      });
    }
    if (graphQLError) {
      return HttpResponse.json({
        errors: [{ message: 'Some Error' }],
      });
    }
    return HttpResponse.json({
      errors: [],
    });
  }),
];

const mockProducts = [
  {
    id: '1',
    quantity: 1,
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
  paymentBrand: 'Visa',
  subtotal: 22.16,
  totalBeforeTax: 22.16,
  tax: 0,
  shipped: false,
  delivered: false,
  deliveryTime: '2024-05-06',
  products: mockProducts,
  quantities: [1, 1],
  total: 22.16,
};

const mockOrderQuantities2 = {
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
  paymentBrand: 'Visa',
  subtotal: 22.16,
  totalBeforeTax: 22.16,
  tax: 0,
  shipped: false,
  delivered: false,
  deliveryTime: '2024-05-06',
  products: mockProducts,
  quantities: [2, 2],
  total: 22.16,
};

const mockOrderDelivered = {
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
  paymentBrand: 'Visa',
  subtotal: 22.16,
  totalBeforeTax: 22.16,
  tax: 0,
  shipped: false,
  delivered: true,
  deliveryTime: '2024-05-06',
  products: mockProducts,
  quantities: [1, 1],
  total: 22.16,
};

const server = setupServer(...handlers);

jest.mock('notistack', () => ({
  ...jest.requireActual('notistack'),
  enqueueSnackbar: jest.fn(),
}));

const AppContextProps = {
  backDropOpen: false,
  setBackDropOpen: jest.fn(),
  mockazonMenuDrawerOpen: false,
  setMockazonMenuDrawerOpen: jest.fn(),
  isMobile: true,
  setIsMobile: jest.fn(),
  accountDrawerOpen: false,
  setAccountDrawerOpen: jest.fn(),
};

(enqueueSnackbar as jest.Mock).mockImplementation(jest.fn());

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
beforeEach(() => {
  mutationPasses = true;
  graphQLError = false;
});

const i18nMock = {
  language: 'en',
};

jest.mock('next-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: i18nMock,
  }),
}));

describe('OrderCard', () => {
  window.matchMedia = jest.fn().mockImplementation(query => {
    const isSmallScreen = true;
    AppContextProps.isMobile = true;
    return {
      matches: isSmallScreen, // Mock 'sm' breakpoint to always match
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    };
  });
  it('Should display order information', () => {
    render(
      <AppContext.Provider value={AppContextProps}>
        <SnackbarProvider>
          <OrderCard order={mockOrder} />
        </SnackbarProvider>
      </AppContext.Provider>
    );
  });
});
