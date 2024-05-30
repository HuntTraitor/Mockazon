import React from 'react';
import {screen, render} from '@testing-library/react';
import http from 'http';

import { setupServer } from 'msw/node';
import requestHandler from '../../../api/requestHandler';
import { AppContext } from '@/contexts/AppContext';
import { enqueueSnackbar, SnackbarProvider } from 'notistack';
import OrderDetails from "@/views/order/OrderDetails";

let server: http.Server<
  typeof http.IncomingMessage,
  typeof http.ServerResponse
>;

const microServices = setupServer();

jest.mock('notistack', () => ({
  ...jest.requireActual('notistack'),
  enqueueSnackbar: jest.fn(),
}));

const AppContextProps = {
  backDropOpen: false,
  setBackDropOpen: jest.fn(),
  mockazonMenuDrawerOpen: false,
  setMockazonMenuDrawerOpen: jest.fn(),
  isMobile: false,
  setIsMobile: jest.fn(),
  accountDrawerOpen: false,
  setAccountDrawerOpen: jest.fn(),
};

(enqueueSnackbar as jest.Mock).mockImplementation(jest.fn());

beforeAll(async () => {
  microServices.listen({ onUnhandledRequest: 'bypass' });
  server = http.createServer(requestHandler);
  server.listen();
});

afterEach(() => {
  microServices.resetHandlers();
});

afterAll(done => {
  microServices.close();
  server.close(done);
});

const mockOrder = {
  id: '123452345',
  createdAt: '2022-01-01',
  shippingAddress: {
    name: 'John Doe',
    addressLine1: '123 Main St',
    city: 'Springfield',
    state: 'IL',
    postalCode: '62701',
    country: 'USA',
  },
  paymentMethod: 'card',
  paymentDigits: 4242,
  paymentBrand: 'Visa',
  subtotal: 100,
  totalBeforeTax: 100,
  tax: 33,
  shipped: false,
  delivered: false,
  deliveryTime: '2022-01-02',
  products: [
    {
      id: '1',
      quantity: 1,
      data: {
        name: 'Widget',
        price: 100,
        deliveryDate: '2022-01-02',
        image: 'widget.jpg',
        description: 'A widget',
      },
    },
  ],
  quantities: [1],
  total: 110,
};

const i18nMock = {
  language: 'en',
};

jest.mock('next-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: i18nMock,
  }),
}));

it('Loads order details', async () => {
  render(
    <AppContext.Provider value={AppContextProps}>
      <SnackbarProvider>
        <OrderDetails order={mockOrder} />
      </SnackbarProvider>
    </AppContext.Provider>
  );
  screen.getByText(mockOrder.id, { exact: false });
  screen.getByText(new Date(mockOrder.createdAt).toLocaleDateString('en-US',
    { year: 'numeric', month: 'long', day: 'numeric'
    }), { exact: false });
});

it('Loads order details with null order', async () => {
  render(
    <AppContext.Provider value={AppContextProps}>
      <SnackbarProvider>
        <OrderDetails order={null} />
      </SnackbarProvider>
    </AppContext.Provider>
  );
  expect(screen.queryByText(mockOrder.id, {exact: false})).toBeNull();
});

it('Loads order details with mobile', async () => {
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

  render(
    <AppContext.Provider value={AppContextProps}>
      <SnackbarProvider>
        <OrderDetails order={mockOrder} />
      </SnackbarProvider>
    </AppContext.Provider>
  );
  screen.getByText(mockOrder.id, { exact: false });
  screen.getByText(new Date(mockOrder.createdAt).toLocaleDateString('en-US',
    { year: 'numeric', month: 'long', day: 'numeric'
    }), { exact: false });
});




