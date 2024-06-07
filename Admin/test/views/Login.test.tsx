import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from '@/views/Login';
import { LoginContext } from '@/contexts/Login';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import getConfig from 'next/config';

const { basePath } = getConfig().publicRuntimeConfig;

const server = setupServer();
const URL: string = `${basePath}/api/graphql`;

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

jest.mock('next/config', () => () => ({
  publicRuntimeConfig: { basePath: '' },
}));

it('Renders', async () => {
  render(<Login />);
  await screen.findByText('Sign In', {
    exact: false,
  });
});

it('Does Not Render with accessToken (already logged in)', async () => {
  const accessToken = 'some old token';
  const setAccessToken = () => {};
  const id = '';
  const setId = () => {};
  render(
    <LoginContext.Provider value={{ id, setId, accessToken, setAccessToken }}>
      <Login />
    </LoginContext.Provider>
  );
  expect(screen.queryAllByText('Sign In').length).toBe(0);
});

it('Unsuccessful Log In', async () => {
  let alerted = false;
  server.use(
    http.post(URL, async () => {
      return HttpResponse.json({}, { status: 401 });
    })
  );
  window.alert = () => {
    alerted = true;
  };

  localStorage.removeItem('user');
  const accessToken = '';
  const setAccessToken = () => {};
  const id = '';
  const setId = () => {};

  await waitFor(() =>
    render(
      <LoginContext.Provider value={{ id, setId, accessToken, setAccessToken }}>
        <Login />
      </LoginContext.Provider>
    )
  );
  expect(screen.queryAllByText('Sign In').length).toBe(1);
  const email = screen.getByLabelText('Email Address *');
  await userEvent.type(email, 'molly@books.com');
  const passwd = screen.getByLabelText('Password *');
  await userEvent.type(passwd, 'afjlksdjf');
  fireEvent.click(screen.getByText('Sign In'));
  await waitFor(() => {
    expect(alerted).toBe(true);
  });
});

it('Successful Log In', async () => {
  const accessToken = '';
  const setAccessToken = () => {};
  const id = '';
  const setId = () => {};
  let alerted = false;
  server.use(
    http.post(URL, async () => {
      return HttpResponse.json(
        {
          data: {
            login: {
              name: 'some name',
              id: '81c689b1-b7a7-4100-8b2d-309908b444f6',
              accessToken: 'some token',
            },
          },
        },
        { status: 200 }
      );
    })
  );

  window.alert = () => {
    alerted = true;
  };

  await waitFor(() =>
    render(
      <LoginContext.Provider value={{ id, setId, accessToken, setAccessToken }}>
        <Login />
      </LoginContext.Provider>
    )
  );
  expect(screen.queryAllByText('Sign In').length).toBe(1);
  const email = screen.getByLabelText('Email Address *');
  await userEvent.type(email, 'molly@books.com');
  const passwd = screen.getByLabelText('Password *');
  await userEvent.type(passwd, 'afjlksdjf');
  fireEvent.click(screen.getByLabelText('login-button'));
  await waitFor(() => {
    expect(alerted).toBe(false);
  });
});
