import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import http from 'http';
import { LoggedInContext } from '@/contexts/LoggedInUserContext';
import { AppContext } from '@/contexts/AppContext';
import { graphql, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import requestHandler from '../../api/requestHandler';
import CheckoutButton from '@/views/CheckoutButton';
import { SnackbarProvider, useSnackbar } from 'notistack';
jest.mock('notistack', () => ({
  ...jest.requireActual('notistack'),
  useSnackbar: jest.fn(),
}));

const mockEnqueueSnackbar = jest.fn();
(useSnackbar as jest.Mock).mockReturnValue({
  enqueueSnackbar: mockEnqueueSnackbar,
});

jest.mock('next/config', () => () => ({
  publicRuntimeConfig: { basePath: '' },
}));

let server: http.Server<
  typeof http.IncomingMessage,
  typeof http.ServerResponse
>;

let errorInCreateSession = false;
// let errorInShoppingCart = false;

const handlers = [
  graphql.mutation('CreateStripeCheckoutSession', () => {
    if (errorInCreateSession) {
      return HttpResponse.json(
        { errors: [{ message: 'Fetch error' }] },
        { status: 400 }
      );
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
  errorInCreateSession = false;
  // errorInShoppingCart = false;
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
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
    },
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
  isMobile: false,
  setIsMobile: jest.fn(),
  accountDrawerOpen: false,
  setAccountDrawerOpen: jest.fn(),
};

const products = [
  {
    id: '123',
    data: {
      getProduct: {
        id: '123',
        data: {
          brand: 'test',
          name: 'test name',
          rating: 'test',
          price: 100,
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
    redirectToCheckout: jest
      .fn()
      .mockResolvedValue({ error: { message: 'error' } }),
  }),
}));

it('Clicks checkout button and encounters error redirecting to checkout', async () => {
  jest.mock('@stripe/stripe-js', () => {
    return {
      __esModule: true,
      ...jest.requireActual('@stripe/stripe-js'),
      loadStripe: jest.fn().mockResolvedValue({
        redirectToCheckout: jest
          .fn()
          .mockResolvedValue({ error: 'error message' }),
      }),
    };
  });

  render(
    <AppContext.Provider value={AppContextProps}>
      <LoggedInContext.Provider value={newLoggedInContextProps}>
        <SnackbarProvider>
          <CheckoutButton
            productsWithContent={products.map(product => ({
              ...product,
              data: {
                ...product.data,
                getProduct: {
                  ...product.data.getProduct,
                  vendor_id: 'vendor_id_value',
                },
              },
            }))}
            shopperId={'123'}
            subtotal={100}
            locale={'en'}
          />
        </SnackbarProvider>
      </LoggedInContext.Provider>
    </AppContext.Provider>
  );
  fireEvent.click(screen.getByText('cart:proceedToCheckout'));
});
