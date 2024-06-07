import React from 'react';
import { screen, fireEvent, render, waitFor } from '@testing-library/react';
import { http as rest, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import requestHandler from '../../api/requestHandler';
import Success from '@/pages/orders/success';
import { getServerSideProps } from '@/pages/orders/success';
import { AppContext } from '@/contexts/AppContext';
import { randomUUID } from 'crypto';
import { useTranslation } from 'next-i18next';
import useSWR from 'swr';
import { fetcher } from '@/pages/orders/success';
import { AppContextProvider } from '@/contexts/AppContext';
import http from 'http';

jest.mock('swr', () => jest.fn());

jest.mock('next-i18next', () => ({
  useTranslation: jest.fn(),
}));

jest.mock('next/config', () => () => ({
  publicRuntimeConfig: { basePath: '' },
}));

let server: http.Server<
  typeof http.IncomingMessage,
  typeof http.ServerResponse
>;

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

jest.mock('next/router', () => ({
  useRouter: () => ({
    basePath: '',
    pathname: '/',
    query: { sessionId: randomUUID() },
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

(useSWR as jest.Mock).mockReturnValue({
  data: {
    customer_details: {
      name: 'Test User',
      email: 'test@example.com',
      address: {
        country: 'Test Country',
        postal_code: 'Test Postal Code',
      },
    },
    line_items: {
      data: [
        {
          price: {
            product: {
              id: 'test-product-id',
              images: ['http://test-image.jpg'],
              description: 'Test Product Description',
              url: 'http://test-product-url',
              name: 'This is a waaaaaaaaaaaaaaaaaay longer Test Product Name',
              price: 100,
            },
            unit_amount: 100,
          },
          quantity: 1,
        },
      ],
    },
    payment_intent: {
      id: 'test-payment-intent-id',
      charges: {
        data: [
          {
            payment_method_details: {
              card: {
                wallet: 'Test Wallet',
                brand: 'Test Brand',
                last4: '1234',
                exp_month: 12,
                exp_year: 2023,
              },
            },
          },
        ],
      },
    },
    amount_subtotal: 100,
    amount_total: 100,
    total_details: {
      amount_discount: 0,
      amount_tax: 0,
    },
  },
  error: null,
});

(useTranslation as jest.Mock).mockReturnValue({
  t: (key: string) => key,
});
let fetchSucceeds = true;
const microServices = setupServer(
  ...[
    rest.get('/api/stripe/sessions/123', () => {
      if (fetchSucceeds) {
        return HttpResponse.json({}, { status: 200 });
      }
      return HttpResponse.error();
    }),
  ]
);

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

it('Renders one item successfully', async () => {
  render(
    <AppContext.Provider
      value={{
        ...AppContextProps,
        backDropOpen: true,
      }}
    >
      <Success />
    </AppContext.Provider>
  );
});

it('Renders one item unsuccessfully', async () => {
  fetchSucceeds = false;
  render(
    <AppContext.Provider
      value={{
        ...AppContextProps,
        backDropOpen: true,
      }}
    >
      <Success />
    </AppContext.Provider>
  );
});

it('Runs fetcher', async () => {
  fetchSucceeds = true;
  await fetcher('/api/stripe/sessions/123');
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

it('Click Backdrop', () => {
  render(
    <AppContext.Provider
      value={{
        ...AppContextProps,
        backDropOpen: true,
      }}
    >
      <Success />
    </AppContext.Provider>
  );
  const backdrop = document.querySelector('.MuiBackdrop-root');
  if (backdrop) {
    fireEvent.click(backdrop);
  }
});

it('Slices the product name on mobile', async () => {
  fetchSucceeds = true;
  render(
    <AppContext.Provider
      value={{
        ...AppContextProps,
        isMobile: true,
      }}
    >
      <Success />
    </AppContext.Provider>
  );

  await waitFor(() => {
    expect(screen.getByText('This is a waaaaaaa...')).toBeInTheDocument();
  });
});

it('renders with layout', () => {
  const TestComponent = () => <div>Test</div>;
  const page = <TestComponent />;
  const layout = Success.getLayout(page);

  const { getByText } = render(
    <AppContextProvider>{layout}</AppContextProvider>
  );

  expect(getByText('Test')).toBeInTheDocument();
});
