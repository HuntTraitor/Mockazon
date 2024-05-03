import { render, screen } from '@testing-library/react';
import Content from '@/views/Content';
import { LoggedInContext } from '@/contexts/LoggedInUserContext';
import React from 'react';

const loggedInContextProps = {
  accessToken: 'abc',
  setAccessToken: jest.fn(),
};

it('Renders successfully', async () => {
  render(
    <LoggedInContext.Provider value={loggedInContextProps}>
      <Content />
    </LoggedInContext.Provider>
  );
  await screen.findByText('Hello World this is Lukas Teixeira Döpcke', {
    exact: false,
  });
});

it('renders nothing when access token', async () => {
  const localLoggedInContextProps = {
    ...loggedInContextProps,
    accessToken: '',
  };
  render(
    <LoggedInContext.Provider value={localLoggedInContextProps}>
      <Content />
    </LoggedInContext.Provider>
  );
  expect(
    screen.queryByText('Hello World this is Lukas Teixeira Döpcke')
  ).toBeNull();
});
