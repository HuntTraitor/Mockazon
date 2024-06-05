import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import Signup from '@/pages/signup';
import { LoggedInContext } from '@/contexts/LoggedInUserContext';
import React from 'react';
import { getServerSideProps } from '@/pages/signup';
import Login from '@/pages/login';

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
    .mockResolvedValue({ data: { signUp: { accessToken: 'mockToken' } } }),
});

const mockPush = jest.fn();

jest.mock('next/router', () => ({
  useRouter: () => ({
    basePath: '',
    pathname: '/',
    query: {},
    asPath: '/',
    locale: 'en',
    locales: ['en', 'es'],
    defaultLocale: 'en',
    push: mockPush,
    replace: jest.fn(),
    reload: jest.fn(),
    back: jest.fn(),
    prefetch: jest.fn(),
    beforePopState: jest.fn(),
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
    },
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

interface User {
  accessToken: string;
  id: string;
  name: string;
  role: string;
} // FIXME: This is duplicated

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

const i18nMock = {
  language: 'en',
};

jest.mock('next-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: i18nMock,
  }),
}));

describe('Signup component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    loggedInContextProps.locale = 'en';
  });

  test('Clicking the logo navigates to the home page', async () => {
    render(
      <LoggedInContext.Provider value={loggedInContextProps}>
        <Signup />
      </LoggedInContext.Provider>
    );
    fireEvent.click(screen.getByAltText('logo'));
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/'));
  });

  it('Can render the google signup in spanish', async () => {
    i18nMock.language = 'es';
    render(
      <LoggedInContext.Provider value={loggedInContextProps}>
        <Signup />
      </LoggedInContext.Provider>
    );
    await waitFor(() => {
      expect(screen.getByText('Google Signup Button')).not.toBeNull();
    });
    i18nMock.language = 'en';
  });

  it('Can render the google singup in english', async () => {
    render(
      <LoggedInContext.Provider value={loggedInContextProps}>
        <Signup />
      </LoggedInContext.Provider>
    );
    await waitFor(() => {
      expect(screen.getByText('Google Signup Button')).not.toBeNull();
    });
  });

  it('Handles successful signup', async () => {
    render(
      <LoggedInContext.Provider value={loggedInContextProps}>
        <Signup />
      </LoggedInContext.Provider>
    );
    fireEvent.change(screen.getAllByLabelText('signup:name')[0], {
      target: { value: 'mockName' },
    });
    fireEvent.change(screen.getAllByLabelText('signup:email')[0], {
      target: { value: 'mockemail@gmail.com' },
    });
    fireEvent.change(screen.getAllByLabelText('signup:password')[0], {
      target: { value: 'mockPassword' },
    });

    fireEvent.change(screen.getAllByLabelText('signup:confirmPassword')[0], {
      target: { value: 'mockPassword' },
    });

    fireEvent.click(screen.getByText('signup:signUpText'));
    await waitFor(() =>
      expect(localStorage.getItem('user')).toBe('{"accessToken":"mockToken"}')
    );
  });

  it('Handles unsuccessful signup', async () => {
    const mockError = 'Mock error message';
    global.fetch = jest.fn().mockRejectedValue(new Error(mockError));
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    render(
      <LoggedInContext.Provider value={loggedInContextProps}>
        <Signup />
      </LoggedInContext.Provider>
    );

    fireEvent.change(screen.getAllByLabelText('signup:name')[0], {
      target: { value: 'mockName' },
    });
    fireEvent.change(screen.getAllByLabelText('signup:email')[0], {
      target: { value: 'mockemail@gmail.com' },
    });
    fireEvent.change(screen.getAllByLabelText('signup:password')[0], {
      target: { value: 'mockPassword' },
    });

    fireEvent.change(screen.getAllByLabelText('signup:confirmPassword')[0], {
      target: { value: 'mockPassword' },
    });

    fireEvent.click(screen.getByText('signup:signUpText'));
    await waitFor(() =>
      expect(alertSpy).toHaveBeenCalledWith('signup:signupFailed')
    );
  });

  it('Handles unsuccessful signup with errors', async () => {
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ errors: [{ message: 'mockError' }] }),
    });
    render(
      <LoggedInContext.Provider value={loggedInContextProps}>
        <Signup />
      </LoggedInContext.Provider>
    );

    fireEvent.change(screen.getAllByLabelText('signup:name')[0], {
      target: { value: 'mockName' },
    });
    fireEvent.change(screen.getAllByLabelText('signup:email')[0], {
      target: { value: 'mockemail@gmail.com' },
    });
    fireEvent.change(screen.getAllByLabelText('signup:password')[0], {
      target: { value: 'mockPassword' },
    });

    fireEvent.change(screen.getAllByLabelText('signup:confirmPassword')[0], {
      target: { value: 'mockPassword' },
    });

    fireEvent.click(screen.getByText('signup:signUpText'));
    await waitFor(() =>
      expect(alertSpy).toHaveBeenCalledWith('signup:signupFailed')
    );
  });

  it('Handles unsuccessful signup !response.ok', async () => {
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: jest.fn().mockResolvedValue({ errors: [{ message: 'mockError' }] }),
    });
    render(
      <LoggedInContext.Provider value={loggedInContextProps}>
        <Signup />
      </LoggedInContext.Provider>
    );

    fireEvent.change(screen.getAllByLabelText('signup:name')[0], {
      target: { value: 'mockName' },
    });

    fireEvent.change(screen.getAllByLabelText('signup:email')[0], {
      target: { value: 'mockemail@gmail.com' },
    });

    fireEvent.change(screen.getAllByLabelText('signup:password')[0], {
      target: { value: 'mockPassword' },
    });

    fireEvent.change(screen.getAllByLabelText('signup:confirmPassword')[0], {
      target: { value: 'mockPassword' },
    });

    fireEvent.click(screen.getByText('signup:signUpText'));
    await waitFor(() =>
      expect(alertSpy).toHaveBeenCalledWith('signup:signupFailed')
    );
  });

  it('Password == confirmPassword is enforced', async () => {
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    render(
      <LoggedInContext.Provider value={loggedInContextProps}>
        <Signup />
      </LoggedInContext.Provider>
    );
    fireEvent.change(screen.getAllByLabelText('signup:name')[0], {
      target: { value: 'mockName' },
    });
    fireEvent.change(screen.getAllByLabelText('signup:email')[0], {
      target: { value: 'mockemail@gmail.com' },
    });
    fireEvent.change(screen.getAllByLabelText('signup:password')[0], {
      target: { value: 'mockPassword' },
    });

    fireEvent.change(screen.getAllByLabelText('signup:confirmPassword')[0], {
      target: { value: 'mockPassword2' },
    });

    fireEvent.click(screen.getByText('signup:signUpText'));
    await waitFor(() =>
      expect(alertSpy).toHaveBeenCalledWith('signup:passwordMismatch')
    );
  });

  it('Handles successful google signup', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
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
    await waitFor(() =>
      expect(localStorage.getItem('user')).toBe('{"accessToken":"mockToken"}')
    );
    await waitFor(() =>
      expect(loggedInContextProps.setAccessToken).toHaveBeenCalledWith(
        'mockToken'
      )
    );
  });

  it('Handles unsuccessful google signup', async () => {
    const mockError = 'Mock error message';
    global.fetch = jest.fn().mockRejectedValue(new Error(mockError));

    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

    render(
      <LoggedInContext.Provider value={loggedInContextProps}>
        <Signup />
      </LoggedInContext.Provider>
    );

    fireEvent.click(screen.getByText('Google Signup Button'));

    await waitFor(() =>
      expect(alertSpy).toHaveBeenCalledWith('signup:signupFailed')
    );
  });

  it('Handles unsuccessful google signup with errors', async () => {
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ errors: [{ message: 'mockError' }] }),
    });
    render(
      <LoggedInContext.Provider value={loggedInContextProps}>
        <Signup />
      </LoggedInContext.Provider>
    );

    fireEvent.click(screen.getByText('Google Signup Button'));
    await waitFor(() =>
      expect(alertSpy).toHaveBeenCalledWith('signup:signupFailed')
    );
  });

  it('Handles duplicate account error on google signup', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: jest
        .fn()
        .mockResolvedValue({ errors: [{ message: 'Duplicate account' }] }),
    });
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    render(
      <LoggedInContext.Provider value={loggedInContextProps}>
        <Signup />
      </LoggedInContext.Provider>
    );

    fireEvent.click(screen.getByText('Google Signup Button'));
    await waitFor(() =>
      expect(alertSpy).toHaveBeenCalledWith('signup:duplicateAccount')
    );
  });

  it('Handles duplicate account error', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: jest
        .fn()
        .mockResolvedValue({ errors: [{ message: 'Duplicate account' }] }),
    });
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    render(
      <LoggedInContext.Provider value={loggedInContextProps}>
        <Signup />
      </LoggedInContext.Provider>
    );

    fireEvent.change(screen.getAllByLabelText('signup:name')[0], {
      target: { value: 'mockName' },
    });
    fireEvent.change(screen.getAllByLabelText('signup:email')[0], {
      target: { value: 'mockEmail@gmail.com' },
    });
    fireEvent.change(screen.getAllByLabelText('signup:password')[0], {
      target: { value: 'mockPassword' },
    });

    fireEvent.change(screen.getAllByLabelText('signup:confirmPassword')[0], {
      target: { value: 'mockPassword' },
    });

    fireEvent.click(screen.getByText('signup:signUpText'));
    await waitFor(() =>
      expect(alertSpy).toHaveBeenCalledWith('signup:duplicateAccount')
    );
  });

  it('Handles unsuccessful google signup !response.ok', async () => {
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: jest.fn().mockResolvedValue({ errors: [{ message: 'mockError' }] }),
    });
    render(
      <LoggedInContext.Provider value={loggedInContextProps}>
        <Signup />
      </LoggedInContext.Provider>
    );

    fireEvent.click(screen.getByText('Google Signup Button'));
    await waitFor(() =>
      expect(alertSpy).toHaveBeenCalledWith('signup:signupFailed')
    );
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

it('Handles successful signup', async () => {
  window.matchMedia = jest.fn().mockImplementation(query => {
    const isSmallScreen = true;
    return {
      matches: isSmallScreen, // Mock 'sm' breakpoint to always match
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    };
  });

  render(
    <LoggedInContext.Provider value={loggedInContextProps}>
      <Signup />
    </LoggedInContext.Provider>
  );
  fireEvent.change(screen.getAllByLabelText('signup:name')[0], {
    target: { value: 'mockName' },
  });
  fireEvent.change(screen.getAllByLabelText('signup:email')[0], {
    target: { value: 'mockemail@gmail.com' },
  });
  fireEvent.change(screen.getAllByLabelText('signup:password')[0], {
    target: { value: 'mockPassword' },
  });

  fireEvent.change(screen.getAllByLabelText('signup:confirmPassword')[0], {
    target: { value: 'mockPassword' },
  });

  fireEvent.click(screen.getByText('signup:signUpText'));
});
