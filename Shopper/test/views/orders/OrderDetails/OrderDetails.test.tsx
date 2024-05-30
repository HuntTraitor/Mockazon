import {render, screen} from "@testing-library/react";
import {AppContext} from "@/contexts/AppContext";
import { enqueueSnackbar, SnackbarProvider } from 'notistack';
import OrderDetails from "@/views/order/OrderDetails";
import React from "react";

import http from 'http';

import { setupServer } from 'msw/node';
import requestHandler from '../../../api/requestHandler';

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
  id: '1324242',
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
  language: 'es',
};

jest.mock('next-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: i18nMock,
  }),
}));

it('Loads order details with language in es', async () => {
  render(
    <AppContext.Provider value={AppContextProps}>
      <SnackbarProvider>
        <OrderDetails order={mockOrder} />
      </SnackbarProvider>
    </AppContext.Provider>
  );
  screen.getByText(mockOrder.id, { exact: false });
  screen.getByText('diciembre', { exact: false });
});
