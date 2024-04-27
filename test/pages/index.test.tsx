import { render, screen } from '@testing-library/react'

import Index from '../../src/pages/index';

it('Renders', async () => {
  render(<Index />)
  await screen.findByText('CSE187 Assignment 3')
});