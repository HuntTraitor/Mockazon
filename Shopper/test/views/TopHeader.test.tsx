import TopHeader from '@/views/TopHeader';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { AppContext } from '@/contexts/AppContext';

const pushMock = jest.fn();
const locale = 'en';

jest.mock('next/router', () => ({
  useRouter: () => ({
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
  }),
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
};

describe('Top Header', () => {
  it('Renders successfully', async () => {
    render(
      <AppContext.Provider value={AppContextProps}>
        <TopHeader />
      </AppContext.Provider>
    );
    await screen.findByText('Cart');
  });

  it('Clicking on the address navigates to the address editor', async () => {
    render(
      <AppContext.Provider value={AppContextProps}>
        <TopHeader />
      </AppContext.Provider>
    );
    const consoleSpy = jest.spyOn(console, 'log');
    const address = screen.getByLabelText('Address');
    address.click();
    expect(consoleSpy).toHaveBeenCalled();
    // FIXME: This test will need to be updated when the address editor is implemented
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
});
