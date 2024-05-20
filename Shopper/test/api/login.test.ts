// Referenced from Dr. Harrison's CSE 187 examples
import http from 'http';
import supertest from 'supertest';

import { http as rest, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

import requestHandler from './requestHandler';
import { randomUUID } from 'crypto';

let server: http.Server<
  typeof http.IncomingMessage,
  typeof http.ServerResponse
>;

let rightCreds = true;

const handlers = [
  rest.post(
    `http://${process.env.MICROSERVICE_URL || 'localhost'}:3010/api/v0/authenticate/user`,
    async () => {
      if (rightCreds) {
        return HttpResponse.json(
          { id: '123', name: 'user name', accessToken: '456', role: 'shopper' },
          { status: 200 }
        );
      } else {
        return HttpResponse.json({ message: 'Login error' }, { status: 500 });
      }
    }
  ),
  rest.post(
    `http://${process.env.MICROSERVICE_URL || 'localhost'}:3014/api/v0/shopper/login`,
    async () => {
      if (rightCreds) {
        return HttpResponse.json(
          { id: '123', name: 'user name', accessToken: '456', role: 'shopper' },
          { status: 200 }
        );
      } else {
        return HttpResponse.json({ message: 'Login error' }, { status: 500 });
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

describe('Login BE', () => {
  afterEach(() => {
    jest.clearAllMocks();
    rightCreds = true;
  });

  test('Login with right sub google credentials', async () => {
    const response = await supertest(server)
      .post('/api/graphql')
      .send({
        query: `{
          login(sub: "${randomUUID()}") {
            id
            name
            accessToken
            role
          }
        }`,
      });
    expect(response.status).toBe(200);
    expect(response.body.data.login).toEqual({
      id: '123',
      name: 'user name',
      accessToken: '456',
      role: 'shopper',
    });
  });

  test('Login with right credentials', async () => {
    rightCreds = true;
    const response = await supertest(server)
      .post('/api/graphql')
      .send({
        query: `{
          login(email: "abcd@email.com", password: "1234" ) {
            id
            name
            accessToken
            role
          }
        }`,
      });
    expect(response.status).toBe(200);
    console.log(response.body);
    expect(response.body.data.login).toEqual({
      id: '123',
      name: 'user name',
      accessToken: '456',
      role: 'shopper',
    });
  });

  test('Login with wrong credentials', async () => {
    rightCreds = false;
    const response = await supertest(server)
      .post('/api/graphql')
      .send({
        query: `{
          login(email: "abcd@email.com", password: "1234") {
            id
            name
            accessToken
            role
          }
        }`,
      });
    expect(response.status).toBe(200);
    expect(response.body.errors[0].message).toEqual('Login error');
  });

  test('Login with wrong sub google credentials', async () => {
    rightCreds = false;
    const response = await supertest(server)
      .post('/api/graphql')
      .send({
        query: `{
          login(sub: "${randomUUID()}") {
            id
            name
            accessToken
            role
          }
        }`,
      });
    expect(response.status).toBe(200);
    expect(response.body.errors[0].message).toEqual('Login error');
  });

  test('Rejects no credentials', async () => {
    const response = await supertest(server)
      .post('/api/graphql')
      .send({
        query: `{
          login {
            id
            name
            accessToken
            role
          }
        }`,
      });
    expect(response.status).toBe(200);
    expect(response.body.errors[0].message).toEqual('Invalid input');
  });

  test('Rejects sub with email', async () => {
    const response = await supertest(server)
      .post('/api/graphql')
      .send({
        query: `{
          login(sub: "1234", email: "abcd@email.com") {
            id
            name
            accessToken
            role
          }
        }`,
      });
    expect(response.status).toBe(200);
    expect(response.body.errors[0].message).toEqual('Invalid input');
  });

  test('Rejects sub with password', async () => {
    const response = await supertest(server)
      .post('/api/graphql')
      .send({
        query: `{
          login(sub: "1234", password: "1234") {
            id
            name
            accessToken
            role
          }
        }`,
      });
    expect(response.status).toBe(200);
    expect(response.body.errors[0].message).toEqual('Invalid input');
  });
});
