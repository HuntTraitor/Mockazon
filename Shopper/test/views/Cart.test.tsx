import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import { getServerSideProps } from '@/pages/cart';
import http from 'http';
import { LoggedInContext } from '@/contexts/LoggedInUserContext';
import { AppContext } from '@/contexts/AppContext';
import { graphql, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

import requestHandler from '../api/requestHandler';
import ShoppingCart from '@/pages/cart';

jest.mock('next/config', () => () => ({
  publicRuntimeConfig: { basePath: '' },
}));

let server: http.Server<
  typeof http.IncomingMessage,
  typeof http.ServerResponse
>;

let errorInFetchProduct = false;
let errorInShoppingCart = false;

const handlers = [
  graphql.query('GetShoppingCart', () => {
    if (errorInShoppingCart) {
      return HttpResponse.json({}, { status: 400 });
    } else {
      return HttpResponse.json(
        {
          data: {
            getShoppingCart: [
              {
                id: '123',
                product_id: '123',
                shopper_id: '123',
                vendor_id: '123',
                data: {
                  quantity: '3',
                },
              },
            ],
          },
        },
        { status: 200 }
      );
    }
  }),
  graphql.query('GetProduct', () => {
    if (errorInFetchProduct) {
      return HttpResponse.json({}, { status: 400 });
    } else {
      return HttpResponse.json(
        {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          id: '123',
          data: {
            getProduct: {
              data: {
                brand: 'test',
                name: 'test name',
                rating: 'test',
                price: 1,
                deliveryDate: 'test',
                image: 'test',
              },
            },
          },
        },
        { status: 200 }
      );
    }
  }),
];

const microServices = setupServer(...handlers);

beforeAll(async () => {
  microServices.listen({ onUnhandledRequest: 'bypass' });
  server = http.createServer(requestHandler);
  server.listen();
});

beforeEach(() => {
  microServices.resetHandlers();
  errorInFetchProduct = false;
  errorInShoppingCart = false;
});

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

jest.mock('next/router', () => ({
  useRouter: () => ({
    basePath: '',
    pathname: '/',
    query: {},
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
  }),
}));

const newLoggedInContextProps = {
  accessToken: 'mockToken',
  setAccessToken: jest.fn(),
  location: 'login',
  setLocation: jest.fn(),
  locale: 'en',
  setLocale: jest.fn(),
  user: {
    accessToken: 'abc',
    id: 'abc',
    name: 'Trevor',
    role: 'Shopper',
  },
  setUser: jest.fn(),
};

const AppContextProps = {
  backDropOpen: false,
  setBackDropOpen: jest.fn(),
  mockazonMenuDrawerOpen: false,
  setMockazonMenuDrawerOpen: jest.fn(),
};

it('Renders successfully', async () => {
  localStorage.setItem(
    'user',
    JSON.stringify({
      accessToken: 'abc',
      id: 'abc',
      name: 'Trevor',
      role: 'Shopper',
    })
  );

  render(
    <AppContext.Provider value={AppContextProps}>
      <LoggedInContext.Provider value={newLoggedInContextProps}>
        <ShoppingCart />
      </LoggedInContext.Provider>
    </AppContext.Provider>
  );
  await waitFor(() => expect(screen.getByText('test name')));
});

it('Render fails because localStorageUser not set', async () => {
  const newLoggedInContextProps2 = { ...newLoggedInContextProps };
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  newLoggedInContextProps2.user = {};
  render(
    <AppContext.Provider value={AppContextProps}>
      <LoggedInContext.Provider value={newLoggedInContextProps2}>
        <ShoppingCart />
      </LoggedInContext.Provider>
    </AppContext.Provider>
  );
});

it('should fetch server side props with translations', async () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  await getServerSideProps({ locale: 'en' });
});

it('should fetch server side props with translations without locale', async () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  await getServerSideProps({});
});

it('Renders with error in fetch shopping cart items', async () => {
  errorInShoppingCart = true;
  render(
    <AppContext.Provider value={AppContextProps}>
      <LoggedInContext.Provider value={newLoggedInContextProps}>
        <ShoppingCart />
      </LoggedInContext.Provider>
    </AppContext.Provider>
  );
});

it('Renders with error in fetch product', async () => {
  errorInFetchProduct = true;
  render(
    <AppContext.Provider value={AppContextProps}>
      <LoggedInContext.Provider value={newLoggedInContextProps}>
        <ShoppingCart />
      </LoggedInContext.Provider>
    </AppContext.Provider>
  );
});

it('Click Backdrop', () => {
  render(
    <AppContext.Provider
      value={{
        ...AppContextProps,
        backDropOpen: true,
      }}
    >
      <LoggedInContext.Provider value={newLoggedInContextProps}>
        <ShoppingCart />
      </LoggedInContext.Provider>
    </AppContext.Provider>
  );
  const backdrop = document.querySelector('.MuiBackdrop-root');
  if (backdrop) {
    fireEvent.click(backdrop);
  }
});
