import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import SignInDropdown from '@/views/SignInDropdown';
import { LoggedInContext } from '@/contexts/LoggedInUserContext';
import { AppContext } from '@/contexts/AppContext';

const pushMock = jest.fn();
const locale = 'en';

jest.mock('next-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      switch (key) {
        case 'hello':
          return 'Hello,';
        case 'signInText':
          return 'sign in';
        case 'accountsAndLists':
          return 'Accounts & Lists';
        case 'signOutText':
          return 'Sign Out';
        case 'newCustomer':
          return 'New Customer?';
        case 'startHere':
          return 'Start here.';
        default:
          return key;
      }
    },
    i18n: {
      changeLanguage: jest.fn(),
    },
  }),
}));

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

const providerProps = {
  accessToken: '',
  setAccessToken: jest.fn(),
  location: '',
  setLocation: jest.fn(),
  locale: '',
  setLocale: jest.fn(),
  user: { accessToken: '', id: '', name: '', role: '' },
  setUser: jest.fn(),
};

const AppContextProps = {
  backDropOpen: false,
  setBackDropOpen: jest.fn(),
};

describe('Sign In Dropdown', () => {
  it('Renders successfully', async () => {
    render(
      <AppContext.Provider value={AppContextProps}>
        <LoggedInContext.Provider value={{ ...providerProps }}>
          <SignInDropdown />
        </LoggedInContext.Provider>
      </AppContext.Provider>
    );
    await screen.findByText('Hello,', { exact: false });
  });

  it("Shows a user's name if they are logged in", async () => {
    render(
      <AppContext.Provider value={AppContextProps}>
        <LoggedInContext.Provider
          value={{
            ...providerProps,
            user: { accessToken: '', id: '', name: 'Guest', role: '' },
          }}
        >
          <SignInDropdown />
        </LoggedInContext.Provider>
      </AppContext.Provider>
    );
    await screen.findByText('Hello, Guest');
  });

  it('Shows a sign in message if the user is not logged in', async () => {
    render(
      <AppContext.Provider value={AppContextProps}>
        <LoggedInContext.Provider value={providerProps}>
          <SignInDropdown />
        </LoggedInContext.Provider>
      </AppContext.Provider>
    );
    await screen.findByText('sign in', { exact: false });
  });

  it('Opens the sign in dropdown when hovered over', async () => {
    render(
      <AppContext.Provider value={AppContextProps}>
        <LoggedInContext.Provider value={providerProps}>
          <SignInDropdown />
        </LoggedInContext.Provider>
      </AppContext.Provider>
    );
    fireEvent.mouseEnter(screen.getByLabelText('AppBar Account Button'));
    await screen.findByText('New Customer?', { exact: false });
  });

  it('Closes the sign in dropdown when the mouse leaves', async () => {
    render(
      <AppContext.Provider value={AppContextProps}>
        <LoggedInContext.Provider value={providerProps}>
          <SignInDropdown />
        </LoggedInContext.Provider>
      </AppContext.Provider>
    );
    fireEvent.mouseEnter(screen.getByLabelText('AppBar Account Button'));
    fireEvent.mouseLeave(screen.getByLabelText('Sign In Container'));
    await waitFor(() => {
      expect(screen.queryByText('New Customer?', { exact: false })).toBeNull();
    });
  });

  it('Goes to login page when sign in is clicked', async () => {
    render(
      <AppContext.Provider value={AppContextProps}>
        <LoggedInContext.Provider value={providerProps}>
          <SignInDropdown />
        </LoggedInContext.Provider>
      </AppContext.Provider>
    );
    fireEvent.mouseEnter(screen.getByLabelText('AppBar Account Button'));
    const signInText = await screen.getByLabelText('Sign In Button');
    fireEvent.click(signInText);
    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith('/login');
    });
  });

  it('Shows sign out button when user is logged in', async () => {
    render(
      <AppContext.Provider value={AppContextProps}>
        <LoggedInContext.Provider
          value={{
            ...providerProps,
            user: { accessToken: '', id: '', name: 'Guest', role: '' },
          }}
        >
          <SignInDropdown />
        </LoggedInContext.Provider>
      </AppContext.Provider>
    );
    fireEvent.mouseEnter(screen.getByLabelText('AppBar Account Button'));
    await screen.findByText('Sign Out');
    fireEvent.click(screen.getByText('Sign Out'));
    await waitFor(() => {
      expect(localStorage.getItem('user')).toBeNull();
    });
  });
});
