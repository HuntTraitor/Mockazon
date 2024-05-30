import React from 'react';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import http from 'http';
import { setupServer } from 'msw/node';
import requestHandler from '../../api/requestHandler';
import MainPageProductCard from '@/views/product/MainPageProductCard';
import { AppContext } from '@/contexts/AppContext';
import { enqueueSnackbar, SnackbarProvider } from 'notistack';

let server: http.Server<
  typeof http.IncomingMessage,
  typeof http.ServerResponse
>;

const microServices = setupServer();

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

const mockProductWithLongName = {
  id: 'bfb2e5a9-f2d5-40a0-975d-85ac58902147',
  quantity: 1,
  data: {
    brand: 'Test Brand',
    name: 'Test product nameTest product nameTest product nameTest product nameTest product nameTest product nameTest product nameTest product nameTest product nameTest product nameTest product name',
    rating: '4 stars',
    price: 12.99,
    deliveryDate: '2024-05-20',
    image: 'http://some-image.jpg',
    description: 'test description',
  },
};

it('Loads product', async () => {
  render(
    <AppContext.Provider value={AppContextProps}>
      <SnackbarProvider>
        <MainPageProductCard product={mockProduct} />
      </SnackbarProvider>
    </AppContext.Provider>
  );
  expect(screen.getByText(mockProduct.data.name)).toBeInTheDocument();
});

it('Loads product with truncated name', async () => {
  render(
    <AppContext.Provider value={AppContextProps}>
      <SnackbarProvider>
        <MainPageProductCard product={mockProductWithLongName} />
      </SnackbarProvider>
    </AppContext.Provider>
  );
  expect(
    screen.getByText('Test product nameTest product nameTest p...', {
      exact: false,
    })
  ).toBeInTheDocument();
});
