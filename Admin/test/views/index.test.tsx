import { render, screen } from '@testing-library/react';
import Index from '../../src/pages/index';

jest.mock('next/config', () => () => ({
  publicRuntimeConfig: { basePath: '' },
}));

it('Renders', async () => {
  render(<Index />);
  await screen.findByText('Sign In', {
    exact: false,
  });
});
