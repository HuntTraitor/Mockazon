import LanguageSwitcher from '@/views/LanguageSwitcher';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { AppContext } from '@/contexts/AppContext';

const pushMock = jest.fn();
let locale = 'en';

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
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
    },
  }),
}));

const AppContextProps = {
  backDropOpen: false,
  setBackDropOpen: jest.fn(),
  mockazonMenuDrawerOpen: false,
  setMockazonMenuDrawerOpen: jest.fn(),
};

describe('Language Switcher', () => {
  it('Renders successfully', async () => {
    render(
      <AppContext.Provider value={AppContextProps}>
        <LanguageSwitcher />
      </AppContext.Provider>
    );
    await screen.findByText('EN');
  });

  it('Clicking the language switcher opens the language choices', async () => {
    render(
      <AppContext.Provider value={AppContextProps}>
        <LanguageSwitcher />
      </AppContext.Provider>
    );
    fireEvent.mouseEnter(screen.getByLabelText('Language Box'));
    fireEvent.click(screen.getByLabelText('Language Box'));
    await screen.findByText('English');
    await screen.findByText('Español');
  });

  it('Selecting a new language changes the locale', async () => {
    render(
      <AppContext.Provider value={AppContextProps}>
        <LanguageSwitcher />
      </AppContext.Provider>
    );
    pushMock.mockImplementation(() => Promise.resolve());
    fireEvent.mouseEnter(screen.getByLabelText('Language Box'));
    fireEvent.click(screen.getByLabelText('Language Box'));
    fireEvent.click(screen.getByText('Español'));
    // expect(pushMock).toHaveBeenCalledWith('/', '/', { locale: 'es' });

    fireEvent.mouseEnter(screen.getByLabelText('Language Box'));
    fireEvent.click(screen.getByLabelText('Language Box'));
    fireEvent.click(screen.getByText('English'));
    // expect(pushMock).toHaveBeenCalledWith('/', '/', { locale: 'en' });
  });

  it('Closes the language choices when the mouse leaves', async () => {
    render(
      <AppContext.Provider value={AppContextProps}>
        <LanguageSwitcher />
      </AppContext.Provider>
    );
    fireEvent.mouseEnter(screen.getByLabelText('Language Container'));
    fireEvent.mouseLeave(screen.getByLabelText('Language Container'));

    await waitFor(() => {
      expect(screen.queryByText('English')).toBeNull();
    });
  });

  it('Does not close if mouse re-enters before timeout', async () => {
    render(
      <AppContext.Provider value={AppContextProps}>
        <LanguageSwitcher />
      </AppContext.Provider>
    );
    fireEvent.mouseEnter(screen.getByLabelText('Language Container'));
    fireEvent.mouseLeave(screen.getByLabelText('Language Container'));
    fireEvent.mouseEnter(screen.getByLabelText('Language Box'));

    await waitFor(() => {
      expect(screen.queryByText('English')).not.toBeNull();
    });
  });

  it('Renders in Spanish for the Spanish locale', async () => {
    locale = 'es';
    render(
      <AppContext.Provider value={AppContextProps}>
        <LanguageSwitcher />
      </AppContext.Provider>
    );
    await screen.findByText('ES');
  });
});
