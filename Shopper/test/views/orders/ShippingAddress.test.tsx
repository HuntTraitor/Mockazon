import React from 'react';
import {
  render,
} from '@testing-library/react';
import {
  screen,
} from '@testing-library/dom';
import http from 'http';

import { HttpResponse, graphql } from 'msw';
import { setupServer } from 'msw/node';
import requestHandler from '../../api/requestHandler';
import { AppContext } from '@/contexts/AppContext';
import { enqueueSnackbar, SnackbarProvider } from 'notistack';
import ShippingAddress from "@/views/order/ShippingAddress";

let server: http.Server<
  typeof http.IncomingMessage,
  typeof http.ServerResponse
>;

let returnError = false;

const handlers = [
  graphql.mutation('AddToShoppingCart', () => {
    if (returnError) {
      return HttpResponse.json({
        errors: [
          {
            message: 'Some Error',
          },
        ],
      });
    }
    return HttpResponse.json(
      {
        data: {
          addToShoppingCart: [
            {
              id: '123',
              product_id: 'prodid123',
              shopper_id: 'shopperid123',
              data: {
                quantity: '5',
              },
            },
          ],
        },
      },
      { status: 200 }
    );
  }),
];

const microServices = setupServer(...handlers);

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
  returnError = false;
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

jest.mock('next-i18next/serverSideTranslations', () => ({
  serverSideTranslations: jest.fn().mockReturnValue({
    en: {
      viewProduct: {
        title: 'Mock Title',
      },
    },
    es: {
      viewProduct: {
        title: 'Mock Title',
      },
    },
  }),
}));

const mockAddress = {
  name: 'John Doe',
  addressLine1: '123 Main Street',
  city: 'Anytown',
  state: 'AS',
  postalCode: '12345',
  country: 'USA',
};

const mockAddressWithoutCity = {
  name: 'John Doe',
  addressLine1: '123 Main Street',
  state: 'AS',
  city: '',
  postalCode: '12345',
  country: 'USA',
};

it('Loads address', async () => {
  render(
    <AppContext.Provider value={AppContextProps}>
      <SnackbarProvider>
        <ShippingAddress address={mockAddress}/>
      </SnackbarProvider>
    </AppContext.Provider>
  );
  expect(screen.getByText(mockAddress.name)).toBeInTheDocument();
});

it('Loads address without city', async () => {
  render(
    <AppContext.Provider value={AppContextProps}>
      <SnackbarProvider>
        <ShippingAddress address={mockAddressWithoutCity}/>
      </SnackbarProvider>
    </AppContext.Provider>
  );
  expect(screen.getByText(mockAddress.name)).toBeInTheDocument();
});
