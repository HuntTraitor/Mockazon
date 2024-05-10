import { render, screen } from '@testing-library/react';

import { AdminRequests } from '../../../src/views/HomePage/AdminRequests';

it('Renders', async () => {
  render(<AdminRequests />);
  await screen.findByText('Requests', {
    exact: false,
  });
});

it('Renders table', async () => {
  render(<AdminRequests />);
  await screen.findByText('Name');
  await screen.findByText('Email');
  await screen.findByText('Username');
  await screen.findByText('Request Type');
  await screen.findByText('Action');
});

it('Approve and Delete buttons for request with ID 1 are clickable', async () => {
  render(<AdminRequests />);
  const approveButtonForRequest1 =
    await screen.findByTestId('approve-request-1');
  const rejectButtonForRequest1 = await screen.findByTestId('reject-request-1');

  expect(approveButtonForRequest1).not.toBeNull();
  expect(rejectButtonForRequest1).not.toBeNull();
  approveButtonForRequest1.click();
  rejectButtonForRequest1.click();
});
