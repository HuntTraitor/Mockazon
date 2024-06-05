import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react';
import { screen, within } from '@testing-library/dom';
import ProductPage from '@/pages/products/[id]';
import { getServerSideProps } from '@/pages/products/[id]';
import http from 'http';
import { AppContext } from '@/contexts/AppContext';

import { HttpResponse, graphql } from 'msw';
import { setupServer } from 'msw/node';
import { enqueueSnackbar, SnackbarProvider } from 'notistack';
import { AppContextProvider } from '@/contexts/AppContext';

import requestHandler from '../../api/requestHandler';

let server: http.Server<
  typeof http.IncomingMessage,
  typeof http.ServerResponse
>;

let returnError = false;
let graphQLReturnError = false;

jest.mock('next/config', () => () => ({
  publicRuntimeConfig: { basePath: '' },
}));

const handlers = [
  graphql.query('getProduct', () => {
    if (returnError) {
      if (graphQLReturnError) {
        return HttpResponse.json(
          {
            errors: [
              {
                message: 'Some Error',
              },
            ],
          },
          { status: 400 }
        );
      }
      return HttpResponse.json({});
    }
    return HttpResponse.json({
      data: {
        getProduct: {
          id: '123',
          data: {
            brand: 'Test Brand',
            name: 'test name',
            rating: 'Test rating',
            price: 12.99,
            deliveryDate: '2020-01-01',
            image: 'http://test-image.jpg',
          },
        },
      },
    });
  }),
];

const microServices = setupServer(...handlers);

beforeAll(async () => {
  returnError = false;
  microServices.listen({ onUnhandledRequest: 'bypass' });
  server = http.createServer(requestHandler);
  server.listen();
});

afterEach(() => {
  microServices.resetHandlers();
  returnError = false;
  graphQLReturnError = false
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

jest.mock('next/router', () => ({
  useRouter: () => ({
    basePath: '',
    pathname: '/',
    query: { id: '1' },
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

jest.mock('notistack', () => ({
  ...jest.requireActual('notistack'),
  enqueueSnackbar: jest.fn(),
}));

(enqueueSnackbar as jest.Mock).mockImplementation(jest.fn());

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

describe('Desktop Product Page', () => {
  it('Renders successfully', async () => {
    render(
      <AppContext.Provider value={AppContextProps}>
        <SnackbarProvider>
          <ProductPage />
        </SnackbarProvider>
      </AppContext.Provider>
    );
    await waitFor(() => expect(screen.getByText('test name', { exact: false })));
  });

  it('renders with layout', () => {
    const TestComponent = () => <div>Test</div>;
    const page = <TestComponent />;
    const layout = ProductPage.getLayout(page);

    const { getByText } = render(
      <AppContextProvider>
        {layout}
      </AppContextProvider>
    );

    expect(getByText('Test')).toBeInTheDocument();
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

  it('Renders with error', async () => {
    returnError = true;
    render(
      <AppContext.Provider value={AppContextProps}>
        <SnackbarProvider>
          <ProductPage />
        </SnackbarProvider>
      </AppContext.Provider>
    );
  });

  it('Renders with error in graphQL', async () => {
    returnError = true;
    graphQLReturnError = true;
    render(
      <AppContext.Provider value={AppContextProps}>
        <SnackbarProvider>
          <ProductPage />
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
          <ProductPage />
        </SnackbarProvider>
      </AppContext.Provider>
    );
    const backdrop = document.querySelector('.MuiBackdrop-root');
    if (backdrop) {
      fireEvent.click(backdrop);
    }
  });

  it('Renders successfully with quantity change', async () => {
    render(
      <AppContext.Provider value={AppContextProps}>
        <SnackbarProvider>
          <ProductPage />
        </SnackbarProvider>
      </AppContext.Provider>
    );
    await waitFor(() => expect(screen.getByText('test name', { exact: false })));
    const quantitySelector = screen.getByRole('combobox');

    /* https://stackoverflow.com/questions/55184037/react-testing-library-on-change-for-material-ui-select-component */
    // Open the select dropdown
    fireEvent.mouseDown(quantitySelector);

    // Wait for the option to be in the document
    expect(screen.getByRole("listbox")).not.toEqual(null);
    const listbox = within(screen.getByRole('presentation')).getByRole(
      'listbox'
    );
    const options = within(listbox).getAllByRole('option');
    const optionValues = options.map((li) => li.getAttribute('data-value'));
    expect(optionValues).toEqual(['1', '2', '3', '4', '5']);
    fireEvent.click(options[1]);

    // expect quantity to be 2 on screen
    expect(screen.getByDisplayValue('2')).toBeTruthy();
  });

  it('Displays product not found error', async () => {
    returnError = true;
    graphQLReturnError = true;
    render(
      <AppContext.Provider value={AppContextProps}>
        <SnackbarProvider>
          <ProductPage />
        </SnackbarProvider>
      </AppContext.Provider>
    );
    await waitFor(() => expect(screen.getByText('productNotFound')));
  });
});

describe('Mobile Product Page', () => {
  it('Renders successfully', async () => {
    render(
      <AppContext.Provider
        value={{
          ...AppContextProps,
          isMobile: true,
        }}
      >
        <SnackbarProvider>
          <ProductPage />
        </SnackbarProvider>
      </AppContext.Provider>
    );
    await waitFor(() => expect(screen.getByText('test name', { exact: false })));
  });

  it('Renders with error', async () => {
    returnError = true;
    render(
      <AppContext.Provider
        value={{
          ...AppContextProps,
          isMobile: true,
        }}
      >
        <SnackbarProvider>
          <ProductPage />
        </SnackbarProvider>
      </AppContext.Provider>
    );
  });

  it('Renders with error in graphQL', async () => {
    returnError = true;
    graphQLReturnError = true;
    render(
      <AppContext.Provider
        value={{
          ...AppContextProps,
          isMobile: true,
        }}
      >
        <SnackbarProvider>
          <ProductPage />
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
          isMobile: true,
        }}
      >
        <SnackbarProvider>
          <ProductPage />
        </SnackbarProvider>
      </AppContext.Provider>
    );
    const backdrop = document.querySelector('.MuiBackdrop-root');
    if (backdrop) {
      fireEvent.click(backdrop);
    }
  });

  it('Renders successfully with quantity change', async () => {
    render(
      <AppContext.Provider
        value={{
          ...AppContextProps,
          isMobile: true,
        }}
      >
        <SnackbarProvider>
          <ProductPage />
        </SnackbarProvider>
      </AppContext.Provider>
    );
    await waitFor(() => expect(screen.getByText('test name', { exact: false })));
    const quantitySelector = screen.getByRole('combobox');

    /* https://stackoverflow.com/questions/55184037/react-testing-library-on-change-for-material-ui-select-component */
    // Open the select dropdown
    fireEvent.mouseDown(quantitySelector);

    // Wait for the option to be in the document
    expect(screen.getByRole("listbox")).not.toEqual(null);
    const listbox = within(screen.getByRole('presentation')).getByRole(
      'listbox'
    );
    const options = within(listbox).getAllByRole('option');
    const optionValues = options.map((li) => li.getAttribute('data-value'));
    expect(optionValues).toEqual(['1', '2', '3', '4', '5']);
    fireEvent.click(options[1]);

    // expect quantity to be 2 on screen
    expect(screen.getByDisplayValue('2')).toBeTruthy();
  });
});
