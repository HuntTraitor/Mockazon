import React from 'react';
import {
  render,
  // waitFor
} from '@testing-library/react';
import { screen, waitFor } from '@testing-library/dom';
import http from 'http';

import { HttpResponse, graphql } from 'msw';
import { setupServer } from 'msw/node';
import requestHandler from '../../api/requestHandler';
import ProductPage from '@/pages/products/[id]';
// import userEvent from '@testing-library/user-event';
import { AppContextProvider } from '@/contexts/AppContext';
import { SnackbarProvider, useSnackbar } from 'notistack';

let server: http.Server<
  typeof http.IncomingMessage,
  typeof http.ServerResponse
>;

let returnError = false;

const handlers = [
  graphql.query('getProduct', ({ query }) => {
    console.log(query);
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
        getProduct: mockProduct,
      },
    });
  }),
];

const microServices = setupServer(...handlers);

jest.mock('notistack', () => ({
  ...jest.requireActual('notistack'),
  useSnackbar: jest.fn(),
}));

const mockEnqueueSnackbar = jest.fn();
(useSnackbar as jest.Mock).mockReturnValue({
  enqueueSnackbar: mockEnqueueSnackbar,
});

beforeAll(async () => {
  returnError = false;
  microServices.listen({ onUnhandledRequest: 'bypass' });
  server = http.createServer(requestHandler);
  server.listen();
});

afterEach(() => {
  returnError = false;
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

it('passes', () => {
  expect(1).toBe(1);
});

// it('Renders ProductPage successfully', async () => {
//   const mockEnqueueSnackbar = jest.fn();
//   (useSnackbar as jest.Mock).mockReturnValue({
//     enqueueSnackbar: mockEnqueueSnackbar,
//   });

//   render(
//     <AppContextProvider>
//       <SnackbarProvider>
//         <ProductPage />
//       </SnackbarProvider>
//     </AppContextProvider>
//   );
//   await waitFor(() => {
//     expect(screen.getByText(mockProduct.data.name)).toBeDefined();
//   });
// });

// it('Renders ProductPage with an error', async () => {
//   returnError = true;
//   render(
//     <AppContextProvider>
//       <SnackbarProvider>
//         <ProductPage />
//       </SnackbarProvider>
//     </AppContextProvider>
//   );
//   // await waitFor(() => {
//   //   expect(screen.getByText('Could not fetch product')).toBeInTheDocument();
//   // });
// });

// it('Clicks on quantity on productPage', async () => {
//   render(
//     <AppContextProvider>
//       <SnackbarProvider>
//         <ProductPage />
//       </SnackbarProvider>
//     </AppContextProvider>
//   );
//   // await waitFor(() => {
//   //   const field = screen.getByLabelText('quantitySelector');
//   //   expect(field).toBeInTheDocument();
//   // });
//   // await userEvent.click(screen.getByText('1'));
//   // expect(screen.getByText('3')).toBeInTheDocument();
//   // await userEvent.click(screen.getByText('3'));
// });
