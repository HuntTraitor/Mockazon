// test products component

import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import ProductPage from '@/pages/products/[id]';
import { getServerSideProps } from '@/pages/products/[id]';
import http from 'http';
import * as nextRouter from 'next/router';

import { http as rest, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

import requestHandler from '../../api/requestHandler';

let server: http.Server<
  typeof http.IncomingMessage,
  typeof http.ServerResponse
>;

let error = false;

const handlers = [
  rest.get(
    `http://${process.env.MICROSERVICE_URL || 'localhost'}:3011/api/v0/product/1`,
    async () => {
      if (error) {
        return HttpResponse.json(
          {
            id: 'some id',
            data: {
              brand: 'test',
              name: 'test',
              rating: 'test',
              price: 1,
              deliveryDate: 'test',
              image: 'test',
            },
          },
          { status: 400 }
        );
      } else {
        return HttpResponse.json(
          {
            id: 'some id',
            data: {
              brand: 'test',
              name: 'test name',
              rating: 'test',
              price: 1,
              deliveryDate: 'test',
              image: 'test',
            },
          },
          { status: 200 }
        );
      }
    }
  ),
];

const microServices = setupServer(...handlers);

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

it('Renders successfully', async () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const useRouter = jest.spyOn(nextRouter, 'useRouter');
  jest.mock('next/router');
  (useRouter as jest.Mock).mockReturnValue({
    query: { id: '1' },
  });
  render(<ProductPage />);
  await waitFor(() => expect(screen.getByText('test name', { exact: false })));
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
  error = true;
  render(<ProductPage />);
});
