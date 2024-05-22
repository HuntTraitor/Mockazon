import React from 'react';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import http from 'http';
import { graphql, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

import requestHandler from '../api/requestHandler';
import Subtotal from '@/views/Subtotal';

jest.mock('next/config', () => () => ({
  publicRuntimeConfig: { basePath: '' },
}));

let server: http.Server<
  typeof http.IncomingMessage,
  typeof http.ServerResponse
>;

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
  render(<Subtotal subtotal={100.5} numberOfProducts={1} />);
  expect(screen.getByText('item', { exact: false }));
  expect(screen.getByText('100.5', { exact: false }));
});

it('Renders two items successfully', async () => {
  render(<Subtotal subtotal={100.5} numberOfProducts={2} />);
  expect(screen.getByText('items', { exact: false }));
  expect(screen.getByText('100.5', { exact: false }));
});
