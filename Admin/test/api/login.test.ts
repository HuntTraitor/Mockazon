// Referenced from Dr. Harrison's CSE 187 examples
// Referenced the Shopper's BE test

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
  rest.post(
    `http://${process.env.MICROSERVICE_URL || 'localhost'}:3010/api/v0/authenticate`,
    async () => {
      if (rightCreds) {
        return HttpResponse.json(
          { id: 'some id', accessToken: 'some token' },
          { status: 200 }
        );
      } else {
        return HttpResponse.json(
          { message: 'Error logging in' },
          { status: 401 }
        );
      }
    }
  ),
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
  expect(result.body.authenticated.id).toBe('some id');
  expect(result.body.authenticated.accessToken).toBe('some token');
});

// TODO add the rest of tests like for the auth service and valid credentials when signup is created
test('Wrong Credentials', async () => {
  rightCreds = false;
  const result = await supertest(server).post('/api/login');
  expect(result.status).toBe(401);
});
