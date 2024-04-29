import { render, screen } from '@testing-library/react';

import Index from '../../src/pages/index';

it('Renders', async () => {
  render(<Index />);
  await screen.findByText('Hello World this is Lukas Teixeira Döpcke', {
    exact: false,
  });
});
