import { fireEvent, render, screen } from '@testing-library/react';
import { graphql, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { AdminRequests } from '../../../src/views/HomePage/AdminRequests';

let requestsError = false;
let approveError = false;

jest.mock('next/config', () => () => ({
  publicRuntimeConfig: {
    basePath: '',
  },
}));

const handlers = [
  graphql.query('GetRequests', ({ query /*, variables*/ }) => {
    console.log(query);
    if (requestsError) {
      return HttpResponse.json({
        errors: [{ message: 'Some Error' }],
      });
    }
    return HttpResponse.json({
      data: {
        request: [
          {
            id: 1,
            email: 'test1@email.com',
            name: 'test account 1',
            role: 'test',
            suspended: false,
          },
        ],
      },
    });
  }),
  graphql.mutation('approveVendor', ({ query /*, variables*/ }) => {
    console.log(query);
    if (approveError) {
      return HttpResponse.json({
        errors: [{ message: 'Some Error' }],
      });
    }
    return HttpResponse.json({
      data: {
        approveVendor: {
          id: 1,
          email: 'approved@email.com',
          name: 'approved account',
          role: 'approved',
          suspended: false,
        },
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
  await screen.findByText('Requests', { exact: false });
});

it('Renders table', async () => {
  render(<AdminRequests />);
  await screen.findByText('Name');
  await screen.findByText('Email');
  await screen.findByText('Action');
});

it('Approve button for request with ID 1 is clickable', async () => {
  render(<AdminRequests />);
  const approveButtonForRequest1 =
    await screen.findByTestId('approve-request-1');
  fireEvent.click(approveButtonForRequest1);
  expect(approveButtonForRequest1).not.toBeNull();
});

// it('Reject button for request with ID 1 is clickable', async () => {
//   render(<AdminRequests />);
//   const rejectButtonForRequest1 = await screen.findByTestId('reject-request-1');
//   fireEvent.click(rejectButtonForRequest1);
//   expect(rejectButtonForRequest1).not.toBeNull();
// });

it('Handles error', async () => {
  requestsError = true;
  render(<AdminRequests />);
});

// it('Handles approve error', async () => {
//   requestsError = false;
//   approveError = true;
//   render(<AdminRequests />);

//   const approveButtonForRequest1 =
//     await screen.findByTestId('approve-request-1');
//   fireEvent.click(approveButtonForRequest1);
// });
