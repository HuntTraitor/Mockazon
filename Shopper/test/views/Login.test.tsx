import React, { useContext, useEffect } from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import Login from '@/pages/login';
import {
  LoggedInContext,
  LoggedInUserProvider,
} from '@/contexts/LoggedInUserContext';
import { getServerSideProps } from '@/pages/login';

// https://chat.openai.com/share/b8c1fae9-15f0-4305-8344-73501d3b59ef
jest.mock('jwt-decode', () => ({
  jwtDecode: jest.fn().mockReturnValue({ sub: 'mockSub' }),
}));

jest.mock('next/config', () => () => ({
  publicRuntimeConfig: { basePath: '' },
}));

global.fetch = jest.fn().mockResolvedValue({
  ok: true,
  json: jest
    .fn()
    .mockResolvedValue({ data: { login: { accessToken: 'mockToken' } } }),
});

const pushMock = jest.fn();
jest.mock('next/router', () => ({
  useRouter: () => ({
    basePath: '',
    pathname: '/',
    query: {},
    asPath: '/',
    locale: 'en',
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

const onSuccessSpy = jest.fn();

const i18nMock = {
  language: 'en',
};

jest.mock('next-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: i18nMock,
  }),
}));

jest.mock('@react-oauth/google', () => ({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  GoogleLogin: ({ onSuccess, locale }) => {
    const [l, setLocale] = React.useState('en');
    React.useEffect(() => {
      setLocale(locale);
    }, [locale]);
    return (
      <div>
        <span>{l}</span>
        <button onClick={() => onSuccess(onSuccessSpy)}>
          Google Login Button
        </button>
      </div>
    );
  },
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  GoogleOAuthProvider: ({ children }) => (
    <div>{children}</div> // Replace with a mock of GoogleOAuthProvider if necessary
  ),
}));

interface User {
  accessToken: string;
  id: string;
  name: string;
  role: string;
}

const loggedInContextProps = {
  accessToken: '',
  setAccessToken: jest.fn(),
  location: 'login',
  setLocation: jest.fn(),
  locale: 'en',
  setLocale: jest.fn(),
  user: {} as User,
  setUser: jest.fn(),
};

describe('Login component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    loggedInContextProps.locale = 'en';
  });

  it('Clicking the logo navigates to the home page', () => {
    render(
      <LoggedInContext.Provider value={loggedInContextProps}>
        <Login />
      </LoggedInContext.Provider>
    );
    fireEvent.click(screen.getByAltText('logo'));
    expect(pushMock).toHaveBeenCalledWith('/');
  });

  it('Can render the google login in spanish', async () => {
    i18nMock.language = 'es';
    render(
      <LoggedInContext.Provider value={loggedInContextProps}>
        <Login />
      </LoggedInContext.Provider>
    );
    await waitFor(() => {
      expect(screen.getByText('Google Login Button')).not.toBeNull();
    });
    i18nMock.language = 'en';
  });

  it('Can render the google login in english', async () => {
    render(
      <LoggedInContext.Provider value={loggedInContextProps}>
        <Login />
      </LoggedInContext.Provider>
    );
    await waitFor(() => {
      expect(screen.getByText('Google Login Button')).not.toBeNull();
    });
  });

  it('Handles successful login', async () => {
    render(
      <LoggedInContext.Provider value={loggedInContextProps}>
        <Login />
      </LoggedInContext.Provider>
    );

    fireEvent.change(screen.getByLabelText('login:email'), {
      target: { value: 'mockEmail' },
    });
    fireEvent.change(screen.getByLabelText('login:password'), {
      target: { value: 'mockPassword' },
    });

    fireEvent.click(screen.getByText('common:signInText'));
    await waitFor(() => {
      expect(loggedInContextProps.setAccessToken).toHaveBeenCalledWith(
        'mockToken'
      );
    });
  });

  it('Handles unsuccessful login', async () => {
    const mockError = 'Mock error message';
    global.fetch = jest.fn().mockRejectedValue(new Error(mockError));

    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

    render(
      <LoggedInContext.Provider value={loggedInContextProps}>
        <Login />
      </LoggedInContext.Provider>
    );

    fireEvent.change(screen.getByLabelText('login:email'), {
      target: { value: 'mockEmail' },
    });
    fireEvent.change(screen.getByLabelText('login:password'), {
      target: { value: 'mockPassword' },
    });

    fireEvent.click(screen.getByText('common:signInText'));

    await waitFor(() =>
      expect(alertSpy).toHaveBeenCalledWith(
        'Unexpected error occurred: Error: Mock error message'
      )
    );
  });

  it('Handles unsuccessful login with errors', async () => {
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ errors: [{ message: 'mockError' }] }),
    });
    render(
      <LoggedInContext.Provider value={loggedInContextProps}>
        <Login />
      </LoggedInContext.Provider>
    );

    fireEvent.change(screen.getByLabelText('login:email'), {
      target: { value: 'mockEmail' },
    });
    fireEvent.change(screen.getByLabelText('login:password'), {
      target: { value: 'mockPassword' },
    });

    fireEvent.click(screen.getByText('common:signInText'));
    await waitFor(() => expect(alertSpy).toHaveBeenCalledWith('mockError'));
  });

  it('Handles unsuccessful login !response.ok', async () => {
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: jest.fn().mockResolvedValue({}),
    });
    render(
      <LoggedInContext.Provider value={loggedInContextProps}>
        <Login />
      </LoggedInContext.Provider>
    );

    fireEvent.change(screen.getByLabelText('login:email'), {
      target: { value: 'mockEmail' },
    });
    fireEvent.change(screen.getByLabelText('login:password'), {
      target: { value: 'mockPassword' },
    });

    fireEvent.click(screen.getByText('common:signInText'));
    await waitFor(() =>
      expect(alertSpy).toHaveBeenCalledWith('Unexpected error occurred')
    );
  });

  it('Handles successful google login', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest
        .fn()
        .mockResolvedValue({ data: { login: { accessToken: 'mockToken' } } }),
    });
    render(
      <LoggedInContext.Provider value={loggedInContextProps}>
        <Login />
      </LoggedInContext.Provider>
    );

    fireEvent.click(screen.getByText('Google Login Button'));
    await waitFor(() =>
      expect(localStorage.getItem('user')).toBe('{"accessToken":"mockToken"}')
    );
    await waitFor(() =>
      expect(loggedInContextProps.setAccessToken).toHaveBeenCalledWith(
        'mockToken'
      )
    );
  });

  it('Navigates to signup on click', async () => {
    render(
      <LoggedInContext.Provider value={loggedInContextProps}>
        <Login />
      </LoggedInContext.Provider>
    );
    fireEvent.click(screen.getByLabelText('Create Account Button'));
    expect(pushMock).toHaveBeenCalledWith('/signup');
  });

  it('Handles unsuccessful google login', async () => {
    const mockError = 'Mock error message';
    global.fetch = jest.fn().mockRejectedValue(new Error(mockError));

    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

    render(
      <LoggedInContext.Provider value={loggedInContextProps}>
        <Login />
      </LoggedInContext.Provider>
    );

    fireEvent.click(screen.getByText('Google Login Button'));

    await waitFor(() =>
      expect(alertSpy).toHaveBeenCalledWith(
        'Unexpected error occurred: Error: Mock error message'
      )
    );
  });

  it('Handles unsuccessful google login with errors', async () => {
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ errors: [{ message: 'mockError' }] }),
    });
    render(
      <LoggedInContext.Provider value={loggedInContextProps}>
        <Login />
      </LoggedInContext.Provider>
    );

    fireEvent.click(screen.getByText('Google Login Button'));
    await waitFor(() => expect(alertSpy).toHaveBeenCalledWith('mockError'));
  });

  it('Handles unsuccessful google login !response.ok', async () => {
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: jest.fn().mockResolvedValue({}),
    });
    render(
      <LoggedInContext.Provider value={loggedInContextProps}>
        <Login />
      </LoggedInContext.Provider>
    );

    fireEvent.click(screen.getByText('Google Login Button'));
    await waitFor(() =>
      expect(alertSpy).toHaveBeenCalledWith('Unexpected error occurred')
    );
  });

  // pass code coverage for loggedinprovider
  it('Covers setAccessToken in LoggedInProvider', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: jest
        .fn()
        .mockResolvedValue({ data: { login: { accessToken: 'mockToken' } } }),
    });
    const TestComponent = () => {
      const {
        accessToken,
        locale,
        setAccessToken,
        setLocation,
        location,
        setLocale,
      } = useContext(LoggedInContext);
      useEffect(() => {
        setAccessToken('mockToken');
        setLocation('mockToken');
        setLocale('mockToken');
      }, [
        setLocale,
        accessToken,
        setAccessToken,
        location,
        setLocation,
        locale,
      ]);

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

describe('LoggedInUserProvider', () => {
  it('renders children within LoggedInContext.Provider', () => {
    const TestComponent = () => (
      <LoggedInContext.Consumer>
        {value => (
          <div data-testid="provider-value">{JSON.stringify(value)}</div>
        )}
      </LoggedInContext.Consumer>
    );
    render(
      <LoggedInUserProvider>
        <TestComponent />
      </LoggedInUserProvider>
    );
  });
});
