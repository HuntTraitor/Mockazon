import React from 'react';
import { render } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { enqueueSnackbar, SnackbarProvider } from 'notistack';
import { AppContext } from '@/contexts/AppContext';
import SubHeader from '@/views/SubHeader';

const server = setupServer();

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

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('SubHeader', () => {
  it('Should load subheader', () => {
    render(
      <AppContext.Provider value={AppContextProps}>
        <SnackbarProvider>
          <SubHeader />
        </SnackbarProvider>
      </AppContext.Provider>
    );
  });
});
