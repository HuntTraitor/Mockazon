import { render, fireEvent, screen } from '@testing-library/react';
import Signup from '@/views/Signup';
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
    <button onClick={() => onSuccess(onSuccessSpy)}>
      Google Signup Button
    </button>
  ),
}));

const loggedInContextProps = {
  accessToken: '',
  setAccessToken: jest.fn(),
  location: 'signup',
  setLocation: jest.fn(),
  locale: 'en',
  setLocale: jest.fn(),
};

describe('Signup component', () => {
  it('Handles successful signup', async () => {
    render(
      <LoggedInContext.Provider value={loggedInContextProps}>
        <Signup />
      </LoggedInContext.Provider>
    );
    fireEvent.click(screen.getByText('Google Signup Button'));
    // expect(onSuccessSpy).toHaveBeenCalled();
  });

  it('Clicks login successfully', async () => {
    render(
      <LoggedInContext.Provider value={loggedInContextProps}>
        <Signup />
      </LoggedInContext.Provider>
    );
    fireEvent.click(screen.getByLabelText('sub-title'));
  });

  it('Handles unsuccessful signup', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: jest.fn().mockResolvedValue({ authenticated: 'mockToken' }),
    });
    render(
      <LoggedInContext.Provider value={loggedInContextProps}>
        <Signup />
      </LoggedInContext.Provider>
    );

    fireEvent.click(screen.getByText('Google Signup Button'));
  });

  it('Handles unsuccessful signup with error', async () => {
    global.fetch = jest.fn().mockRejectedValueOnce({
      ok: false,
      json: jest.fn().mockResolvedValue({ authenticated: 'mockToken' }),
    });
    render(
      <LoggedInContext.Provider value={loggedInContextProps}>
        <Signup />
      </LoggedInContext.Provider>
    );

    fireEvent.click(screen.getByText('Google Signup Button'));
  });

  it('Renders nothing when access token present', async () => {
    const newLoggedInContextProps = {
      ...loggedInContextProps,
      accessToken: 'mockToken',
    };
    render(
      <LoggedInContext.Provider value={newLoggedInContextProps}>
        <Signup />
      </LoggedInContext.Provider>
    );
  });
});
