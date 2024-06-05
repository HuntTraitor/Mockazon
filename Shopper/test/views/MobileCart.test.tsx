import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import http from 'http';
import { AppContext } from '@/contexts/AppContext';
import { setupServer } from 'msw/node';

import requestHandler from '../api/requestHandler';
import { enqueueSnackbar, SnackbarProvider } from 'notistack';
// import { LoggedInContext, User } from '@/contexts/LoggedInUserContext';
// import userEvent from '@testing-library/user-event';
// import { randomUUID } from 'crypto';
import MobileCart from '@/views/cart/MobileCart';

let server: http.Server<
  typeof http.IncomingMessage,
  typeof http.ServerResponse
>;

interface MockProduct {
  id: string;
  data: {
    brand: string;
    name: string;
    rating: string;
    price: number;
    deliveryDate: string;
    image: string;
  };
}
const mockProducts: MockProduct[] = [];
for (let i = 0; i < 31; i++) {
  mockProducts.push({
    id: 'some id',
    data: {
      brand: 'test',
      name: 'test name',
      rating: 'test',
      price: 1,
      deliveryDate: 'test',
      image: 'https://test-image.jpg',
    },
  });
}

const microServices = setupServer();

jest.mock('next/config', () => () => ({
  publicRuntimeConfig: { basePath: '' },
}));

beforeAll(async () => {
  microServices.listen({ onUnhandledRequest: 'bypass' });
  server = http.createServer(requestHandler);
  server.listen();
});

afterEach(() => {
  microServices.resetHandlers();
});

const active = true;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const queryParams: any = {
  active: active,
};

jest.mock('next/router', () => ({
  useRouter: () => ({
    basePath: '',
    pathname: '/',
    query: queryParams,
    asPath: '/',
    locale: 'en',
    locales: ['en', 'es'],
    defaultLocale: 'en',
    push: jest.fn(),
    replace: jest.fn(),
    reload: jest.fn(),
    back: jest.fn(),
    prefetch: jest.fn(),
    beforePopState: jest.fn(),
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
    },
  }),
}));

afterAll(done => {
  microServices.close();
  server.close(done);
});

jest.mock('next-i18next/serverSideTranslations', () => ({
  serverSideTranslations: jest.fn().mockReturnValue({
    en: {
      common: {
        title: 'Mock Title',
      },
    },
  }),
}));
const mobile = false;
const AppContextProps = {
  backDropOpen: false,
  setBackDropOpen: jest.fn(),
  mockazonMenuDrawerOpen: false,
  setMockazonMenuDrawerOpen: jest.fn(),
  isMobile: mobile,
  setIsMobile: jest.fn(),
  accountDrawerOpen: false,
  setAccountDrawerOpen: jest.fn(),
};

jest.mock('notistack', () => ({
  ...jest.requireActual('notistack'),
  enqueueSnackbar: jest.fn(),
}));

(enqueueSnackbar as jest.Mock).mockImplementation(jest.fn());

export interface User {
  accessToken: string;
  id: string;
  name: string;
  role: string;
}

export interface Product {
  id: string;
  quantity: string;
  data: {
    getProduct: {
      id: string;
      vendor_id: string;
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

const products = [
  {
    id: 'abc',
    quantity: '2',
    data: {
      getProduct: {
        id: 'abc',
        vendor_id: 'abc',
        data: {
          brand: 'abc',
          name: 'abc',
          rating: 'abc',
          price: 1,
          deliveryDate: 'abc',
          image: 'https://test-image.jpg',
        },
      },
    },
  },
];

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

it('Renders successfully', async () => {
  localStorage.setItem(
    'user',
    JSON.stringify({
      accessToken: 'abc',
      id: 'abc',
      name: 'John',
      role: 'Shopper',
    })
  );
  render(
    <AppContext.Provider value={AppContextProps}>
      <SnackbarProvider>
        <MobileCart
          handleQuantityChange={jest.fn()}
          handleRemove={jest.fn()}
          products={products}
          subtotal={0}
          user={{
            accessToken: 'abc',
            id: 'abc',
            name: 'John',
            role: 'Shopper',
          }}
          locale={''}
        />
      </SnackbarProvider>
    </AppContext.Provider>
  );
  const subtract = screen.getByLabelText(`Subtract Quantity for`, {
    exact: false,
  });
  // click subtract button
  fireEvent.click(subtract);
  const increase = screen.getByLabelText(`Increase Quantity for abc`);
  fireEvent.click(increase);

  const remove = screen.getByLabelText(`cart:Delete`, { exact: false });
  fireEvent.click(remove);
});
