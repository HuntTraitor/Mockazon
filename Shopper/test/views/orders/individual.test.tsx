import http from 'http';
import { graphql, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

import requestHandler from '../../api/requestHandler';
import { render, waitFor, screen } from '@testing-library/react';
import Individual from '../../../src/pages/orders/[id]';
import { getServerSideProps } from '@/pages/orders/[id]';
import { LoggedInContext, User } from '@/contexts/LoggedInUserContext';
import { AppContext } from '@/contexts/AppContext';
import { enqueueSnackbar } from 'notistack';
import React from 'react';
import {randomUUID} from "crypto";

jest.mock('next/router', () => ({
  useRouter: () => ({
    basePath: '',
    pathname: '/',
    query: { id: randomUUID() },
    asPath: '/products/1',
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

jest.mock('next/config', () => () => ({
  publicRuntimeConfig: { basePath: '' },
}));

let server: http.Server<
  typeof http.IncomingMessage,
  typeof http.ServerResponse
>;

let errorInGetOrder = false;
let errorInGetOrderGraphQL = false;
let renderWithNullOrder = false;

const handlers = [
  graphql.query('GetOrder', () => {
    if(renderWithNullOrder) {
      return HttpResponse.json(
        { data: { getOrder: null } },
        { status: 200 }
      );
    }
    if (errorInGetOrder) {
      if (errorInGetOrderGraphQL) {
        return HttpResponse.json(
          { errors: [{ message: 'error' }] },
          { status: 200 }
        );
      }else{
        return HttpResponse.json(
          { errors: [{ message: 'error' }] },
          { status: 400 }
        );
      }

    } else {
      return HttpResponse.json(
        {
          data: {
            getOrder: {
              id: 'testId',
              paymentDigits: '1234',
              paymentBrand: 'Visa',
              subtotal: 100,
              tax: 10,
              total: 110,
              shipped: true,
              delivered: true,
              deliveryTime: '2021-12-12',
              products: [
                {
                  id: 'testId',
                  quantity: 1,
                  data: {
                    name: 'testName',
                    brand: 'testBrand',
                    image: 'testImage',
                    price: 100,
                    rating: 5,
                    description: 'testDescription',
                    deliveryDate: '2021-12-12',
                  },
                },
              ],
            }
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

  render(
    <AppContext.Provider value={AppContextProps}>
      <LoggedInContext.Provider value={loggedInContextProps}>
        <Individual />
      </LoggedInContext.Provider>
    </AppContext.Provider>
  );
});

it('Renders unsuccessfully', async () => {
  errorInGetOrder = true;
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
        <Individual />
      </LoggedInContext.Provider>
    </AppContext.Provider>
  );
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
        <Individual />
      </LoggedInContext.Provider>
    </AppContext.Provider>
  );
});

it('Errors in getAllOrders', async () => {
  errorInGetOrder = true;
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
        <Individual />
      </LoggedInContext.Provider>
    </AppContext.Provider>
  );
});

it('Errors in getOrderGraphQL', async () => {
  errorInGetOrderGraphQL = true;
  errorInGetOrder = true;
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
        <Individual />
      </LoggedInContext.Provider>
    </AppContext.Provider>
  );
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
        <Individual />
      </LoggedInContext.Provider>
    </AppContext.Provider>
  );
});

it('Renders with null order', async () => {
  renderWithNullOrder = true;
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
        <Individual />
      </LoggedInContext.Provider>
    </AppContext.Provider>
  );
});
