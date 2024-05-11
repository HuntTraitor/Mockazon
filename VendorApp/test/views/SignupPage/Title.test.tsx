import { render, screen } from '@testing-library/react';
import { Title } from '@/views/Signup/Title';

it('Renders Title successfully', async () => {
  render(<Title />);
  expect(screen.getByLabelText('mockazon-logo')).toBeDefined();
  expect(screen.getByText('seller central', { exact: false })).toBeDefined();
});
