import { render, screen } from '@testing-library/react';

import { MyAppBar } from '../../../src/views/HomePage/AppBar';
import { jest } from '@jest/globals';

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
  const logSpy = jest.spyOn(global.console, 'log');
  render(<MyAppBar />);
  const signOut = await screen.findByText('Sign Out', {
    exact: false,
  });
  await signOut.click();
  expect(logSpy).toHaveBeenCalledWith('Sign Out');
});
