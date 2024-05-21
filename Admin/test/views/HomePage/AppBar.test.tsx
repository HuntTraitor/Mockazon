import { render, screen } from '@testing-library/react';

import { MyAppBar } from '../../../src/views/HomePage/AppBar';

jest.mock('next/config', () => () => ({
  publicRuntimeConfig: { basePath: '' },
}));

it('Renders', async () => {
  render(<MyAppBar />);
  await screen.findByText('Sign Out', {
    exact: false,
  });
});

it('Renders Avatar', async () => {
  render(<MyAppBar />);
  await screen.findByAltText('User Avatar');
});

it('Sign Out button is clickable', async () => {
  render(<MyAppBar />);
  const signOut = await screen.findByText('Sign Out', {
    exact: false,
  });
  signOut.click();
  await screen.findByText('Sign Out', {
    exact: false,
  });
});
