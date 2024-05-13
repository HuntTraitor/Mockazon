// Referenced from Dr. Harrison's CSE 187 examples
import http from 'http';
import supertest from 'supertest';
import { http as rest, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { AuthService } from '../../src/graphql/auth/service';
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
          {
            id: '123',
            sub: '123',
            email: 'abc@email.com',
            name: 'john',
            role: 'Shopper',
          },
          { status: 200 }
        );
      } else {
        if (duplicateError) {
          return HttpResponse.json(
            { message: 'Duplicate error' },
            { status: 409 }
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

afterEach(() => {
  microServices.resetHandlers();
});

afterAll(done => {
  microServices.close();
  server.close(done);
});

test('Correct Credentials', async () => {
  const result = await supertest(server)
    .post('/api/graphql')
    .send({
      query: `mutation { signUp(
      email: "abcd@email.com",
      name: "john",
      sub: "125")
    { id, name, email, role, sub }}`,
    });

  expect(result.body.data.signUp.id).toBeDefined();
  expect(result.body.data.signUp.name).toBe('john');
  expect(result.body.data.signUp.email).toBe('abc@email.com');
  expect(result.body.data.signUp.role).toBe('Shopper');
  expect(result.body.data.signUp.sub).toBe('123');
});

test('Wrong Credentials', async () => {
  noError = false;
  const result = await supertest(server)
    .post('/api/graphql')
    .send({
      query: `mutation { signUp(
      email: "abcd@email.com",
      name: "john",
      sub: "125")
    { id, name, email, role, sub }}`,
    });
  expect(result.body.errors[0].message).toBeDefined();
  expect(result.body.errors.data).toBeUndefined();
});

test('Duplicate Account', async () => {
  noError = false;
  duplicateError = true;
  const result = await supertest(server)
    .post('/api/graphql')
    .send({
      query: `mutation { signUp(
      email: "abcd@email.com",
      name: "john",
      sub: "125")
    { id, name, email, role, sub }}`,
    });
  expect(result.body.errors[0].message).toBeDefined();
  expect(result.body.errors.data).toBeUndefined();
  expect(result.status).toBe(200);
});

test('Check test', async () => {
  await new AuthService().check();
});
