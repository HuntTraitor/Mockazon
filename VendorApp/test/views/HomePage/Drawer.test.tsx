import { render, screen } from '@testing-library/react';

import { MyDrawer } from '../../../src/views/HomePage/Drawer';

it('Renders', async () => {
  render(<MyDrawer />);
  await screen.findByText('Mockazon Vendor App', {
    exact: false,
  });
});

it('Renders tabs', async () => {
  render(<MyDrawer />);
  await screen.findByText('API Keys', {
    exact: false,
  });
});

it('Tabs are clickable', async () => {
  render(<MyDrawer />);
  const keys = await screen.findByText('API Keys', {
    exact: false,
  });
  keys.click();
});
