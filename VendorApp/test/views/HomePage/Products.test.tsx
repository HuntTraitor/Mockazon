import { render, screen } from '@testing-library/react';
import { graphql, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import Products from '@/views/HomePage/Products';

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
  render(<Products />);
  await screen.findByText('Products', {
    exact: false,
  });
});

it('Renders table', async () => {
  render(<Products />);
  await screen.findByText('Name');
  await screen.findByText('Price');
  await screen.findByText('Action');
});
