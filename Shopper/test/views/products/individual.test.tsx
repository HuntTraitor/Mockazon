import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import ProductPage from '@/pages/products/[id]';
import { getServerSideProps } from '@/pages/products/[id]';
import http from 'http';
import { AppContext } from '@/contexts/AppContext';

import { HttpResponse, graphql } from 'msw';
import { setupServer } from 'msw/node';

import requestHandler from '../../api/requestHandler';

let server: http.Server<
  typeof http.IncomingMessage,
  typeof http.ServerResponse
>;

let returnError = false;

jest.mock('next/config', () => () => ({
  publicRuntimeConfig: { basePath: '' },
}));

const handlers = [
  graphql.query('getProduct', () => {
    if (returnError) {
      return HttpResponse.json({
        errors: [
          {
            message: 'Some Error',
          },
        ],
      });
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
  }),
}));

const AppContextProps = {
  backDropOpen: false,
  setBackDropOpen: jest.fn(),
  mockazonMenuDrawerOpen: false,
  setMockazonMenuDrawerOpen: jest.fn(),
};

it('Renders successfully', async () => {
  render(
    <AppContext.Provider value={AppContextProps}>
      <ProductPage />
    </AppContext.Provider>
  );
  await waitFor(() => expect(screen.getByText('test name', { exact: false })));
});

// it('Clicks backdrop', async () => {
//   render(
//     <AppContext.Provider value={AppContextProps}>
//       <ProductPage />
//     </AppContext.Provider>
//   );
//   await waitFor(() => expect(screen.getByText('test name', { exact: false })));
//   fireEvent.click(screen.getByLabelText('backdrop'));
// });

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
      <ProductPage />
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
      <ProductPage />
    </AppContext.Provider>
  );
  const backdrop = document.querySelector('.MuiBackdrop-root');
  if (backdrop) {
    fireEvent.click(backdrop);
  }
});
