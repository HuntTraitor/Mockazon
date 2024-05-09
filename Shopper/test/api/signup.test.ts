// Referenced from Dr. Harrison's CSE 187 examples
import http from 'http';
import supertest from 'supertest';
import * as db from './db';
import { http as rest, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

import requestHandler from './requestHandler';

let server: http.Server<
  typeof http.IncomingMessage,
  typeof http.ServerResponse
>;

let noError = true;
let duplicateError = false;

const handlers = [
  rest.post(
    `http://${process.env.MICROSERVICE_URL || 'localhost'}:3010/api/v0/authenticate/signup`,
    async () => {
      if (noError) {
        return HttpResponse.json(
          { id: '123', sub: '123', email: 'abc@email.com', name: 'john' },
          { status: 200 }
        );
      } else {
        if (duplicateError) {
          return HttpResponse.json(
            { message: 'Duplicate error' },
            { status: 400 }
          );
        } else {
          return HttpResponse.json({ message: 'Login error' }, { status: 500 });
        }
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

beforeEach(async () => {
  await db.reset();
});

afterEach(() => {
  microServices.resetHandlers();
});

afterAll(done => {
  microServices.close();
  db.shutdown(() => {
    server.close(done);
  });
});

test('Correct Credentials', async () => {
  const result = await supertest(server)
    .post('/api/signup')
    .send({ sub: '123', email: 'abc@email.com', name: 'john' });
  expect(result.body.authenticated.id).toBeDefined();
  expect(result.body.authenticated.name).toBe('john');
  expect(result.body.authenticated.email).toBe('abc@email.com');
  expect(result.body.authenticated.sub).toBe('123');
});

test('Wrong Credentials', async () => {
  noError = false;
  const result = await supertest(server).post('/api/signup');
  expect(result.status).toBe(500);
});

test('Duplicate Account', async () => {
  noError = false;
  duplicateError = true;
  const result = await supertest(server).post('/api/signup');
  expect(result.status).toBe(400);
});
