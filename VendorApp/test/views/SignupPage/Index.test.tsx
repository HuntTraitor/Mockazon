import { fireEvent, render, screen } from '@testing-library/react';
import { Signup } from '@/views/Signup/Index';

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
  expect(screen.getByText('Login')).toBeDefined();
  fireEvent.click(
    screen.getByText('Request a vendor account', { exact: false })
  );
  expect(screen.getByText('Create account')).toBeDefined();
});
