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
import { SnackbarProvider, useSnackbar } from 'notistack';

let server: http.Server<
  typeof http.IncomingMessage,
  typeof http.ServerResponse
>;

let errorInGetProducts = false;
let errorInGetProductsGraphQL = false;
let errorInAddToShoppingCart = false;
let errorInAddToShoppingCartGraphQL = false;

const handlers = [
  graphql.query('GetProducts', ({ query }) => {
    console.log(query);
    if (errorInGetProducts) {
      if(errorInGetProductsGraphQL){
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
  graphql.mutation('AddToShoppingCart', ({ query }) => {
    console.log(query);
    if (errorInAddToShoppingCart) {
      if(errorInAddToShoppingCartGraphQL){
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
  mockazonMenuDrawerOpen: false,
  setMockazonMenuDrawerOpen: jest.fn(),
};

jest.mock('notistack', () => ({
  ...jest.requireActual('notistack'),
  useSnackbar: jest.fn(),
}));

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

  const mockEnqueueSnackbar = jest.fn();
  (useSnackbar as jest.Mock).mockReturnValue({ enqueueSnackbar: mockEnqueueSnackbar });

  render(
    <AppContext.Provider value={AppContextProps}>
      <SnackbarProvider>
        <Products />
      </SnackbarProvider>
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
  const mockEnqueueSnackbar = jest.fn();
  (useSnackbar as jest.Mock).mockReturnValue({ enqueueSnackbar: mockEnqueueSnackbar });

  render(
    <AppContext.Provider value={AppContextProps}>
      <SnackbarProvider>
        <Products />
      </SnackbarProvider>
    </AppContext.Provider>
  );
  await waitFor(() => expect(screen.getByText('test name')));
  const button = screen.getByText('Add to Shopping Cart');
  fireEvent.click(button);
  await waitFor(() => {
    expect(mockEnqueueSnackbar).toHaveBeenCalledWith('Added to shopping cart', {
      variant: 'success',
      persist: false,
      autoHideDuration: 3000,
      anchorOrigin: { horizontal: 'center', vertical: 'top' },
    });
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
  const mockEnqueueSnackbar = jest.fn();
  (useSnackbar as jest.Mock).mockReturnValue({ enqueueSnackbar: mockEnqueueSnackbar });
  errorInAddToShoppingCart = true;

  render(
    <AppContext.Provider value={AppContextProps}>
      <SnackbarProvider>
        <Products />
      </SnackbarProvider>
    </AppContext.Provider>
  );

  await waitFor(() => expect(screen.getByText('test name')));
  const button = screen.getByText('Add to Shopping Cart');
  fireEvent.click(button);
  await waitFor(() => {
    expect(mockEnqueueSnackbar).toHaveBeenCalledWith('Could not add product to cart', {
      variant: 'error',
      persist: false,
      autoHideDuration: 3000,
      anchorOrigin: { horizontal: 'center', vertical: 'top' },
    });
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

  const mockEnqueueSnackbar = jest.fn();
  (useSnackbar as jest.Mock).mockReturnValue({ enqueueSnackbar: mockEnqueueSnackbar });
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
  const button = screen.getByText('Add to Shopping Cart');
  fireEvent.click(button);
  await waitFor(() => {
    expect(mockEnqueueSnackbar).toHaveBeenCalledWith('Could not add product to cart', {
      variant: 'error',
      persist: false,
      autoHideDuration: 3000,
      anchorOrigin: { horizontal: 'center', vertical: 'top' },
    });
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
  render(
    <AppContext.Provider value={AppContextProps}>
      <Products />
    </AppContext.Provider>
  );
});

it('Renders error in get products graphql', async () => {
  errorInGetProducts = true;
  errorInGetProductsGraphQL = true;
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
