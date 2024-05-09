import { render, screen } from '@testing-library/react';

import { MyDrawer } from '../../../src/views/HomePage/Drawer';

it('Renders', async () => {
  render(<MyDrawer />);
  await screen.findByText('Mockazon', {
    exact: false,
  });
});

it('Renders tabs', async () => {
  render(<MyDrawer />);
  await screen.findByText('Users', {
    exact: false,
  });
  await screen.findByText('Requests', {
    exact: false,
  });
});

it('Tabs are clickable', async () => {
  render(<MyDrawer />);
  const users = await screen.findByText('Users', {
    exact: false,
  });
  users.click();
  await screen.findByText('Users', {
    exact: false,
  });
});
