import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { graphql, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import AddAPIKey from '@/views/HomePage/AddAPIKey';
import { Key, KeyContext } from '@/contexts/KeyContext';
let returnError = false;

const handlers = [
  graphql.mutation('key', ({ query /*variables*/ }) => {
    console.log(returnError);
    if (returnError) {
      return HttpResponse.json({
        errors: [{ message: 'Some Error in AddAPIKey' }],
      });
    }
    return HttpResponse.json({
      data: {
        postAPIKeyRequest: [
          {
            key: '81c689b1-b7a7-4100-8b2d-309908b444f5',
            vendor_id: 'some id',
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
it('Successfully Adds Key', async () => {
  let alerted = false;
  let keys: Key[] = [];
  let setKeys = (newKeys: Key[]) => {
    keys = newKeys;
  };
  render(
    <KeyContext.Provider value={{ keys, setKeys }}>
      <AddAPIKey />
    </KeyContext.Provider>
  );
  returnError = false;
  await expect(keys.length).toEqual(0);
  await fireEvent.click(screen.getByLabelText('add-key'));
  waitFor(() => {
    expect(keys.length).toEqual(1);
    console.log(keys.length);
    console.log(keys);
  });
});

it('Does not add key', async () => {
  let keys: Key[] = [];
  let setKeys = (newKeys: Key[]) => {
    keys = newKeys;
  };
  render(
    <KeyContext.Provider value={{ keys, setKeys }}>
      <AddAPIKey />
    </KeyContext.Provider>
  );
  returnError = true;
  await expect(keys.length).toEqual(0);
  await fireEvent.click(screen.getByLabelText('add-key'));
  await waitFor(() => {
    expect(keys.length).toEqual(0);
  });
});
