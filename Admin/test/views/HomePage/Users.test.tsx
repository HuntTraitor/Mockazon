import { render, screen } from '@testing-library/react';

import { Users } from '../../../src/views/HomePage/Users';

it('Renders', async () => {
  render(<Users />);
  await screen.findByText('Users', {
    exact: false,
  });
});

it('Renders table', async () => {
  render(<Users />);
  await screen.findByText('Name');
  await screen.findByText('Email');
  await screen.findByText('Username');
  await screen.findByText('Action');
});

// Needs to be changed when context provider is implemented for Users
it('Delete button for user with ID 1 is clickable', async () => {
  render(<Users />);
  const deleteButtonForUser1 = await screen.findByTestId('delete-user-1');

  expect(deleteButtonForUser1).not.toBeNull();
  deleteButtonForUser1.click();
});
