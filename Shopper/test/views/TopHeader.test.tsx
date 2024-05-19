import TopHeader from '@/views/TopHeader';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { AppContext } from '@/contexts/AppContext';
import debounce from 'lodash/debounce';

const pushMock = jest.fn();
const locale = 'en';

jest.mock('next/config', () => () => ({
  publicRuntimeConfig: { basePath: '' },
}));

const mockUseRouter = jest.fn(() => ({
  basePath: '',
  pathname: '/',
  query: {},
  asPath: '/',
  locale: locale,
  locales: ['en', 'es'],
  defaultLocale: 'en',
  push: pushMock,
  replace: jest.fn(),
  reload: jest.fn(),
  back: jest.fn(),
  prefetch: jest.fn(),
  beforePopState: jest.fn(),
}));

jest.mock('next/router', () => ({
  useRouter: () => mockUseRouter(),
}));

jest.mock('next-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      switch (key) {
      case 'deliveryText':
        return 'Delivery to';
      case 'searchPlaceholder':
        return 'Search Mockazon';
      case 'returns':
        return 'Returns';
      case 'orders':
        return '& Orders';
      case 'cart':
        return 'Cart';
      default:
        return key;
      }
    },
    i18n: {
      changeLanguage: jest.fn(),
    },
  }),
}));

const AppContextProps = {
  backDropOpen: false,
  setBackDropOpen: jest.fn(),
  mockazonMenuDrawerOpen: false,
  setMockazonMenuDrawerOpen: jest.fn(),
};

jest.mock('lodash/debounce', () => jest.fn(fn => fn));

describe('Top Header', () => {
  beforeEach(() => {
    pushMock.mockClear();
  });

  it('Renders successfully', async () => {
    render(
      <AppContext.Provider value={AppContextProps}>
        <TopHeader />
      </AppContext.Provider>
    );
    await screen.findByText('Cart');
  });

  it('Clicking on orders navigates to the orders page', async () => {
    render(
      <AppContext.Provider value={AppContextProps}>
        <TopHeader />
      </AppContext.Provider>
    );
    fireEvent.click(screen.getByLabelText('Orders Button'));
    expect(pushMock).toHaveBeenCalledWith('/orders');
  });

  it('Clicking on the cart navigates to the cart page', async () => {
    render(
      <AppContext.Provider value={AppContextProps}>
        <TopHeader />
      </AppContext.Provider>
    );
    const cart = screen.getByLabelText('Cart Button');
    cart.click();
    expect(pushMock).toHaveBeenCalledWith('/cart');
  });

  it('Typing in search bar fetches suggestions', async () => {
    const fetchMock = jest.spyOn(window, 'fetch').mockImplementation(() =>
      Promise.resolve(new Response(JSON.stringify({
        data: {
          getProducts: [
            { data: { name: 'test product 1' } },
            { data: { name: 'test product 2' } },
          ],
        },
      }), { status: 200 }))
    );

    render(
      <AppContext.Provider value={AppContextProps}>
        <TopHeader />
      </AppContext.Provider>
    );
    const searchInput = screen.getByPlaceholderText('Search Mockazon');
    fireEvent.change(searchInput, { target: { value: 'test' } });
    await waitFor(() => expect(debounce).toHaveBeenCalled());
    await waitFor(() =>
      expect(screen.getByText('test product 1')).toBeInTheDocument()
    );
    await waitFor(() =>
      expect(screen.getByText('test product 2')).toBeInTheDocument()
    );

    fetchMock.mockRestore();
  });

  it('Typing in search bar fetches suggestions with no results', async () => {
    const fetchMock = jest.spyOn(window, 'fetch').mockImplementation(() =>
      Promise.resolve(new Response(JSON.stringify({
        data: {
          getProducts: [],
        },
      }), { status: 200 }))
    );

    render(
      <AppContext.Provider value={AppContextProps}>
        <TopHeader />
      </AppContext.Provider>
    );
    const searchInput = screen.getByPlaceholderText('Search Mockazon');
    fireEvent.change(searchInput, { target: { value: 'test' } });
    await waitFor(() => expect(debounce).toHaveBeenCalled());
    await waitFor(() =>
      expect(screen.queryByText('test product 1')).not.toBeInTheDocument()
    );
    await waitFor(() =>
      expect(screen.queryByText('test product 2')).not.toBeInTheDocument()
    );

    fetchMock.mockRestore();
  });

  it('Typing in search bar fetches suggestions with error', async () => {
    const fetchMock = jest.spyOn(window, 'fetch').mockImplementation(() =>
      Promise.resolve(new Response(JSON.stringify({
        errors: ['Error fetching products'],
      }), { status: 500 }))
    );

    render(
      <AppContext.Provider value={AppContextProps}>
        <TopHeader />
      </AppContext.Provider>
    );
    const searchInput = screen.getByPlaceholderText('Search Mockazon');
    fireEvent.change(searchInput, { target: { value: 'test' } });
    await waitFor(() => expect(debounce).toHaveBeenCalled());
    await waitFor(() =>
      expect(screen.queryByText('test product 1')).not.toBeInTheDocument()
    );
    await waitFor(() =>
      expect(screen.queryByText('test product 2')).not.toBeInTheDocument()
    );

    fetchMock.mockRestore();
  });

  it('Clicking search button navigates to products page with query', async () => {
    render(
      <AppContext.Provider value={AppContextProps}>
        <TopHeader />
      </AppContext.Provider>
    );
    const searchInput = screen.getByPlaceholderText('Search Mockazon');
    fireEvent.change(searchInput, { target: { value: 'test' } });
    const searchButton = screen.getByLabelText('Search Button');
    fireEvent.click(searchButton);
    expect(pushMock).toHaveBeenCalledWith('/products?page=1&pageSize=20&search=test');
  });

  it('Focus and blur events on search bar set backdrop state', async () => {
    render(
      <AppContext.Provider value={AppContextProps}>
        <TopHeader />
      </AppContext.Provider>
    );
    const searchInput = screen.getByPlaceholderText('Search Mockazon');
    fireEvent.focus(searchInput);
    expect(AppContextProps.setBackDropOpen).toHaveBeenCalledWith(true);
    fireEvent.blur(searchInput);
    expect(AppContextProps.setBackDropOpen).toHaveBeenCalledWith(false);
  });

  it('Clicking on the logo navigates to the home page', async () => {
    render(
      <AppContext.Provider value={AppContextProps}>
        <TopHeader />
      </AppContext.Provider>
    );
    const logo = screen.getByAltText('Logo');
    fireEvent.mouseDown(logo);
    waitFor(() => expect(pushMock).toHaveBeenCalled());
  });

  // it('Clicking on the address navigates to the address editor', async () => {
  //   render(
  //     <AppContext.Provider value={AppContextProps}>
  //       <TopHeader />
  //     </AppContext.Provider>
  //   );
  //   const consoleSpy = jest.spyOn(console, 'log');
  //   const address = screen.getByLabelText('Address');
  //   address.click();
  //   expect(consoleSpy).toHaveBeenCalled();
  //   // FIXME: This test will need to be updated when the address editor is implemented
  // });
});
