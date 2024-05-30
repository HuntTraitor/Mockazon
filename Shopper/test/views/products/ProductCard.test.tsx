import React from 'react';
import {
  fireEvent,
  render, waitFor,
  // waitFor
} from '@testing-library/react';
import {
  // fireEvent,
  screen,
  // waitFor
} from '@testing-library/dom';
import http from 'http';

import { HttpResponse, graphql } from 'msw';
import { setupServer } from 'msw/node';
import requestHandler from '../../api/requestHandler';
import ProductCard from '@/views/product/ProductCard';
import { AppContext } from '@/contexts/AppContext';
import {enqueueSnackbar, SnackbarProvider} from 'notistack';

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

jest.mock('notistack', () => ({
  ...jest.requireActual('notistack'),
  enqueueSnackbar: jest.fn(),
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

(enqueueSnackbar as jest.Mock).mockImplementation(jest.fn());


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
  quantity: 1,
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

it('Renders ProductCard successfully', async () => {
  render(<ProductCard product={mockProduct} />);
  expect(screen.getByText(mockProduct.data.name)).toBeDefined();
  expect(screen.getByText('$')).toBeDefined();
  expect(screen.getByText('12')).toBeDefined();
  expect(screen.getByText('99')).toBeDefined();
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
    <AppContext.Provider value={AppContextProps}>
      <SnackbarProvider>
        <ProductCard product={mockProduct} />
      </SnackbarProvider>
    </AppContext.Provider>
  );
  fireEvent.click(screen.getByLabelText('Add to cart button'));
  await waitFor(() => {
    expect(enqueueSnackbar).toHaveBeenCalledWith(expect.stringContaining('productAddedToCart'), expect.anything());
  });
});

it('Clicks on add to shopping cart error', async () => {
  returnError = true;
  render(
    <AppContext.Provider value={AppContextProps}>
      <SnackbarProvider>
        <ProductCard product={mockProduct} />
      </SnackbarProvider>
    </AppContext.Provider>
  );
  fireEvent.click(screen.getByLabelText('Add to cart button'));
  await waitFor(() => {
    expect(enqueueSnackbar).toHaveBeenCalledWith(expect.stringContaining('productNotAddedToCart'), expect.anything());
  });
});

it('Clicks on the product image', async () => {
  render(
    <AppContext.Provider value={AppContextProps}>
      <SnackbarProvider>
        <ProductCard product={mockProduct} />
      </SnackbarProvider>
    </AppContext.Provider>
  );
  fireEvent.click(screen.getByAltText('productImageAlt'));
});

it('Clicks on the product text link', async () => {
  render(
    <AppContext.Provider value={AppContextProps}>
      <SnackbarProvider>
        <ProductCard product={mockProduct} />
      </SnackbarProvider>
    </AppContext.Provider>
  );
  fireEvent.click(screen.getByText('Test product name'));
});
