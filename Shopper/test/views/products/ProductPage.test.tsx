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
import ProductPage from '@/pages/products/[id]';
import userEvent from '@testing-library/user-event';

let server: http.Server<
  typeof http.IncomingMessage,
  typeof http.ServerResponse
>;

let returnError = false;

const handlers = [
  graphql.query('getProduct', ({ query }) => {
    if (returnError) {
      return HttpResponse.json({
        errors: [
          {
            message: 'Some Error',
          },
        ],
      });
    }
    return HttpResponse.json({
      data: {
        getProduct: mockProduct,
      },
    });
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
  returnError = false;
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
    deliveryDate: '2024-05-20',
    image: 'http://some-image.jpg',
    description: 'test description',
  },
};

it('Renders ProductPage successfully', async () => {
  render(<ProductPage />);
  await waitFor(() => {
    expect(screen.getByText(mockProduct.data.name)).toBeDefined();
  });
});

it('Renders ProductPage with an error', async () => {
  returnError = true;
  render(<ProductPage />);
  await waitFor(() => {
    expect(screen.getByText('Could not fetch product')).toBeInTheDocument();
  });
});

it('Clicks on quantity on productPage', async () => {
  render(<ProductPage />);
  await waitFor(() => {
    const field = screen.getByLabelText('Quantity Selector');
    expect(field).toBeInTheDocument();
  });
  await userEvent.click(screen.getByText('1'));
  expect(screen.getByText('3')).toBeInTheDocument();
  await userEvent.click(screen.getByText('3'));
});
