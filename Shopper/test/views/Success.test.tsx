import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import http from 'http';
import { graphql, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

import requestHandler from '../api/requestHandler';
import Success from '@/pages/orders/success';
import { getServerSideProps } from '@/pages/orders/success';
import { AppContext } from '@/contexts/AppContext';

jest.mock('next/config', () => () => ({
  publicRuntimeConfig: { basePath: '' },
}));

let server: http.Server<
  typeof http.IncomingMessage,
  typeof http.ServerResponse
>;

const AppContextProps = {
  backDropOpen: false,
  setBackDropOpen: jest.fn(),
  mockazonMenuDrawerOpen: false,
  setMockazonMenuDrawerOpen: jest.fn(),
};

jest.mock('next/router', () => ({
  useRouter: () => ({
    basePath: '',
    pathname: '/',
    query: { id: '1' },
    asPath: '/products/1',
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

const errorInShoppingCart = false;

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
];

const microServices = setupServer(...handlers);

beforeAll(async () => {
  microServices.listen({ onUnhandledRequest: 'bypass' });
  server = http.createServer(requestHandler);
  server.listen();
});

beforeEach(() => {
  microServices.resetHandlers();
});

afterAll(done => {
  microServices.close();
  server.close(done);
});

it('Renders one item successfully', async () => {
  render(
    <AppContext.Provider
      value={{
        ...AppContextProps,
        backDropOpen: true,
      }}
    >
      <Success />
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

it('Click Backdrop', () => {
  render(
    <AppContext.Provider
      value={{
        ...AppContextProps,
        backDropOpen: true,
      }}
    >
      <Success />
    </AppContext.Provider>
  );
  const backdrop = document.querySelector('.MuiBackdrop-root');
  if (backdrop) {
    fireEvent.click(backdrop);
  }
});
