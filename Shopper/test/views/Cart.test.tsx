import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { getServerSideProps } from '@/pages/cart';
import http from 'http';
import { LoggedInContext } from '@/contexts/LoggedInUserContext';
import { AppContext } from '@/contexts/AppContext';
import { graphql, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { enqueueSnackbar } from 'notistack';
import requestHandler from '../api/requestHandler';
import ShoppingCart from '@/pages/cart';

jest.mock('next/config', () => () => ({
  publicRuntimeConfig: { basePath: '' },
}));

let server: http.Server<
  typeof http.IncomingMessage,
  typeof http.ServerResponse
>;

jest.mock('notistack', () => ({
  ...jest.requireActual('notistack'),
  enqueueSnackbar: jest.fn(),
}));

(enqueueSnackbar as jest.Mock).mockImplementation(jest.fn());

let errorInFetchProduct = false;
let errorInShoppingCart = false;
let errorInGraphQLShoppingCart = false;

const handlers = [
  graphql.query('GetShoppingCart', () => {
    if (errorInShoppingCart) {
      if (errorInGraphQLShoppingCart) {
        return HttpResponse.json(
          { errors: [{ message: 'error' }] },
          { status: 200 }
        );
      }
      return HttpResponse.json({}, { status: 400 });
    } else {
      return HttpResponse.json(
        {
          data: {
            getShoppingCart: [
              {
                id: '123',
                product_id: '123',
                shopper_id: '123',
                vendor_id: '123',
                data: {
                  quantity: '3',
                },
              },
            ],
          },
        },
        { status: 200 }
      );
    }
  }),
  graphql.query('GetProduct', () => {
    if (errorInFetchProduct) {
      return HttpResponse.json({}, { status: 400 });
    } else {
      return HttpResponse.json(
        {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          id: '123',
          data: {
            getProduct: {
              id: '123',
              data: {
                brand: 'test',
                name: 'test name',
                rating: 'test',
                price: 1,
                deliveryDate: new Date().toUTCString(),
                image:
                  'https://i5.walmartimages.com/seo/BGZLEU-Happy-Sounds-Cat-Plush-Toy-Happy-Meme-Plush-Happy-Stuffed-Animal-Toys-Figure-Pillow-Used-Home-Decoration-Children-s-Birthday-Gifts_62eea2e9-fbf0-432f-9008-77b5fa5f40bc.9e26f429c761d0b80ee9da229db8a046.jpeg?odnHeight=768&odnWidth=768&odnBg=FFFFFF',
              },
            },
          },
        },
        { status: 200 }
      );
    }
  }),
];

const microServices = setupServer(...handlers);

beforeAll(async () => {
  microServices.listen({ onUnhandledRequest: 'bypass' });
  server = http.createServer(requestHandler);
  server.listen();
});

beforeEach(() => {
  microServices.resetHandlers();
  errorInFetchProduct = false;
  errorInShoppingCart = false;
});

afterAll(done => {
  microServices.close();
  server.close(done);
});

jest.mock('next-i18next/serverSideTranslations', () => ({
  serverSideTranslations: jest.fn().mockReturnValue({
    en: {
      common: {
        title: 'Mock Title',
      },
    },
  }),
}));

jest.mock('next/router', () => ({
  useRouter: () => ({
    basePath: '',
    pathname: '/',
    query: {},
    asPath: '/',
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

const newLoggedInContextProps = {
  accessToken: 'mockToken',
  setAccessToken: jest.fn(),
  location: 'login',
  setLocation: jest.fn(),
  locale: 'en',
  setLocale: jest.fn(),
  user: {
    accessToken: 'abc',
    id: 'abc',
    name: 'Trevor',
    role: 'Shopper',
  },
  setUser: jest.fn(),
};

const newLoggedInContextNoAccessTokenProps = {
  accessToken: '',
  setAccessToken: jest.fn(),
  location: 'login',
  setLocation: jest.fn(),
  locale: 'en',
  setLocale: jest.fn(),
  user: {
    accessToken: 'abc',
    id: 'abc',
    name: 'Trevor',
    role: 'Shopper',
  },
  setUser: jest.fn(),
};

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

it('passes', () => {
  expect(1).toBe(1);
});

it('Renders successfully', async () => {
  localStorage.setItem(
    'user',
    JSON.stringify({
      accessToken: 'abc',
      id: 'abc',
      name: 'Trevor',
      role: 'Shopper',
    })
  );

  render(
    <AppContext.Provider value={AppContextProps}>
      <LoggedInContext.Provider value={newLoggedInContextProps}>
        <ShoppingCart locale={'en'} />
      </LoggedInContext.Provider>
    </AppContext.Provider>
  );
});

it('Render fails because localStorageUser not set', async () => {
  const newLoggedInContextProps2 = { ...newLoggedInContextProps };
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  newLoggedInContextProps2.user = {};
  render(
    <AppContext.Provider value={AppContextProps}>
      <LoggedInContext.Provider value={newLoggedInContextProps2}>
        <ShoppingCart locale={'en'} />
      </LoggedInContext.Provider>
    </AppContext.Provider>
  );
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

it('Renders with error in fetch shopping cart items', async () => {
  errorInShoppingCart = true;
  render(
    <AppContext.Provider value={AppContextProps}>
      <LoggedInContext.Provider value={newLoggedInContextProps}>
        <ShoppingCart locale={'en'} />
      </LoggedInContext.Provider>
    </AppContext.Provider>
  );
});

it('Renders with error in graphQL fetch shopping cart items', async () => {
  errorInShoppingCart = true;
  errorInGraphQLShoppingCart = true;
  render(
    <AppContext.Provider value={AppContextProps}>
      <LoggedInContext.Provider value={newLoggedInContextProps}>
        <ShoppingCart locale={'en'} />
      </LoggedInContext.Provider>
    </AppContext.Provider>
  );
});

it('Renders with error in fetch product', async () => {
  errorInFetchProduct = true;
  render(
    <AppContext.Provider value={AppContextProps}>
      <LoggedInContext.Provider value={newLoggedInContextProps}>
        <ShoppingCart locale={'en'} />
      </LoggedInContext.Provider>
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
      <LoggedInContext.Provider value={newLoggedInContextProps}>
        <ShoppingCart locale={'en'} />
      </LoggedInContext.Provider>
    </AppContext.Provider>
  );
  const backdrop = document.querySelector('.MuiBackdrop-root');
  if (backdrop) {
    fireEvent.click(backdrop);
  }
});

it('Render failure due to no user access token', async () => {
  localStorage.removeItem('user');

  render(
    <AppContext.Provider value={AppContextProps}>
      <LoggedInContext.Provider value={newLoggedInContextProps}>
        <ShoppingCart locale={'en'} />
      </LoggedInContext.Provider>
    </AppContext.Provider>
  );
});

it('Render failure due to no access token', async () => {
  localStorage.setItem(
    'user',
    JSON.stringify({
      accessToken: 'abc',
      id: 'abc',
      name: 'Trevor',
      role: 'Shopper',
    })
  );

  render(
    <AppContext.Provider value={AppContextProps}>
      <LoggedInContext.Provider value={newLoggedInContextNoAccessTokenProps}>
        <ShoppingCart locale={'en'} />
      </LoggedInContext.Provider>
    </AppContext.Provider>
  );
});

// it('Renders successfully and clicks remove item', async () => {
//   render(
//     <AppContext.Provider value={AppContextProps}>
//       <LoggedInContext.Provider value={newLoggedInContextProps}>
//         <ShoppingCart locale={'en'} />
//       </LoggedInContext.Provider>
//     </AppContext.Provider>
//   );
//   fireEvent.click(screen.getByLabelText('cart:Delete' + ' test name'));
// });
