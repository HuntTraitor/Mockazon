import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from '@/views/Login';
import { LoginContext } from '@/contexts/Login';
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
  const userName = '';
  const setUserName = () => {};
  render(
    <LoginContext.Provider
      value={{ userName, setUserName, accessToken, setAccessToken }}
    >
      <Login />
    </LoginContext.Provider>
  );
  expect(screen.queryAllByText('Sign In').length).toBe(0);
});
