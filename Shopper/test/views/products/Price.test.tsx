import React from 'react';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import http from 'http';

import { setupServer } from 'msw/node';
import requestHandler from '../../api/requestHandler';
import { AppContext } from '@/contexts/AppContext';
import { enqueueSnackbar, SnackbarProvider } from 'notistack';
import Price from '@/views/product/Price';

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

it('Loads price', async () => {
  render(
    <AppContext.Provider value={AppContextProps}>
      <SnackbarProvider>
        <Price price={'1300'} />
      </SnackbarProvider>
    </AppContext.Provider>
  );
  expect(screen.getByText('1300')).toBeInTheDocument();
});

it('Loads price with a dot', async () => {
  render(
    <AppContext.Provider value={AppContextProps}>
      <SnackbarProvider>
        <Price price={'13.00'} />
      </SnackbarProvider>
    </AppContext.Provider>
  );
  expect(screen.getByText('13')).toBeInTheDocument();
  expect(screen.getByText('00')).toBeInTheDocument();
});
