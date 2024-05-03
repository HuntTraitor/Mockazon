// Referenced from Dr. Harrison's CSE 187 examples
import http from 'http';
import supertest from 'supertest';

import { http as rest, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

import requestHandler from './requestHandler';

let server: http.Server<
  typeof http.IncomingMessage,
  typeof http.ServerResponse
>;

let rightCreds = true;

const handlers = [
  rest.get('http://localhost:3010/api/v0/authenticate/user', async () => {
    if (rightCreds) {
      return HttpResponse.json(
        { id: '123', name: 'user name', accessToken: '456', role: 'shopper' },
        { status: 200 }
      );
    } else {
      return HttpResponse.json({ message: 'Login error' }, { status: 500 });
    }
  }),
];

const microServices = setupServer(...handlers);

beforeAll(async () => {
  microServices.listen({ onUnhandledRequest: 'bypass' });
  server = http.createServer(requestHandler);
  server.listen();
});

afterEach(() => {
  microServices.resetHandlers();
});

afterAll(done => {
  microServices.close();
  server.close(done);
});

test('Correct Credentials', async () => {
  const result = await supertest(server).post('/api/login');
  expect(result.body.authenticated.id).toBe('123');
  expect(result.body.authenticated.name).toBe('user name');
  expect(result.body.authenticated.accessToken).toBe('456');
  expect(result.body.authenticated.role).toBe('shopper');
});

// TODO add the rest of tests like for the auth service and valid credentials when signup is created
test('Wrong Credentials', async () => {
  rightCreds = false;
  const result = await supertest(server).post('/api/login');
  expect(result.status).toBe(500);
});
