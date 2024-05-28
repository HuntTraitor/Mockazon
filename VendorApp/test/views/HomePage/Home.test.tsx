import { fireEvent, render, screen } from '@testing-library/react';
import { LoginContext } from '@/contexts/LoginContext';
import { Home } from '../../../src/views/HomePage/Home';
import { graphql, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { Key, KeyContext } from '@/contexts/KeyContext';
import React from 'react';

let returnError = false;
const handlers = [
  graphql.query('key', ({ query }) => {
    console.log(query);
    if (returnError) {
      return HttpResponse.json({
        errors: [{ message: 'Some Error' }],
      });
    }
    return HttpResponse.json({
      data: {
        keys: [
          {
            key: '81c689b1-b7a7-4100-8b2d-309908b444f5',
            vendor_id: 'some id',
            active: true,
            blacklisted: false,
          },
          {
            key: '81c689b1-b7a7-4100-8b2d-309908b444f5',
            vendor_id: 'some id',
            active: false,
            blacklisted: false,
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
  const id = 'some id';
  const setId = () => {};
  localStorage.setItem('accessToken', 'some token');
  const accessToken = 'some token';
  const setAccessToken = () => {};
  let keys: Key[] = [];
  const setKeys = (newKeys: Key[]) => {
    keys = newKeys;
  };
  render(
    <LoginContext.Provider value={{ id, setId, accessToken, setAccessToken }}>
      <KeyContext.Provider value={{ keys, setKeys }}>
        <Home />
      </KeyContext.Provider>
    </LoginContext.Provider>
  );
  expect(
    screen.queryAllByText('API Keys', { exact: false }).length
  ).toBeGreaterThan(0);
  localStorage.clear();
});
