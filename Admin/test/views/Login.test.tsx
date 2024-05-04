import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from '@/views/Login';
import { LoginContext } from '@/contexts/Login';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer();
const URL: string = 'http://localhost:3010/api/v0/authenticate';

it('Renders', async () => {
  render(<Login />);
  await screen.findByText('Sign In', {
    exact: false,
  });
});

it('Rejects Bad Credentials', async () => {
  let alerted = false;
  window.alert = () => {
    alerted = true;
  };
  render(<Login />);
  const email = screen.getByLabelText('Email Address *');
  await userEvent.type(email, 'anna@books.com');
  const passwd = screen.getByLabelText('Password *');
  await userEvent.type(passwd, 'not-annas-password');
  fireEvent.click(screen.getByText('Sign In'));
  await waitFor(() => {
    expect(alerted).toBeTruthy();
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

it('Signs Eesha In', async () => {
  server.use(
    http.post(URL, async () => {
      return HttpResponse.json(
        { email: email, password: passwd },
        { status: 200 }
      );
    })
  );
  render(<Login />);
  let alerted = false;
  const email = screen.getByLabelText('Email Address *');
  await userEvent.type(email, 'elkrishn@ucsc.edu');
  const passwd = screen.getByLabelText('Password *');
  await userEvent.type(passwd, 'elk');
  await fireEvent.click(screen.getByText('Sign In'));
  window.alert = () => {
    alerted = true;
  };
  await waitFor(() => expect(alerted).toBe(false));
});
