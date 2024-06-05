import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { enqueueSnackbar, SnackbarProvider } from 'notistack';
import { AppContext } from '@/contexts/AppContext';
import ProductCarousel from '@/views/ProductCarousel';

const server = setupServer();

jest.mock('notistack', () => ({
  ...jest.requireActual('notistack'),
  enqueueSnackbar: jest.fn(),
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

(enqueueSnackbar as jest.Mock).mockImplementation(jest.fn());

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const products = [
  {
    id: '123',
    quantity: 1,
    data: {
      brand: 'nature valley',
      name: 'Nature Valley Crunchy Granola Bars Oats N Honey',
      rating: '4.5',
      price: 3.68,
      deliveryDate: '2021-10-10',
      image:
        'https://images-na.ssl-images-amazon.com/images/I/81A0NlBnRNL._SL1500_.jpg',
      description:
        'GRANOLA BAR: Nature Valley granola bars are made with whole grain oats and sweet honey flavor.',
    },
  },
];

describe('ProductCarousel', () => {
  it('Should load product carousel', () => {
    render(
      <AppContext.Provider value={AppContextProps}>
        <SnackbarProvider>
          <ProductCarousel products={products} title={'title of products'} ariaLabel={''} />
        </SnackbarProvider>
      </AppContext.Provider>
    );
  });
  it('Should click previous button', () => {
    render(
      <AppContext.Provider value={AppContextProps}>
        <SnackbarProvider>
          <ProductCarousel products={products} title={'title of products'} ariaLabel={''} />
        </SnackbarProvider>
      </AppContext.Provider>
    );
    fireEvent.click(screen.getByLabelText('previous button'));
  });
  it('Should click next button', () => {
    render(
      <AppContext.Provider value={AppContextProps}>
        <SnackbarProvider>
          <ProductCarousel products={products} title={'title of products'} ariaLabel={''} />
        </SnackbarProvider>
      </AppContext.Provider>
    );
    fireEvent.click(screen.getByLabelText('next button'));
  });

  it('Renders on mobile', () => {
    render(
      <AppContext.Provider value={{ ...AppContextProps, isMobile: true }}>
        <SnackbarProvider>
          <ProductCarousel products={products} title={'title of products'} ariaLabel={''} />
        </SnackbarProvider>
      </AppContext.Provider>
    );
  });
});
