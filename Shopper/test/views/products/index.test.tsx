import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import Products from '@/pages/products';
import { getServerSideProps } from '@/pages/products';
import http from 'http';
import { AppContext } from '@/contexts/AppContext';

import { HttpResponse, graphql } from 'msw';
import { setupServer } from 'msw/node';

import requestHandler from '../../api/requestHandler';
import { enqueueSnackbar, SnackbarProvider } from 'notistack';
import { LoggedInContext, User } from '@/contexts/LoggedInUserContext';
import userEvent from '@testing-library/user-event';
import { randomUUID } from 'crypto';

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
let errorInGetProductCount = false;
const errorInGetProductCountGraphQL = false;

interface MockProduct {
  id: string;
  data: {
    brand: string;
    name: string;
    rating: string;
    price: number;
    deliveryDate: string;
    image: string;
  };
}
const mockProducts: MockProduct[] = [];
for (let i = 0; i < 31; i++) {
  mockProducts.push({
    id: 'some id',
    data: {
      brand: 'test',
      name: 'test name',
      rating: 'test',
      price: 1,
      deliveryDate: 'test',
      image: 'https://test-image.jpg',
    },
  });
}

const handlers = [
  graphql.query('getProductCount', ({ query }) => {
    console.log(query);
    if (errorInGetProductCount) {
      if (errorInGetProductCountGraphQL) {
        return HttpResponse.json(
          {
            errors: [
              {
                message: 'test errorInGetProductCount',
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
              message: 'test errorInGetProductCount',
            },
          ],
        },
        { status: 400 }
      );
    } else {
      return HttpResponse.json(
        {
          data: {
            getProductCount: 31,
          },
        },
        { status: 200 }
      );
    }
  }),
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
          errors: [],
        },
        { status: 400 }
      );
    } else {
      return HttpResponse.json(
        {
          data: {
            getProducts: mockProducts,
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
          errors: [],
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
                products: mockProducts,
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

const active = true;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let queryParams: any = {
  active: active,
};

jest.mock('next/router', () => ({
  useRouter: () => ({
    basePath: '',
    pathname: '/',
    query: queryParams,
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
let mobile = false;
const AppContextProps = {
  backDropOpen: false,
  setBackDropOpen: jest.fn(),
  mockazonMenuDrawerOpen: false,
  setMockazonMenuDrawerOpen: jest.fn(),
  isMobile: mobile,
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

  await waitFor(() => screen.getAllByText('test name'));
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
  await waitFor(() => expect(screen.getAllByLabelText('Add to cart button')));
  const button = screen.getAllByLabelText('Add to cart button')[0];
  fireEvent.click(button);
  await waitFor(() => {
    expect(enqueueSnackbar).toHaveBeenCalledWith(
      'productAddedToCart',
      expect.anything()
    );
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

  await waitFor(() => screen.getAllByLabelText('Add to cart button'));
  const button = screen.getAllByLabelText('Add to cart button')[0];
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

  await waitFor(() => expect(screen.getAllByText('test name')));
  const button = screen.getAllByLabelText('Add to cart button')[0];
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

  await waitFor(() => screen.getAllByText('test name'));
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

  await waitFor(() => screen.getAllByText('test name'));
});

it('Tries to access index page with user logged out', async () => {
  localStorage.setItem('user', '{}');
  const emptyLoggedInContextProps = {
    accessToken: 'abc',
    setAccessToken: jest.fn(),
    location: 'content',
    setLocation: jest.fn(),
    locale: 'en',
    setLocale: jest.fn(),
    user: {} as User,
    setUser: jest.fn(),
  };
  render(
    <AppContext.Provider value={AppContextProps}>
      <SnackbarProvider>
        <LoggedInContext.Provider value={emptyLoggedInContextProps}>
          <Products />
        </LoggedInContext.Provider>
      </SnackbarProvider>
    </AppContext.Provider>
  );
  // fireEvent.click(screen.getByLabelText('backdrop'));
});

it('Renders successfully and clicks next page', async () => {
  queryParams = {};
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

  const secondPage = await screen.findByRole('button', {
    name: 'Go to page 2',
  });
  await userEvent.click(secondPage);
});

it('Renders with error in proudct count', async () => {
  errorInGetProductCount = true;
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

  await waitFor(() => screen.getAllByText('test name'));
});

it('Renders successfully with vendorId', async () => {
  queryParams = { vendorId: randomUUID() };
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
});

it('Renders successfully with page', async () => {
  queryParams = { page: '3' };
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
});

it('Renders successfully with pageSize', async () => {
  queryParams = { pageSize: '3' };
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
});

it('Renders successfully with search', async () => {
  queryParams = { search: '3' };
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
});

it('Renders successfully with orderBy', async () => {
  queryParams = { orderBy: 'count' };
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
});

it('Renders successfully with descending', async () => {
  queryParams = { descending: 'true' };
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
});

it('Renders successfully no query params', async () => {
  queryParams = {};
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
});

it('Renders successfully no query params and mobile set', async () => {
  queryParams = {};
  mobile = true;
  window.matchMedia = jest.fn().mockImplementation(query => {
    const isSmallScreen = true;
    AppContextProps.isMobile = true;
    return {
      matches: isSmallScreen, // Mock 'sm' breakpoint to always match
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    };
  });
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
});
