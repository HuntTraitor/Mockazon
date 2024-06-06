import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { enqueueSnackbar, SnackbarProvider } from 'notistack';
import { AppContext } from '@/contexts/AppContext';
import BannerCarousel from '@/views/BannerCarousel';
import { act } from '@testing-library/react';

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

beforeEach(() => {
  jest.useFakeTimers();
});

beforeAll(() => server.listen());

afterEach(() => {
  server.resetHandlers();
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

afterAll(() => server.close());

describe('bannerCarousel', () => {
  it('Should load banner carousel', () => {
    render(
      <AppContext.Provider value={AppContextProps}>
        <SnackbarProvider>
          <BannerCarousel />
        </SnackbarProvider>
      </AppContext.Provider>
    );
  });

  it('Renders on mobile', () => {
    render(
      <AppContext.Provider value={{ ...AppContextProps, isMobile: true }}>
        <SnackbarProvider>
          <BannerCarousel />
        </SnackbarProvider>
      </AppContext.Provider>
    );
  });

  it('navigate the carousel with previous and next buttons', () => {
    render(
      <AppContext.Provider value={AppContextProps}>
        <SnackbarProvider>
          <BannerCarousel />
        </SnackbarProvider>
        \
      </AppContext.Provider>
    );
    const previousButton = screen.getByLabelText('previous slide button');
    const nextButton = screen.getByLabelText('next slide button');

    fireEvent.click(nextButton);
    fireEvent.click(previousButton);
  });

  it('should set activeArrow to null when clicking outside the carousel', () => {
    render(
      <AppContext.Provider value={AppContextProps}>
        <SnackbarProvider>
          <BannerCarousel />
          <div data-testid="outside-element">Outside Element</div>
        </SnackbarProvider>
      </AppContext.Provider>
    );

    const previousButton = screen.getByLabelText('previous slide button');
    const outsideElement = screen.getByTestId('outside-element');

    fireEvent.click(previousButton);
    expect(previousButton).toHaveClass('active');

    fireEvent.mouseDown(outsideElement);
    expect(previousButton).not.toHaveClass('active');
  });

  it('should automatically go to the next slide after 10 seconds', () => {
    render(
      <AppContext.Provider value={AppContextProps}>
        <SnackbarProvider>
          <BannerCarousel />
        </SnackbarProvider>
      </AppContext.Provider>
    );

    const initialSlide = screen.getByAltText('Banner 1');
    expect(initialSlide).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(10000);
    });

    const nextSlide = screen.getByAltText('Banner 2');
    expect(nextSlide).toBeInTheDocument();
  });
});
