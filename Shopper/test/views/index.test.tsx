import { render, screen } from '@testing-library/react';

import Index from '../../src/pages/index';

it('Renders', async () => {
  render(<Index />);
  await screen.findByText('Welcome to Mockazon', {
    exact: false,
  });
});
