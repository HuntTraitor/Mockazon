import { render } from '@testing-library/react';
import { useState } from 'react';
import useLoadLocalStorageUser from '@/views/useLoadUserFromLocalStorage';

interface User {
  accessToken: string;
  id: string;
  name: string;
  role: string;
}

// Mock component that uses the hook
const MockComponent = () => {
  const [user, setUser] = useState({} as User);
  const [accessToken, setAccessToken] = useState('');
  useLoadLocalStorageUser(setUser, setAccessToken);

  return (
    <div>
      {user && <div data-testid="user">{user.name}</div>}
      {accessToken && <div data-testid="token">{accessToken}</div>}
    </div>
  );
};

describe('useLoadLocalStorageUser', () => {
  it('loads user from local storage', () => {
    // Arrange
    const mockUser = {
      accessToken: 'testToken',
      id: 'testId',
      name: 'testName',
      role: 'testRole',
    };
    localStorage.setItem('user', JSON.stringify(mockUser));

    // Act
    const { getByTestId } = render(<MockComponent />);

    // Assert
    expect(getByTestId('user').textContent).toBe(mockUser.name);
    expect(getByTestId('token').textContent).toBe(mockUser.accessToken);
  });

  it('does not load user if local storage is empty', () => {
    localStorage.removeItem('user');
    const { queryByTestId } = render(<MockComponent />);
    expect(queryByTestId('user')).toBeEmpty();
    expect(queryByTestId('token')).toBeNull();
  });
});
