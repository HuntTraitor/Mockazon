import { fireEvent, render, screen } from '@testing-library/react';
import { Signup } from '@/views/Signup/Index';
import { LoginContext } from '@/contexts/LoginContext';
it('Renders Signup Index successfully', async () => {
  render(<Signup />);
  expect(screen.getByLabelText('mockazon-logo')).toBeDefined();
  expect(screen.getByText('Create account', { exact: false })).toBeDefined();
  expect(screen.getByText('Copyright', { exact: false })).toBeDefined();
});

it('Changes between signup and login', async () => {
  render(<Signup />);
  fireEvent.click(
    screen.getByText('Already have an account?', { exact: false })
  );
  expect(screen.getAllByText('Login')).toBeDefined();
  fireEvent.click(
    screen.getByText('Request a vendor account', { exact: false })
  );
  expect(screen.getByText('Create account')).toBeDefined();
});

it('Does not render Signup Index', async () => {
  const id = 'some id';
  const setId = () => {};
  const accessToken = 'some token';
  const setAccessToken = () => {};
  render(
    <LoginContext.Provider value={{ id, setId, accessToken, setAccessToken }}>
      <Signup />
    </LoginContext.Provider>
  );
  expect(screen.queryByLabelText('mockazon-logo')).toBeNull();
  expect(screen.queryByText('Create account', { exact: false })).toBeNull();
  expect(screen.queryByText('Copyright', { exact: false })).toBeNull();
});
