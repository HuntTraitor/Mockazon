import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import http from 'http';
import { LoggedInContext } from '@/contexts/LoggedInUserContext';
import { AppContext, useAppContext } from '@/contexts/AppContext';
import { graphql, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { loadStripe } from '@stripe/stripe-js';
import requestHandler from '../api/requestHandler';
import CheckoutButton from '@/views/CheckoutButton';

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
  graphql.mutation('CreateStripeCheckoutSession', () => {
    if (errorInFetchProduct) {
      return HttpResponse.json({}, { status: 400 });
    } else {
      return HttpResponse.json(
        {
          data: {
            createStripeCheckoutSession: {
              id: '123',
              url: 'abc.png',
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

const products = [
  {
    id: '123',
    data: {
      getProduct: {
        data: {
          brand: 'test',
          name: 'test name',
          rating: 'test',
          price: '100',
          deliveryDate: 'test',
          image: 'test',
        },
      },
    },
    quantity: '3',
  },
];

jest.mock('@stripe/stripe-js', () => ({
  __esModule: true,
  loadStripe: jest.fn().mockResolvedValue({
    redirectToCheckout: jest.fn().mockResolvedValue({ error: null }),
  }),
}));

it('Clicks checkout button and redirects successfully', async () => {
  jest.mock('@stripe/stripe-js', () => {
    return {
      __esModule: true,
      ...jest.requireActual('@stripe/stripe-js'),
      loadStripe: jest.fn().mockResolvedValue({
        redirectToCheckout: jest.fn().mockResolvedValue({ error: null }),
      }),
    };
  });

  render(
    <AppContext.Provider value={AppContextProps}>
      <LoggedInContext.Provider value={newLoggedInContextProps}>
        <CheckoutButton
          productsWithContent={products}
          shopperId={'123'}
          subtotal={100}
        />
      </LoggedInContext.Provider>
    </AppContext.Provider>
  );
  fireEvent.click(screen.getByText('Proceed to checkout'));
});

// TODO fix this test - it's failing because the module can't be remocked from within the test
it('Clicks checkout button and encounters error during redirect', async () => {
  jest.resetAllMocks();
  const mockStripe = {
    redirectToCheckout: jest
      .fn()
      .mockResolvedValue({ error: { message: 'Mock error' } }),
  };
  (loadStripe as jest.Mock).mockResolvedValue(mockStripe);

  render(
    <AppContext.Provider value={AppContextProps}>
      <LoggedInContext.Provider value={newLoggedInContextProps}>
        <CheckoutButton
          productsWithContent={products}
          shopperId={'123'}
          subtotal={100}
        />
      </LoggedInContext.Provider>
    </AppContext.Provider>
  );
  fireEvent.click(screen.getByText('Proceed to checkout'));
});
