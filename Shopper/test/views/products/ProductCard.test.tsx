import React from 'react';
import {
  render,
  // waitFor
} from '@testing-library/react';
import { fireEvent, screen, waitFor } from '@testing-library/dom';
import http from 'http';

import { HttpResponse, graphql } from 'msw';
import { setupServer } from 'msw/node';
import requestHandler from '../../api/requestHandler';
import ProductCard from '@/views/product/ProductCard';
import { SnackbarProvider, useSnackbar } from 'notistack';

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

const mockProduct = {
  id: 'bfb2e5a9-f2d5-40a0-975d-85ac58902147',
  data: {
    brand: 'Test Brand',
    name: 'Test product name',
    rating: '4 stars',
    price: 12.99,
    deliveryDate: '2020-06-15',
    image: 'http://some-image.jpg',
  },
};

it('Renders ProductCard successfully', async () => {
  render(<ProductCard product={mockProduct} />);
  expect(screen.getByText(mockProduct.data.name)).toBeDefined();
  expect(screen.getByText('$')).toBeDefined();
  expect(screen.getByText('12')).toBeDefined();
  expect(screen.getByText('99')).toBeDefined();
  expect(screen.getByText('Sun, Jun 14')).toBeDefined();
});

it('Renders ProductCard with a weird price successful', async () => {
  const newProduct = mockProduct;
  newProduct.data.price = 12;
  console.log(newProduct);
  render(<ProductCard product={newProduct} />);
  expect(screen.getByText('$')).toBeDefined();
  expect(screen.getByText('12')).toBeDefined();
  expect(screen.getByText('00')).toBeDefined();
});

it('Clicks on add to shopping cart', async () => {
  render(
    <SnackbarProvider>
      <ProductCard product={mockProduct} />
    </SnackbarProvider>
  );
  fireEvent.click(screen.getByLabelText('Add to cart button'));
  await waitFor(() => {
    expect(screen.getByText('Added to shopping cart')).toBeDefined();
  });
});

it('Clicks on add to shopping cart error', async () => {
  returnError = true;
  render(
    <SnackbarProvider>
      <ProductCard product={mockProduct} />
    </SnackbarProvider>
  );
  fireEvent.click(screen.getByLabelText('Add to cart button'));
  await waitFor(() => {
    expect(screen.getByText('Could not add product to cart')).toBeDefined();
  });
});
