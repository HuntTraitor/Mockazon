import { render } from '@testing-library/react';
import { LoggedInContext } from '@/contexts/LoggedInUserContext';

test('Logged in user context', () => {
  const newLoggedInContextProps = {
    accessToken: 'mockToken',
    setAccessToken: jest.fn(),
    location: 'login',
    setLocation: jest.fn(),
    locale: 'en',
    setLocale: jest.fn(),
    user: {
      accessToken: 'abc',
      id: 'abc',
      name: 'Trevor',
      role: 'Shopper',
    },
    setUser: jest.fn(),
  };
  const { getByText } = render(
    <LoggedInContext.Provider value={newLoggedInContextProps}>
      <p>Hello</p>
    </LoggedInContext.Provider>
  );
  expect(getByText('Hello')).toBeDefined();
});
