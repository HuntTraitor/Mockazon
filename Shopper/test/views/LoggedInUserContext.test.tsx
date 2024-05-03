import { render } from '@testing-library/react';
import { LoggedInContext } from '@/contexts/LoggedInUserContext';

test('Logged in user context', () => {
  const newLoggedInContextProps = {
    accessToken: 'mockToken',
    setAccessToken: jest.fn(),
  };
  const { getByText } = render(
    <LoggedInContext.Provider value={newLoggedInContextProps}>
      <p>Hello</p>
    </LoggedInContext.Provider>
  );
  expect(getByText('Hello')).toBeDefined();
});
