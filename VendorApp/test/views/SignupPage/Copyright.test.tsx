import { render, screen } from '@testing-library/react';
import { Copyright } from '@/views/Signup/Copyright';

it('Renders Copyright successfully', async () => {
  render(<Copyright />);
  expect(screen.getByText('Mockazon.com', { exact: false })).toBeDefined();
  expect(screen.getByText('Copyright', { exact: false })).toBeDefined();
});
