import { render, screen } from '@testing-library/react';
import { graphql, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { Users } from '@/views/HomePage/Users';

let returnError = false;

const handlers = [
  graphql.query('GetAccounts', ({ query /*variables*/ }) => {
    console.log(query);
    if (returnError) {
      return HttpResponse.json({
        errors: [{ message: 'Some Error' }],
      });
    }
    return HttpResponse.json({
      data: {
        account: [
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
  const deleteButtonForUser1 = await screen.findByTestId(
    'delete-account-81c689b1-b7a7-4100-8b2d-309908b444f5'
  );

  expect(deleteButtonForUser1).not.toBeNull();
  deleteButtonForUser1.click();
});

it('Handles error', async () => {
  returnError = true;
  render(<Users />);
});
