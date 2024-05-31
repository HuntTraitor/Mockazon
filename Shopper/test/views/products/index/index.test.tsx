import React from 'react';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import Products from '@/pages/products';
import { getServerSideProps } from '@/pages/products';
import http from 'http';
import { AppContext } from '@/contexts/AppContext';

import { HttpResponse, graphql } from 'msw';
import { setupServer } from 'msw/node';

import requestHandler from '../../../api/requestHandler';
import {enqueueSnackbar, SnackbarProvider} from 'notistack';

let server: http.Server<
  typeof http.IncomingMessage,
  typeof http.ServerResponse
>;

let errorInGetProducts = false;
let errorInGetProductsGraphQL = false;
let errorInAddToShoppingCart = false;
let errorInAddToShoppingCartGraphQL = false;
let errorInGetAllOrders = false;
let errorInGetAllOrdersGraphQL = false;

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
                  // image: 'test',
                },
              },
            ],
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
  graphql.query('GetAllOrders', ({ query }) => {
    console.log(query);
    if (errorInGetAllOrders) {
      if (errorInGetAllOrdersGraphQL) {
        return HttpResponse.json(
          {
            errors: [
              {
                message: 'test errorInGetAllOrders',
              },
            ],
          },
          { status: 200 }
        );
      }
      return HttpResponse.json(
        {
          errors: [
          ],
        },
        { status: 400 }
      );
    } else {
      return HttpResponse.json(
        {
          data: {
            getAllOrders: [
              {
                id: 'some id',
                quantity: 1,
                data: {
                  brand: 'test',
                  name: 'test name',
                  rating: 'test',
                  price: 1,
                  deliveryDate: 'test',
                  image: 'test',
                  description: 'test',
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

beforeEach(() => {
  errorInGetProducts = false;
  errorInGetProductsGraphQL = false;
  errorInAddToShoppingCart = false;
  errorInAddToShoppingCartGraphQL = false;
  errorInGetAllOrders = false;
  errorInGetAllOrdersGraphQL = false;
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

it('Renders successfully', async () => {
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

  await waitFor(() => screen.getByText('test name'));
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
      <SnackbarProvider>
        <Products />
      </SnackbarProvider>
    </AppContext.Provider>
  );
  await waitFor(() => expect(screen.getByLabelText('Add to cart button')));
  const button = screen.getByLabelText('Add to cart button');
  fireEvent.click(button);
  await waitFor(() => {
    expect(enqueueSnackbar).toHaveBeenCalledWith('productAddedToCart', expect.anything());
  });
});

it("Doesn't add to shopping cart because error in add to shopping cart", async () => {
  localStorage.setItem(
    'user',
    JSON.stringify({
      accessToken: 'abc',
      id: 'abc',
      name: 'John',
      role: 'Shopper',
    })
  );

  errorInAddToShoppingCart = true;

  render(
    <AppContext.Provider value={AppContextProps}>
      <SnackbarProvider>
        <Products />
      </SnackbarProvider>
    </AppContext.Provider>
  );

  await waitFor(() => screen.getByLabelText('Add to cart button'));
  const button = screen.getByLabelText('Add to cart button');
  fireEvent.click(button);
  await waitFor(() => {
    expect(enqueueSnackbar).toHaveBeenNthCalledWith(
      2,
      'productNotAddedToCart',
      expect.anything()
    );
  });
  await waitFor(() => {
    expect(enqueueSnackbar).toHaveBeenNthCalledWith(
      2,
      'productNotAddedToCart',
      expect.anything()
    );
  });
});

it("Doesn't add to shopping cart because error in add to shopping cart graphql", async () => {
  localStorage.setItem(
    'user',
    JSON.stringify({
      accessToken: 'abc',
      id: 'abc',
      name: 'John',
      role: 'Shopper',
    })
  );

  errorInAddToShoppingCart = true;
  errorInAddToShoppingCartGraphQL = true;

  render(
    <AppContext.Provider value={AppContextProps}>
      <SnackbarProvider>
        <Products />
      </SnackbarProvider>
    </AppContext.Provider>
  );

  await waitFor(() => expect(screen.getByText('test name')));
  const button = screen.getByLabelText('Add to cart button');
  fireEvent.click(button);
  await waitFor(() => {
    expect(enqueueSnackbar).toHaveBeenNthCalledWith(
      2,
      'productNotAddedToCart',
      expect.anything()
    );
  });
});

it('should fetch server side props with translations', async () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-errorInGetProducts
  await getServerSideProps({ locale: 'en' });
});

it('should fetch server side props with translations without locale', async () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-errorInGetProducts
  await getServerSideProps({});
});

it('Renders with error in get products', async () => {
  errorInGetProducts = true;
  errorInGetProductsGraphQL = false;
  render(
    <AppContext.Provider value={AppContextProps}>
      <SnackbarProvider>
        <Products />
      </SnackbarProvider>
    </AppContext.Provider>
  );
});

it('Renders error in get products graphql', async () => {
  errorInGetProducts = true;
  errorInGetProductsGraphQL = true;
  render(
    <AppContext.Provider value={AppContextProps}>
      <SnackbarProvider>
        <Products />
      </SnackbarProvider>
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
      <SnackbarProvider>
        <Products />
      </SnackbarProvider>
    </AppContext.Provider>
  );
  const backdrop = document.querySelector('.MuiBackdrop-root');
  if (backdrop) {
    fireEvent.click(backdrop);
  }
});

it('Renders with error in get all orders graphql', async () => {
  errorInGetAllOrders = true;
  errorInGetAllOrdersGraphQL = true;
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

  await waitFor(() => screen.getByText('test name'));
});

it('Renders with error in get all orders', async () => {
  errorInGetAllOrders = true;
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

  await waitFor(() => screen.getByText('test name'));
});
