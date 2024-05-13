import SignInDropdown from '@/views/SignInDropdown';
import { LoggedInContext } from '@/contexts/LoggedInUserContext';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';

const pushMock = jest.fn();
const locale = 'en';

jest.mock('react-i18next', () => ({
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

let mockName = '';
const providerProps = {
  accessToken: '',
  setAccessToken: jest.fn(),
  location: '',
  setLocation: jest.fn(),
  locale: '',
  setLocale: jest.fn(),
  user: { accessToken: '', id: '', name: mockName, role: '' },
  setUser: jest.fn(),
};

describe('Sign In Dropdown', () => {
  it('Renders successfully', async () => {
    render(
      <LoggedInContext.Provider value={{ ...providerProps }}>
        <SignInDropdown />
      </LoggedInContext.Provider>
    );
    await screen.findByText('Hello,', { exact: false });
  });

  it("Shows a user's name if they are logged in", async () => {
    render(
      <LoggedInContext.Provider
        value={{
          ...providerProps,
          user: { accessToken: '', id: '', name: 'Guest', role: '' },
        }}
      >
        <SignInDropdown />
      </LoggedInContext.Provider>
    );
    await screen.findByText('Hello, Guest');
  });

  it('Shows a sign in message if the user is not logged in', async () => {
    mockName = '';
    render(
      <LoggedInContext.Provider value={providerProps}>
        <SignInDropdown />
      </LoggedInContext.Provider>
    );
    await screen.findByText('sign in', { exact: false });
  });

  it('Opens the sign in dropdown when hovered over', async () => {
    render(
      <LoggedInContext.Provider value={providerProps}>
        <SignInDropdown />
      </LoggedInContext.Provider>
    );
    fireEvent.mouseEnter(screen.getByLabelText('Sign In Container'));
    await screen.findByText('sign in');
    await screen.findByText('New Customer?', { exact: false });
  });

  it('Closes the sign in dropdown when the mouse leaves', async () => {
    render(
      <LoggedInContext.Provider value={providerProps}>
        <SignInDropdown />
      </LoggedInContext.Provider>
    );
    fireEvent.mouseEnter(screen.getByLabelText('Sign In Container'));
    fireEvent.mouseLeave(screen.getByLabelText('Sign In Container'));
    await waitFor(() => {
      expect(screen.queryByText('sign in')).toBeNull();
    });
  });

  it('Does not close if mouse re-enters before timeout', async () => {
    render(
      <LoggedInContext.Provider value={providerProps}>
        <SignInDropdown />
      </LoggedInContext.Provider>
    );
    fireEvent.mouseEnter(screen.getByLabelText('Sign In Container'));
    fireEvent.mouseLeave(screen.getByLabelText('Sign In Container'));
    fireEvent.mouseEnter(screen.getByLabelText('Sign In Container'));
    await waitFor(() => {
      expect(screen.queryByText('sign in')).not.toBeNull();
    });
  });

  it('Goes to login page when sign in is clicked', async () => {
    render(
      <LoggedInContext.Provider value={providerProps}>
        <SignInDropdown />
      </LoggedInContext.Provider>
    );
    fireEvent.mouseEnter(screen.getByLabelText('Sign In Container'));
    fireEvent.click(screen.getByText('sign in'));
    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith('/login');
    });
  });

  it('Shows sign out button when user is logged in', async () => {
    render(
      <LoggedInContext.Provider
        value={{
          ...providerProps,
          user: { accessToken: '', id: '', name: 'Guest', role: '' },
        }}
      >
        <SignInDropdown />
      </LoggedInContext.Provider>
    );
    fireEvent.mouseEnter(screen.getByLabelText('Sign In Container'));
    await screen.findByText('Sign Out');
    fireEvent.click(screen.getByText('Sign Out'));
    await waitFor(() => {
      expect(localStorage.getItem('user')).toBeNull();
    });
  });
});
