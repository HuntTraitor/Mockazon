import { render, screen } from '@testing-library/react';
import { graphql, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { AdminRequests } from '../../../src/views/HomePage/AdminRequests';

let returnError = false;

jest.mock('next/config', () => () => ({
  publicRuntimeConfig: { basePath: '' },
}));

const handlers = [
  graphql.query('GetRequests', ({ query /*variables*/ }) => {
    console.log(query);
    if (returnError) {
      return HttpResponse.json({
        errors: [{ message: 'Some Error' }],
      });
    }
    return HttpResponse.json({
      data: {
        request: [
          {
            id: '81c689b1-b7a7-4100-8b2d-309908b444f5',
            email: 'test1@email.com',
            name: 'test account 1',
            username: 'testaccount1',
            role: 'test',
            suspended: false,
          },
        ],
      },
    });
  }),
];

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

it('Renders', async () => {
  render(<AdminRequests />);
  await screen.findByText('Requests', {
    exact: false,
  });
});


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
  await screen.findByText('Action');
});

it('Approve button for request with ID 1 is clickable', async () => {
  render(<AdminRequests />);
  const approveButtonForRequest1 = await screen.findByTestId(
    'approve-request-81c689b1-b7a7-4100-8b2d-309908b444f5'
  );

  approveButtonForRequest1.click();

  expect(approveButtonForRequest1).not.toBeNull();
});

it('Reject button for request with ID 1 is clickable', async () => {
  render(<AdminRequests />);
  const rejectButtonForRequest1 = await screen.findByTestId(
    'reject-request-81c689b1-b7a7-4100-8b2d-309908b444f5'
  );

  rejectButtonForRequest1.click();
  
  expect(rejectButtonForRequest1).not.toBeNull();
});

it('Handles error', async () => {
  returnError = true;
  render(<AdminRequests />);
});
