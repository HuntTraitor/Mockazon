import { render, screen } from '@testing-library/react';

import Index from '../../src/pages/index';

it('Renders', async () => {
  render(<Index />);
  await screen.findByText('Mockazon Vendor App', {
    exact: false,
  });
});
