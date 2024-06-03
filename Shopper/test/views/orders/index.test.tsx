import http from 'http';
import { graphql, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

import requestHandler from '../../api/requestHandler';
import {render, waitFor, screen} from "@testing-library/react";
import Index from "../../../src/pages/orders";
import {getServerSideProps} from "@/pages/orders";
import {LoggedInContext, User} from '@/contexts/LoggedInUserContext';
import { AppContext } from '@/contexts/AppContext';
import {enqueueSnackbar} from "notistack";
import React from "react";

jest.mock('next/config', () => () => ({
  publicRuntimeConfig: { basePath: '' },
}));

let server: http.Server<
  typeof http.IncomingMessage,
  typeof http.ServerResponse
>;

let errorInGetAllOrders = false;

const handlers = [
  graphql.query('getAllOrders', () => {
    if (errorInGetAllOrders) {
      return HttpResponse.json(
        { errors: [{ message: 'error' }] },
        { status: 400 }
      );
    } else {
      return HttpResponse.json(
        {
          data: {
            getAllOrders: [
              {
                id: '123',
                createdAt: '2022-01-01T00:00:00Z',
                shippingAddress: {
                  name: 'test address name',
                  addressLine1: 'test',
                  city: 'test',
                  state: 'test',
                  postalCode: 'test',
                  country: 'test',
                },
                paymentMethod: 'test',
                paymentDigits: 'test',
                paymentBrand: 'test',
                subtotal: 1,
                tax: 1,
                total: 1,
                shipped: true,
                delivered: true,
                deliveryTime: 'test',
                products: [
                  {
                    id: '123',
                    quantity: 1,
                    data: {
                      name: 'test',
                      brand: 'test',
                      image: 'test',
                      price: 1,
                      rating: 'test',
                      description: 'test',
                      deliveryDate: 'test',
                    },
                  },
                ],
              },
              {
                id: '456',
                createdAt: '2022-02-03T00:00:00Z',
                shippingAddress: {
                  name: 'test',
                  addressLine1: 'test',
                  city: 'test',
                  state: 'test',
                  postalCode: 'test',
                  country: 'test',
                },
                paymentMethod: 'test',
                paymentDigits: 'test',
                paymentBrand: 'test',
                subtotal: 1,
                tax: 1,
                total: 1,
                shipped: true,
                delivered: true,
                deliveryTime: 'test',
                products: [
                  {
                    id: '123',
                    quantity: 1,
                    data: {
                      name: 'test',
                      brand: 'test',
                      image: 'test',
                      price: 1,
                      rating: 'test',
                      description: 'test',
                      deliveryDate: 'test',
                    },
                  },
                ],
              },
              {
                id: '789',
                createdAt: '2022-02-02T00:00:00Z',
                shippingAddress: {
                  name: 'test',
                  addressLine1: 'test',
                  city: 'test',
                  state: 'test',
                  postalCode: 'test',
                  country: 'test',
                },
                paymentMethod: 'test',
                paymentDigits: 'test',
                paymentBrand: 'test',
                subtotal: 1,
                tax: 1,
                total: 1,
                shipped: true,
                delivered: true,
                deliveryTime: 'test',
                products: [
                  {
                    id: '123',
                    quantity: 1,
                    data: {
                      name: 'test',
                      brand: 'test',
                      image: 'test',
                      price: 1,
                      rating: 'test',
                      description: 'test',
                      deliveryDate: 'test',
                    },
                  },
                ],
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
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
    },
  }),
}));

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


const loggedInContextProps = {
  accessToken: 'abc',
  setAccessToken: jest.fn(),
  location: 'content',
  setLocation: jest.fn(),
  locale: 'en',
  setLocale: jest.fn(),
  user: {} as User,
  setUser: jest.fn(),
};

const loggedInContextPropsWithNoAccessToken = {
  accessToken: '',
  setAccessToken: jest.fn(),
  location: 'content',
  setLocation: jest.fn(),
  locale: 'en',
  setLocale: jest.fn(),
  user: {} as User,
  setUser: jest.fn(),
};

it('Renders successfully', async () => {
  const mockUser = {
    accessToken: 'testToken',
    id: 'testId',
    name: 'testName',
    role: 'testRole',
  };
  localStorage.setItem('user', JSON.stringify(mockUser));
  const WrappedIndex = Index.getLayout(<Index />);

  render(
    <AppContext.Provider value={AppContextProps}>
      <LoggedInContext.Provider value={loggedInContextProps}>
        {WrappedIndex}
      </LoggedInContext.Provider>
    </AppContext.Provider>
  )
  await waitFor(() => {
    screen.getByText('test address name');
  });
});

it('Renders without access token', async () => {
  const mockUser = {
    accessToken: 'testToken',
    id: 'testId',
    name: 'testName',
    role: 'testRole',
  };
  localStorage.setItem('user', JSON.stringify(mockUser));
  render(
    <AppContext.Provider value={AppContextProps}>
      <LoggedInContext.Provider value={loggedInContextPropsWithNoAccessToken}>
        <Index />
      </LoggedInContext.Provider>
    </AppContext.Provider>
  )
});

it('Errors in getAllOrders', async () => {
  errorInGetAllOrders = true;
  const mockUser = {
    accessToken: 'testToken',
    id: 'testId',
    name: 'testName',
    role: 'testRole',
  };
  localStorage.setItem('user', JSON.stringify(mockUser));
  render(
    <AppContext.Provider value={AppContextProps}>
      <LoggedInContext.Provider value={loggedInContextProps}>
        <Index />
      </LoggedInContext.Provider>
    </AppContext.Provider>
  )
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

it('Has no user access token', async () => {
  localStorage.removeItem('user');
  render(
    <AppContext.Provider value={AppContextProps}>
      <LoggedInContext.Provider value={loggedInContextProps}>
        <Index />
      </LoggedInContext.Provider>
    </AppContext.Provider>
  )
});
