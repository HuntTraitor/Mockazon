import { render, screen } from '@testing-library/react';
import { Signup } from '@/views/Signup/Index';

it('Renders Signup Index successfully', async () => {
  render(<Signup />);
  expect(screen.getByLabelText('mockazon-logo')).toBeDefined();
  expect(screen.getByText('Create account', { exact: false })).toBeDefined();
  expect(screen.getByText('Copyright', { exact: false })).toBeDefined();
});
