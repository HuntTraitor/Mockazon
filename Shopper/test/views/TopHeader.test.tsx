import TopHeader from '@/views/TopHeader';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { AppContext } from '@/contexts/AppContext';
import debounce from 'lodash/debounce';
import userEvent from '@testing-library/user-event';
import { LoggedInContext } from '@/contexts/LoggedInUserContext';

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
  events: {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
  },
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
  isMobile: false,
  setIsMobile: jest.fn(),
  accountDrawerOpen: false,
  setAccountDrawerOpen: jest.fn(),
};

jest.mock('lodash/debounce', () => jest.fn(fn => fn));

describe('Top Header Desktop', () => {
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

  it('Clicking on orders navigates to login page, not signed in', async () => {
    render(
      <AppContext.Provider value={AppContextProps}>
        <TopHeader />
      </AppContext.Provider>
    );
    fireEvent.click(screen.getByLabelText('Orders Button'));
    expect(pushMock).toHaveBeenCalledWith('/login');
  });

  it('Clicking on orders navigates to orders page, signed in', async () => {
    render(
      <LoggedInContext.Provider
        value={{
          accessToken: 'test',
          setAccessToken: jest.fn(),
          location: '',
          setLocation: jest.fn(),
          locale: '',
          setLocale: jest.fn(),
          user: { accessToken: 'test', id: '1', name: 'test', role: 'shopper' },
          setUser: jest.fn(),
        }}
      >
        <AppContext.Provider value={AppContextProps}>
          <TopHeader />
        </AppContext.Provider>
      </LoggedInContext.Provider>
    );
    fireEvent.click(screen.getByLabelText('Orders Button'));
    expect(pushMock).toHaveBeenCalledWith('/orders');
  });

  it('Clicking on the cart navigates to the login page when not signed in', async () => {
    render(
      <AppContext.Provider value={AppContextProps}>
        <TopHeader />
      </AppContext.Provider>
    );
    const cart = screen.getByLabelText('Cart Button');
    cart.click();
    expect(pushMock).toHaveBeenCalledWith('/login');
  });

  it('Clicking on cart while signed in navigates to the cart page', async () => {
    render(
      <LoggedInContext.Provider
        value={{
          accessToken: 'test',
          setAccessToken: jest.fn(),
          location: '',
          setLocation: jest.fn(),
          locale: '',
          setLocale: jest.fn(),
          user: { accessToken: 'test', id: '1', name: 'test', role: 'shopper' },
          setUser: jest.fn(),
        }}
      >
        <AppContext.Provider value={AppContextProps}>
          <TopHeader />
        </AppContext.Provider>
      </LoggedInContext.Provider>
    );
    fireEvent.click(screen.getByLabelText('Cart Button'));
    expect(pushMock).toHaveBeenCalledWith('/cart');
  });

  it('Typing in search bar fetches suggestions', async () => {
    const fetchMock = jest.spyOn(window, 'fetch').mockImplementation(() =>
      Promise.resolve(
        new Response(
          JSON.stringify({
            data: {
              getProducts: [
                { data: { name: 'test product 1' } },
                { data: { name: 'test product 2' } },
              ],
            },
          }),
          { status: 200 }
        )
      )
    );

    render(
      <AppContext.Provider value={AppContextProps}>
        <TopHeader />
      </AppContext.Provider>
    );
    const searchInput = screen.getByPlaceholderText('Search Mockazon');
    fireEvent.change(searchInput, { target: { value: 'test' } });
    await waitFor(() => expect(debounce).toHaveBeenCalled());
    // await waitFor(() =>
    //   expect(screen.getByText('test product 1')).toBeInTheDocument()
    // );
    // await waitFor(() =>
    //   expect(screen.getByText('test product 2')).toBeInTheDocument()
    // );

    fetchMock.mockRestore();
  });

  it('Typing in search bar highlights suggestions', async () => {
    const fetchMock = jest.spyOn(window, 'fetch').mockImplementation(() => {
      return Promise.resolve(
        new Response(
          JSON.stringify({
            data: {
              getSearchSuggestions: ['test product 1', 'second test product 2'],
            },
          }),
          { status: 200 }
        )
      );
    });

    render(
      <AppContext.Provider value={AppContextProps}>
        <TopHeader />
      </AppContext.Provider>
    );

    const searchInput = screen
      .getByLabelText('Search Mockazon')
      .querySelector('input');
    if (searchInput) {
      await userEvent.type(searchInput, 'test');
    }

    await waitFor(() => {
      expect(screen.getByLabelText('test product 1')).toBeInTheDocument();
      expect(
        screen.getByLabelText('second test product 2')
      ).toBeInTheDocument();
    });

    fetchMock.mockRestore();
  });

  it('Typing in search bar with no suggestions', async () => {
    const fetchMock = jest.spyOn(window, 'fetch').mockImplementation(() => {
      return Promise.resolve(
        new Response(
          JSON.stringify({
            data: {
              getSearchSuggestions: [],
            },
          }),
          { status: 200 }
        )
      );
    });

    render(
      <AppContext.Provider value={AppContextProps}>
        <TopHeader />
      </AppContext.Provider>
    );

    const searchInput = screen
      .getByLabelText('Search Mockazon')
      .querySelector('input');
    if (searchInput) {
      await userEvent.type(searchInput, 'potato');
    }

    await waitFor(() => {
      expect(screen.queryByLabelText('test product 1')).not.toBeInTheDocument();
      expect(
        screen.queryByLabelText('second test product 2')
      ).not.toBeInTheDocument();
    });

    fetchMock.mockRestore();
  });

  it('Clicking on a suggestion searches for the product', async () => {
    const fetchMock = jest.spyOn(window, 'fetch').mockImplementation(() => {
      return Promise.resolve(
        new Response(
          JSON.stringify({
            data: {
              getSearchSuggestions: ['test product 1', 'second test product 2'],
            },
          }),
          { status: 200 }
        )
      );
    });

    render(
      <AppContext.Provider value={AppContextProps}>
        <TopHeader />
      </AppContext.Provider>
    );

    const searchInput = screen
      .getByLabelText('Search Mockazon')
      .querySelector('input');
    if (searchInput) {
      await userEvent.type(searchInput, 'test');
    }

    await waitFor(() => {
      expect(screen.getByLabelText('test product 1')).toBeInTheDocument();
      expect(
        screen.getByLabelText('second test product 2')
      ).toBeInTheDocument();
    });
    const suggestion = screen.getByLabelText('test product 1');
    fireEvent.mouseDown(suggestion);
    await waitFor(() => expect(pushMock).toHaveBeenCalled());

    fetchMock.mockRestore();
  });

  it('Using arrow keys to navigate suggestions', async () => {
    const fetchMock = jest.spyOn(window, 'fetch').mockImplementation(() => {
      return Promise.resolve(
        new Response(
          JSON.stringify({
            data: {
              getSearchSuggestions: ['test product 1', 'second test product 2'],
            },
          }),
          { status: 200 }
        )
      );
    });

    render(
      <AppContext.Provider value={AppContextProps}>
        <TopHeader />
      </AppContext.Provider>
    );

    const searchInput = screen
      .getByLabelText('Search Mockazon')
      .querySelector('input');
    if (searchInput) {
      await userEvent.type(searchInput, 'test');
    }

    await waitFor(() => {
      expect(screen.getByLabelText('test product 1')).toBeInTheDocument();
      expect(
        screen.getByLabelText('second test product 2')
      ).toBeInTheDocument();
    });

    userEvent.keyboard('{arrowdown}');
    await waitFor(() => {
      expect(screen.getByDisplayValue('test product 1')).toBeInTheDocument();
    });

    fetchMock.mockRestore();
  });

  it('Removing focus from search bar hides suggestions', async () => {
    const fetchMock = jest.spyOn(window, 'fetch').mockImplementation(() => {
      return Promise.resolve(
        new Response(
          JSON.stringify({
            data: {
              getSearchSuggestions: ['test product 1', 'second test product 2'],
            },
          }),
          { status: 200 }
        )
      );
    });

    render(
      <AppContext.Provider value={AppContextProps}>
        <TopHeader />
      </AppContext.Provider>
    );

    const searchInput = screen
      .getByLabelText('Search Mockazon')
      .querySelector('input');
    if (searchInput) {
      await userEvent.type(searchInput, 'test');
    }
    await waitFor(() => {
      expect(screen.getByLabelText('test product 1')).toBeInTheDocument();
      expect(
        screen.getByLabelText('second test product 2')
      ).toBeInTheDocument();
    });

    if (searchInput) {
      fireEvent.blur(searchInput);
    }
    await waitFor(() => {
      expect(screen.queryByLabelText('test product 1')).not.toBeInTheDocument();
      expect(
        screen.queryByLabelText('second test product 2')
      ).not.toBeInTheDocument();
    });

    fetchMock.mockRestore();
  });

  it('Arrow keys and enter key select a suggestion', async () => {
    const fetchMock = jest.spyOn(window, 'fetch').mockImplementation(() => {
      return Promise.resolve(
        new Response(
          JSON.stringify({
            data: {
              getSearchSuggestions: ['test product 1', 'second test product 2'],
            },
          }),
          { status: 200 }
        )
      );
    });

    render(
      <AppContext.Provider value={AppContextProps}>
        <TopHeader />
      </AppContext.Provider>
    );

    const searchInput = screen
      .getByLabelText('Search Mockazon')
      .querySelector('input');
    if (searchInput) {
      await userEvent.type(searchInput, 'test');
    }
    await waitFor(() => {
      expect(screen.getByLabelText('test product 1')).toBeInTheDocument();
      expect(
        screen.getByLabelText('second test product 2')
      ).toBeInTheDocument();
    });

    userEvent.keyboard('{arrowdown}');
    userEvent.keyboard('{arrowdown}');
    userEvent.keyboard('{arrowup}');
    userEvent.keyboard('{enter}');
    await waitFor(() => expect(pushMock).toHaveBeenCalled());

    fetchMock.mockRestore();
  });

  it('Clicking the clear button clears the search bar', async () => {
    render(
      <AppContext.Provider value={AppContextProps}>
        <TopHeader />
      </AppContext.Provider>
    );
    const searchInput = screen
      .getByLabelText('Search Mockazon')
      .querySelector('input');
    if (searchInput) {
      await userEvent.type(searchInput, 'test');
    }
    const clearButton = screen.getByLabelText('Clear Search Input');
    fireEvent.click(clearButton);
    await waitFor(() =>
      expect(screen.getByPlaceholderText('Search Mockazon')).toHaveValue('')
    );
  });

  it('Enter key searches for the product', async () => {
    const fetchMock = jest.spyOn(window, 'fetch').mockImplementation(() => {
      return Promise.resolve(
        new Response(
          JSON.stringify({
            data: {
              getSearchSuggestions: ['test product 1', 'second test product 2'],
            },
          }),
          { status: 200 }
        )
      );
    });

    render(
      <AppContext.Provider value={AppContextProps}>
        <TopHeader />
      </AppContext.Provider>
    );

    const searchInput = screen
      .getByLabelText('Search Mockazon')
      .querySelector('input');
    if (searchInput) {
      await userEvent.type(searchInput, 'test');
    }
    await waitFor(() => {
      expect(screen.getByLabelText('test product 1')).toBeInTheDocument();
      expect(
        screen.getByLabelText('second test product 2')
      ).toBeInTheDocument();
    });

    userEvent.keyboard('{enter}');
    await waitFor(() => expect(pushMock).toHaveBeenCalled());

    fetchMock.mockRestore();
  });

  it('Pressing tab key hides suggestions', async () => {
    const fetchMock = jest.spyOn(window, 'fetch').mockImplementation(() => {
      return Promise.resolve(
        new Response(
          JSON.stringify({
            data: {
              getSearchSuggestions: ['test product 1', 'second test product 2'],
            },
          }),
          { status: 200 }
        )
      );
    });

    render(
      <AppContext.Provider value={AppContextProps}>
        <TopHeader />
      </AppContext.Provider>
    );

    const searchInput = screen
      .getByLabelText('Search Mockazon')
      .querySelector('input');
    if (searchInput) {
      await userEvent.type(searchInput, 'test');
    }
    await waitFor(() => {
      expect(screen.getByLabelText('test product 1')).toBeInTheDocument();
      expect(
        screen.getByLabelText('second test product 2')
      ).toBeInTheDocument();
    });

    userEvent.keyboard('{arrowdown}');
    userEvent.keyboard('{tab}');
    await waitFor(() => {
      expect(screen.queryByLabelText('test product 1')).not.toBeInTheDocument();
      expect(
        screen.queryByLabelText('second test product 2')
      ).not.toBeInTheDocument();
    });

    fetchMock.mockRestore();
  });

  it('Typing in search bar fetches suggestions with no results', async () => {
    const fetchMock = jest.spyOn(window, 'fetch').mockImplementation(() =>
      Promise.resolve(
        new Response(
          JSON.stringify({
            data: {
              getProducts: [],
            },
          }),
          { status: 200 }
        )
      )
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
      Promise.resolve(
        new Response(
          JSON.stringify({
            errors: ['Error fetching products'],
          }),
          { status: 500 }
        )
      )
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
    expect(pushMock).toHaveBeenCalledWith(
      '/products?page=1&pageSize=20&search=test'
    );
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

describe('Top Header Mobile', () => {
  beforeEach(() => {
    pushMock.mockClear();
  });

  it('Renders successfully', async () => {
    render(
      <AppContext.Provider value={{ ...AppContextProps, isMobile: true }}>
        <TopHeader />
      </AppContext.Provider>
    );
    await screen.getByLabelText('Cart Button');
  });

  it('Clicking on the cart navigates to the login page when not signed in', async () => {
    render(
      <AppContext.Provider value={{ ...AppContextProps, isMobile: true }}>
        <TopHeader />
      </AppContext.Provider>
    );
    const cart = screen.getByLabelText('Cart Button');
    cart.click();
    expect(pushMock).toHaveBeenCalledWith('/login');
  });

  it('Clicking on cart while signed in navigates to the cart page', async () => {
    render(
      <LoggedInContext.Provider
        value={{
          accessToken: 'test',
          setAccessToken: jest.fn(),
          location: '',
          setLocation: jest.fn(),
          locale: '',
          setLocale: jest.fn(),
          user: { accessToken: 'test', id: '1', name: 'test', role: 'shopper' },
          setUser: jest.fn(),
        }}
      >
        <AppContext.Provider value={{ ...AppContextProps, isMobile: true }}>
          <TopHeader />
        </AppContext.Provider>
      </LoggedInContext.Provider>
    );
    const cart = screen.getByLabelText('Cart Button');
    cart.click();
    expect(pushMock).toHaveBeenCalledWith('/cart');
  });

  it('Typing in search bar fetches suggestions', async () => {
    const fetchMock = jest.spyOn(window, 'fetch').mockImplementation(() =>
      Promise.resolve(
        new Response(
          JSON.stringify({
            data: {
              getProducts: [
                { data: { name: 'test product 1' } },
                { data: { name: 'test product 2' } },
              ],
            },
          }),
          { status: 200 }
        )
      )
    );

    render(
      <AppContext.Provider value={{ ...AppContextProps, isMobile: true }}>
        <TopHeader />
      </AppContext.Provider>
    );
    const searchInput = screen.getByPlaceholderText('Search Mockazon');
    fireEvent.change(searchInput, { target: { value: 'test' } });
    await waitFor(() => expect(debounce).toHaveBeenCalled());
    // await waitFor(() =>
    //   expect(screen.getByText('test product 1')).toBeInTheDocument()
    // );
    // await waitFor(() =>
    //   expect(screen.getByText('test product 2')).toBeInTheDocument()
    // );

    fetchMock.mockRestore();
  });

  it('Typing in search bar highlights suggestions', async () => {
    const fetchMock = jest.spyOn(window, 'fetch').mockImplementation(() => {
      return Promise.resolve(
        new Response(
          JSON.stringify({
            data: {
              getSearchSuggestions: ['test product 1', 'second test product 2'],
            },
          }),
          { status: 200 }
        )
      );
    });

    render(
      <AppContext.Provider value={{ ...AppContextProps, isMobile: true }}>
        <TopHeader />
      </AppContext.Provider>
    );

    const searchInput = screen
      .getByLabelText('Search Mockazon')
      .querySelector('input');
    if (searchInput) {
      await userEvent.type(searchInput, 'test');
    }

    await waitFor(() => {
      expect(screen.getByLabelText('test product 1')).toBeInTheDocument();
      expect(
        screen.getByLabelText('second test product 2')
      ).toBeInTheDocument();
    });

    fetchMock.mockRestore();
  });

  it('Typing in search bar with no suggestions', async () => {
    const fetchMock = jest.spyOn(window, 'fetch').mockImplementation(() => {
      return Promise.resolve(
        new Response(
          JSON.stringify({
            data: {
              getSearchSuggestions: [],
            },
          }),
          { status: 200 }
        )
      );
    });

    render(
      <AppContext.Provider value={{ ...AppContextProps, isMobile: true }}>
        <TopHeader />
      </AppContext.Provider>
    );

    const searchInput = screen
      .getByLabelText('Search Mockazon')
      .querySelector('input');
    if (searchInput) {
      await userEvent.type(searchInput, 'potato');
    }

    await waitFor(() => {
      expect(screen.queryByLabelText('test product 1')).not.toBeInTheDocument();
      expect(
        screen.queryByLabelText('second test product 2')
      ).not.toBeInTheDocument();
    });

    fetchMock.mockRestore();
  });

  it('Clicking on clear button clears the search bar', async () => {
    render(
      <AppContext.Provider value={{ ...AppContextProps, isMobile: true }}>
        <TopHeader />
      </AppContext.Provider>
    );
    const searchInput = screen
      .getByLabelText('Search Mockazon')
      .querySelector('input');
    if (searchInput) {
      await userEvent.type(searchInput, 'test');
    }
    const clearButton = screen.getByLabelText('Clear Search Input');
    fireEvent.click(clearButton);
    await waitFor(() =>
      expect(screen.getByPlaceholderText('Search Mockazon')).toHaveValue('')
    );
  });

  it('Clicking on a suggestion searches for the product', async () => {
    const fetchMock = jest.spyOn(window, 'fetch').mockImplementation(() => {
      return Promise.resolve(
        new Response(
          JSON.stringify({
            data: {
              getSearchSuggestions: ['test product 1', 'second test product 2'],
            },
          }),
          { status: 200 }
        )
      );
    });

    render(
      <AppContext.Provider value={{ ...AppContextProps, isMobile: true }}>
        <TopHeader />
      </AppContext.Provider>
    );

    const searchInput = screen
      .getByLabelText('Search Mockazon')
      .querySelector('input');
    if (searchInput) {
      await userEvent.type(searchInput, 'test');
    }

    await waitFor(() => {
      expect(screen.getByLabelText('test product 1')).toBeInTheDocument();
      expect(
        screen.getByLabelText('second test product 2')
      ).toBeInTheDocument();
    });

    const suggestion = screen.getByLabelText('test product 1');
    fireEvent.mouseDown(suggestion);
    await waitFor(() => expect(pushMock).toHaveBeenCalled());

    fetchMock.mockRestore();
  });

  it('Using arrow keys to navigate suggestions', async () => {
    const fetchMock = jest.spyOn(window, 'fetch').mockImplementation(() => {
      return Promise.resolve(
        new Response(
          JSON.stringify({
            data: {
              getSearchSuggestions: ['test product 1', 'second test product 2'],
            },
          }),
          { status: 200 }
        )
      );
    });

    render(
      <AppContext.Provider value={{ ...AppContextProps, isMobile: true }}>
        <TopHeader />
      </AppContext.Provider>
    );

    const searchInput = screen
      .getByLabelText('Search Mockazon')
      .querySelector('input');
    if (searchInput) {
      await userEvent.type(searchInput, 'test');
    }

    await waitFor(() => {
      expect(screen.getByLabelText('test product 1')).toBeInTheDocument();
      expect(
        screen.getByLabelText('second test product 2')
      ).toBeInTheDocument();
    });

    userEvent.keyboard('{arrowdown}');
    await waitFor(() => {
      expect(screen.getByDisplayValue('test product 1')).toBeInTheDocument();
    });

    fetchMock.mockRestore();
  });
});
