import React from 'react';
import { fireEvent, render } from '@testing-library/react';
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
import http from 'http';

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
    query: { sessionId: null },
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
  data: null,
  error: null,
});

(useTranslation as jest.Mock).mockReturnValue({
  t: (key: string) => key,
});

const microServices = setupServer(
  ...[
    rest.get('/api/stripe/sessions/123', () => {
      return HttpResponse.json({}, { status: 200 });
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

it('Runs fetcher', async () => {
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

jest.mock('swr', () => jest.fn());

jest.mock('next-i18next', () => ({
  useTranslation: jest.fn(),
}));

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
