import React from 'react';
import { render, screen } from '@testing-library/react';
import Products from '@/pages/products';
import http from 'http';
import { AppContext } from '@/contexts/AppContext';

import { HttpResponse, graphql } from 'msw';
import { setupServer } from 'msw/node';

import requestHandler from '../../../api/requestHandler';
import { enqueueSnackbar, SnackbarProvider } from 'notistack';
import { LoggedInContext, User } from '@/contexts/LoggedInUserContext';
import userEvent from '@testing-library/user-event';

let server: http.Server<
  typeof http.IncomingMessage,
  typeof http.ServerResponse
>;

let errorInGetProducts = false;
let errorInGetProductsGraphQL = false;
let errorInAddToShoppingCart = false;
let errorInAddToShoppingCartGraphQL = false;
let errorInGetProductCount = false;
let errorInGetProductCountGraphQL = false;

interface MockProduct {
  id: string;
  data: {
    brand: string;
    name: string;
    rating: string;
    price: number;
    deliveryDate: string;
    image: string;
  }
}

const mockProducts: MockProduct[] = []
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
  })
}

const handlers = [
  graphql.query('GetProducts', ({ query }) => {
    console.log(query);
    if (errorInGetProducts) {
      if (errorInGetProductsGraphQL) {
        return HttpResponse.json(
          {
            errors: [
              {
                message: 'test errorInGetProducts',
              },
            ],
          },
          { status: 200 }
        );
      }
      return HttpResponse.json(
        {
          errors: [
            {
              message: 'test errorInGetProducts',
            },
          ],
        },
        { status: 400 }
      );
    } else {
      return HttpResponse.json(
        {
          data: {
            getProducts: mockProducts
          },
        },
        { status: 200 }
      );
    }
  }),

  graphql.query('getProductCount', ({ query }) => {
    console.log(query);
    if (errorInGetProductCount) {
      if (errorInGetProductCountGraphQL) {
        return HttpResponse.json(
          {
            errors: [
              {
                message: 'test errorInGetProductCount',
              },
            ],
          },
          { status: 200 }
        );
      }
      return HttpResponse.json(
        {
          errors: [
            {
              message: 'test errorInGetProductCount',
            },
          ],
        },
        { status: 400 }
      );
    } else {
      return HttpResponse.json(
        {
          data: {
            getProductCount: 31,
          },
        },
        { status: 200 }
      );
    }
  }),
  graphql.mutation('AddToShoppingCart', ({ query }) => {
    console.log(query);
    if (errorInAddToShoppingCart) {
      if (errorInAddToShoppingCartGraphQL) {
        return HttpResponse.json(
          {
            errors: [
              {
                message: 'test errorInGetProducts',
              },
            ],
          },
          { status: 200 }
        );
      }
      return HttpResponse.json(
        {
          errors: [
            {
              message: 'test errorInGetProducts',
            },
          ],
        },
        { status: 400 }
      );
    } else {
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
    }
  }),
];

const microServices = setupServer(...handlers);

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

beforeEach(() => {
  errorInGetProducts = false;
  errorInGetProductsGraphQL = false;
  errorInAddToShoppingCart = false;
  errorInAddToShoppingCartGraphQL = false;
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

jest.mock('notistack', () => ({
  ...jest.requireActual('notistack'),
  enqueueSnackbar: jest.fn(),
}));

(enqueueSnackbar as jest.Mock).mockImplementation(jest.fn());

it('Tries to access index page with user logged out', async () => {
  localStorage.setItem('user', '{}');
  const emptyLoggedInContextProps = {
    accessToken: 'abc',
    setAccessToken: jest.fn(),
    location: 'content',
    setLocation: jest.fn(),
    locale: 'en',
    setLocale: jest.fn(),
    user: {} as User,
    setUser: jest.fn(),
  };
  render(
    <AppContext.Provider value={AppContextProps}>
      <SnackbarProvider>
        <LoggedInContext.Provider value={emptyLoggedInContextProps}>
          <Products />
        </LoggedInContext.Provider>
      </SnackbarProvider>
    </AppContext.Provider>
  );
  // fireEvent.click(screen.getByLabelText('backdrop'));
});

it('Renders successfully and clicks next page', async () => {
  jest.mock('next/router', () => ({
    useRouter: () => ({
      basePath: '',
      pathname: '/',
      query: { active: true },
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
        <Products />
      </SnackbarProvider>
    </AppContext.Provider>
  );

  const secondPage = await screen.findByRole('button', {
    name: 'Go to page 2',
  });
  await userEvent.click(secondPage);
});
