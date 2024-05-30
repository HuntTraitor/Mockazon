import React from 'react';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import http from 'http';

import { setupServer } from 'msw/node';
import requestHandler from '../../api/requestHandler';
import { AppContext } from '@/contexts/AppContext';
import { enqueueSnackbar, SnackbarProvider } from 'notistack';
import PaymentMethod from '@/views/order/PaymentMethod';

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

it('Loads payment method', async () => {
  render(
    <AppContext.Provider value={AppContextProps}>
      <SnackbarProvider>
        <PaymentMethod digits={4242} method={'card'} paymentBrand={'Visa'} />
      </SnackbarProvider>
    </AppContext.Provider>
  );
  screen.getByText('card order:endingIn 4242');
  screen.getByAltText('Visa');
});

it('Loads payment method with Link', async () => {
  render(
    <AppContext.Provider value={AppContextProps}>
      <SnackbarProvider>
        <PaymentMethod digits={4242} method={'link'} paymentBrand={'Visa'} />
      </SnackbarProvider>
    </AppContext.Provider>
  );
  screen.getByText('Link Payment');
});
