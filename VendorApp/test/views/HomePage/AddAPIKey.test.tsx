import { fireEvent, render, screen } from '@testing-library/react';
import { graphql, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import AddAPIKey from '@/views/HomePage/AddAPIKey';
let returnError = false;

const handlers = [
  graphql.mutation('postAPIKeyRequest', ({ query /*variables*/ }) => {
    console.log(query);
    if (returnError) {
      return HttpResponse.json({
        errors: [{ message: 'Some Error' }],
      });
    }
    return HttpResponse.json({
      data: {
        postAPIKeyRequest: [
          {
            key: '81c689b1-b7a7-4100-8b2d-309908b444f5',
            vendor_id: 'test1@email.com',
            blacklisted: false,
            active: true,
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
  render(<AddAPIKey />);
});
it('Cannot Add Key', async () => {
  let alerted = false;
  render(<AddAPIKey />);
  returnError = true;
  await fireEvent.click(screen.getByLabelText('add-key'));
  window.alert = () => {
    alerted = true;
  };
  expect(alerted).toBe(true);
});
