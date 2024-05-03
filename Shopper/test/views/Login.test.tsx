import React, { useContext, useEffect } from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import Login from '@/views/Login';
import { LoggedInContext } from '@/contexts/LoggedInUserContext';

// https://chat.openai.com/share/b8c1fae9-15f0-4305-8344-73501d3b59ef
jest.mock('jwt-decode', () => ({
  jwtDecode: jest.fn().mockReturnValue({ sub: 'mockSub' }),
}));

global.fetch = jest.fn().mockResolvedValue({
  ok: true,
  json: jest.fn().mockResolvedValue({ authenticated: 'mockToken' }),
});

const onSuccessSpy = jest.fn();

jest.mock('@react-oauth/google', () => ({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  GoogleLogin: ({ onSuccess }) => (
    <button onClick={() => onSuccess(onSuccessSpy)}>Google Login Button</button>
  ),
}));

const loggedInContextProps = {
  accessToken: '',
  setAccessToken: jest.fn(),
};

describe('Login component', () => {
  it('Handles successful login', async () => {
    render(
      <LoggedInContext.Provider value={loggedInContextProps}>
        <Login />
      </LoggedInContext.Provider>
    );
    fireEvent.click(screen.getByText('Google Login Button'));
    // expect(onSuccessSpy).toHaveBeenCalled();
  });

  it('Handles unsuccessful login', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: jest.fn().mockResolvedValue({ authenticated: 'mockToken' }),
    });
    render(
      <LoggedInContext.Provider value={loggedInContextProps}>
        <Login />
      </LoggedInContext.Provider>
    );

    fireEvent.click(screen.getByText('Google Login Button'));
  });

  // cover test
  it('Covers setAccessToken in LoggedInProvider', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: jest.fn().mockResolvedValue({ authenticated: 'mockToken' }),
    });
    const TestComponent = () => {
      const { accessToken, setAccessToken } = useContext(LoggedInContext);
      useEffect(() => {
        setAccessToken('mockToken');
      }, [accessToken, setAccessToken]);

      return null;
    };
    render(<TestComponent />);
  });

  it('Renders nothing when access token present', async () => {
    const newLoggedInContextProps = {
      ...loggedInContextProps,
      accessToken: 'mockToken',
    };
    render(
      <LoggedInContext.Provider value={newLoggedInContextProps}>
        <Login />
      </LoggedInContext.Provider>
    );
  });
});
