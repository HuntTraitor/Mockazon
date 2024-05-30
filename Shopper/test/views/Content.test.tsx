import { fireEvent, render, screen } from '@testing-library/react';
import Content from '@/views/Content';
import { LoggedInContext } from '@/contexts/LoggedInUserContext';
import { AppContext } from '@/contexts/AppContext';
import React from 'react';

interface User {
  accessToken: string;
  id: string;
  name: string;
  role: string;
}

const loggedInContextProps = {
  accessToken: 'abc',
  setAccessToken: jest.fn(),
  location: 'content',
  setLocation: jest.fn(),
  locale: 'en',
  setLocale: jest.fn(),
  user: {} as User,
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

it('Renders successfully', async () => {
  render(
    <AppContext.Provider value={AppContextProps}>
      <LoggedInContext.Provider value={loggedInContextProps}>
        <Content />
      </LoggedInContext.Provider>
    </AppContext.Provider>
  );
  await screen.findByText('Hello World this is Lukas Teixeira Döpcke', {
    exact: false,
  });
});

it('Clicks login successfully', async () => {
  render(
    <AppContext.Provider value={AppContextProps}>
      <LoggedInContext.Provider value={loggedInContextProps}>
        <Content />
      </LoggedInContext.Provider>
    </AppContext.Provider>
  );
  fireEvent.click(screen.getByText('Login Page'));
});

it('renders nothing when access token', async () => {
  const localLoggedInContextProps = {
    ...loggedInContextProps,
    accessToken: '',
  };
  render(
    <AppContext.Provider value={AppContextProps}>
      <LoggedInContext.Provider value={localLoggedInContextProps}>
        <Content />
      </LoggedInContext.Provider>
    </AppContext.Provider>
  );
  expect(
    screen.queryByText('Hello World this is Lukas Teixeira Döpcke')
  ).toBeNull();
});
