import React from 'react';
import {
  fireEvent,
  render,
  waitFor,
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
import requestHandler from '../api/requestHandler';
import { enqueueSnackbar, SnackbarProvider } from 'notistack';
import AccountDrawer from '@/views/AccountDrawer';
import { AppContext } from '@/contexts/AppContext';
import { LoggedInContext, User } from '@/contexts/LoggedInUserContext';
import Content from '@/views/Content';

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
  accountDrawerOpen: true,
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

it('Renders Account Drawer', async () => {
  render(
    <AppContext.Provider value={AppContextProps}>
      <LoggedInContext.Provider value={loggedInContextProps}>
        <AccountDrawer />
      </LoggedInContext.Provider>
    </AppContext.Provider>
  );
});

it('Renders Account Drawer and clicks Spanish', async () => {
  render(
    <AppContext.Provider value={AppContextProps}>
      <LoggedInContext.Provider value={loggedInContextProps}>
        <AccountDrawer />
      </LoggedInContext.Provider>
    </AppContext.Provider>
  );
  fireEvent.click(screen.getByLabelText('select spanish'));
  fireEvent.click(screen.getByLabelText('select english'));
});

it('Renders Account Drawer and signs out', async () => {
  render(
    <AppContext.Provider value={AppContextProps}>
      <LoggedInContext.Provider value={loggedInContextProps}>
        <AccountDrawer />
      </LoggedInContext.Provider>
    </AppContext.Provider>
  );
  fireEvent.click(screen.getByLabelText('sign out'));
});

it('Renders Account Drawer and goes to orders', async () => {
  render(
    <AppContext.Provider value={AppContextProps}>
      <LoggedInContext.Provider value={loggedInContextProps}>
        <AccountDrawer />
      </LoggedInContext.Provider>
    </AppContext.Provider>
  );
  fireEvent.click(screen.getByLabelText('go to orders'));
});

it('Renders Account Drawer closes drawer', async () => {
  render(
    <AppContext.Provider value={AppContextProps}>
      <LoggedInContext.Provider value={loggedInContextProps}>
        <AccountDrawer />
      </LoggedInContext.Provider>
    </AppContext.Provider>
  );
  fireEvent.click(screen.getByLabelText('close drawer'));
});

it('Renders Account Drawer closes drawer from account drawer', async () => {
  render(
    <AppContext.Provider value={AppContextProps}>
      <LoggedInContext.Provider value={loggedInContextProps}>
        <AccountDrawer />
      </LoggedInContext.Provider>
    </AppContext.Provider>
  );
  fireEvent.click(screen.getByLabelText('account drawer'));
  const backdrop = document.querySelector('.MuiBackdrop-root');
  if (backdrop) {
    fireEvent.click(backdrop);
  }
});
