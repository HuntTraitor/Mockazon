// test products component

import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import Products from '@/pages/products';
import { getServerSideProps } from '@/pages/products';
import http from 'http';
import { AppContext } from '@/contexts/AppContext';

import { HttpResponse, graphql } from 'msw';
import { setupServer } from 'msw/node';

import requestHandler from '../../api/requestHandler';

let server: http.Server<
  typeof http.IncomingMessage,
  typeof http.ServerResponse
>;

let error = false;
let errorInShoppingCart = false;

const handlers = [
  graphql.query('GetProducts', ({ query }) => {
    console.log(query);
    if (error) {
      return HttpResponse.json(
        {
          errors: [
            {
              message: 'test error',
            },
          ],
        },
        { status: 400 }
      );
    } else {
      return HttpResponse.json(
        {
          data: {
            getProducts: [
              {
                id: 'some id',
                data: {
                  brand: 'test',
                  name: 'test name',
                  rating: 'test',
                  price: 1,
                  deliveryDate: 'test',
                  image: 'test',
                },
              },
            ],
          },
        },
        { status: 200 }
      );
    }
  }),
  graphql.query('AddProduct', ({ query /*variables*/ }) => {
    console.log(query);
    if (errorInShoppingCart) {
      return HttpResponse.json({}, { status: 400 });
    } else {
      return HttpResponse.json({}, { status: 200 });
    }
  }),
];

const microServices = setupServer(...handlers);

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

const AppContextProps = {
  backDropOpen: false,
  setBackDropOpen: jest.fn(),
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
      <Products />
    </AppContext.Provider>
  );
  // expect(screen.getByText('test name'));
  await waitFor(() => expect(screen.getByText('test name')));
});

it('Adds to shopping cart', async () => {
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
      <Products />
    </AppContext.Provider>
  );
  await waitFor(() => expect(screen.getByText('test name')));
  const button = screen.getByText('Add to Shopping Cart');
  fireEvent.click(button);
});

it("Doesn't add to shopping cart because error", async () => {
  localStorage.setItem(
    'user',
    JSON.stringify({
      accessToken: 'abc',
      id: 'abc',
      name: 'Trevor',
      role: 'Shopper',
    })
  );
  errorInShoppingCart = true;
  render(
    <AppContext.Provider value={AppContextProps}>
      <Products />
    </AppContext.Provider>
  );
  await waitFor(() => expect(screen.getByText('test name')));
  const button = screen.getByText('Add to Shopping Cart');
  fireEvent.click(button);
  await waitFor(() => expect(screen.getByText('Could not fetch products')));
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

it('Renders with error', async () => {
  error = true;
  render(
    <AppContext.Provider value={AppContextProps}>
      <Products />
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
      <Products />
    </AppContext.Provider>
  );
  const backdrop = document.querySelector('.MuiBackdrop-root');
  if (backdrop) {
    fireEvent.click(backdrop);
  }
});
