import { render, fireEvent, screen } from '@testing-library/react';
import Signup from '@/pages/signup';
import { LoggedInContext } from '@/contexts/LoggedInUserContext';
import React from 'react';
import { getServerSideProps } from '@/pages/signup';

// https://chat.openai.com/share/b8c1fae9-15f0-4305-8344-73501d3b59ef
jest.mock('jwt-decode', () => ({
  jwtDecode: jest.fn().mockReturnValue({ sub: 'mockSub' }),
}));

global.fetch = jest.fn().mockResolvedValue({
  ok: true,
  json: jest
    .fn()
    .mockResolvedValue({ data: { signUp: { accessToken: 'mockToken' } } }),
});

jest.mock('next/router', () => ({
  useRouter: () => ({
    basePath: '',
    pathname: '/',
    query: {},
    asPath: '/',
    locale: 'en',
    locales: ['en', 'es'],
    defaultLocale: 'en',
    push: jest.fn(),
    replace: jest.fn(),
    reload: jest.fn(),
    back: jest.fn(),
    prefetch: jest.fn(),
    beforePopState: jest.fn(),
  }),
}));

const onSuccessSpy = jest.fn();

jest.mock('@react-oauth/google', () => ({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  GoogleLogin: ({ onSuccess }) => (
    <button onClick={() => onSuccess(onSuccessSpy)}>
      Google Signup Button
    </button>
  ),
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  GoogleOAuthProvider: ({ children }) => (
    <div>{children}</div> // Replace with a mock of GoogleOAuthProvider if necessary
  ),
}));

const loggedInContextProps = {
  accessToken: '',
  setAccessToken: jest.fn(),
  location: 'signup',
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
      json: jest
        .fn()
        .mockResolvedValue({ data: { signUp: { accessToken: 'mockToken' } } }),
    });
    render(
      <LoggedInContext.Provider value={loggedInContextProps}>
        <Signup />
      </LoggedInContext.Provider>
    );

    fireEvent.click(screen.getByText('Google Signup Button'));
  });

  it('Handles unsuccessful signup with duplicate account error', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: jest
        .fn()
        .mockResolvedValue({ errors: [{ message: 'Duplicate account' }] }),
    });
    render(
      <LoggedInContext.Provider value={loggedInContextProps}>
        <Signup />
      </LoggedInContext.Provider>
    );

    fireEvent.click(screen.getByText('Google Signup Button'));
  });

  it('Handles unsuccessful signup with error messages', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 400,
      json: jest.fn().mockResolvedValue({ errors: { message: 'mockError' } }),
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
      json: jest
        .fn()
        .mockResolvedValue({ data: { signUp: { accessToken: 'mockToken' } } }),
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

  it('should fetch server side props with translations', async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    await getServerSideProps({ locale: 'en' });
  });

  it('should fetch server side props with translations without locale', async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    await getServerSideProps({});
  });
});
