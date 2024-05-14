import TopHeader from '@/views/TopHeader';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

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

describe('Top Header', () => {
  it('Renders successfully', async () => {
    render(<TopHeader />);
    await screen.findByText('Cart');
  });

  it('Clicking on the address navigates to the address editor', async () => {
    render(<TopHeader />);
    const consoleSpy = jest.spyOn(console, 'log');
    const address = screen.getByLabelText('Address');
    address.click();
    expect(consoleSpy).toHaveBeenCalled();
    // FIXME: This test will need to be updated when the address editor is implemented
  });

  it('Clicking on orders navigates to the orders page', async () => {
    render(<TopHeader />);
    fireEvent.click(screen.getByLabelText('Orders Button'));
    expect(pushMock).toHaveBeenCalledWith('/orders');
  });

  it('Clicking on the cart navigates to the cart page', async () => {
    render(<TopHeader />);
    const cart = screen.getByLabelText('Cart Button');
    cart.click();
    expect(pushMock).toHaveBeenCalledWith('/cart');
  });
});
