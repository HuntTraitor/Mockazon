// test products component

import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import Products from '@/pages/products';
import { getServerSideProps } from '@/pages/products';
import http from 'http';

import { http as rest, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

import requestHandler from '../../api/requestHandler';

let server: http.Server<
  typeof http.IncomingMessage,
  typeof http.ServerResponse
>;

let error = false;
let errorInShoppingCart = false;

const handlers = [
  rest.get(
    `http://${process.env.MICROSERVICE_URL || 'localhost'}:3011/api/v0/product`,
    async () => {
      if (error) {
        return HttpResponse.json(
          [
            {
              id: 'some id',
              data: {
                brand: 'test',
                name: 'test',
                rating: 'test',
                price: 1,
                deliveryDate: 'test',
                image: 'test',
              },
            },
          ],
          { status: 400 }
        );
      } else {
        return HttpResponse.json(
          [
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
          { status: 200 }
        );
      }
    }
  ),
  rest.post(
    `http://${process.env.MICROSERVICE_URL || 'localhost'}:3012/api/v0/shoppingCart`,
    async () => {
      if (errorInShoppingCart) {
        return HttpResponse.json({}, { status: 400 });
      } else {
        return HttpResponse.json({}, { status: 200 });
      }
    }
  ),
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
  render(<Products />);
  await waitFor(() => expect(screen.getByText('test name')));
});

it('Adds to shopping cart', async () => {
  localStorage.setItem(
    'user',
    JSON.stringify({
      accessToken: 'abc',
      id: 'abc',
      name: 'Trevor',
      role: 'Shopper',
    })
  );
  render(<Products />);
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
  render(<Products />);
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
  render(<Products />);
});
