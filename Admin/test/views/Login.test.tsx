import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from '@/views/Login';
import { LoginContext } from '@/contexts/Login';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer();
const URL: string = `http://${process.env.MICROSERVICE_URL || 'localhost'}:3010/api/v0/authenticate`;

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

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
  let alerted = false;
  server.use(
    http.post(URL, async () => {
      return HttpResponse.json(
        JSON.stringify({ id: 'some id', accessToken: 'some token' }),
        { status: 200 }
      );
    })
  );

  window.alert = () => {
    alerted = true;
  };

  let accessToken = '';
  const setAccessToken = (str: string) => {
    accessToken = str;
  };
  let id = '';
  const setId = (str: string) => {
    id = str;
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
