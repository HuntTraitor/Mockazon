// Referenced from Dr. Harrison's CSE 187 examples
import http from 'http';
import supertest from 'supertest';
import { http as rest, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { AuthService } from '@/graphql/auth/service';
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
            { message: 'Duplicate account' },
            { status: 409 }
          );
        } else {
          return HttpResponse.json(
            { message: 'Sign Up error' },
            { status: 500 }
          );
        }
      }
    }
  ),
  rest.post(
    `http://${process.env.MICROSERVICE_URL || 'localhost'}:3014/api/v0/shopper/signup`,
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

describe('Sign Up BE', () => {
  afterEach(() => {
    noError = true;
    duplicateError = false;
  });

  test('Signs up with google correctly', async () => {
    const result = await supertest(server)
      .post('/api/graphql')
      .send({
        query: `mutation { 
          signUp(googleCredentials: {
            email: "abcd@email.com",
            name: "john",
            sub: "125"
          }) {
            id, 
            name, 
            email, 
            role, 
            sub 
          }
        }`,
      });

    expect(result.body.data.signUp.id).toBeDefined();
    expect(result.body.data.signUp.name).toBe('john');
    expect(result.body.data.signUp.email).toBe('abc@email.com');
    expect(result.body.data.signUp.role).toBe('Shopper');
    expect(result.body.data.signUp.sub).toBe('123');
  });

  test('Signs up with regular credentials correctly', async () => {
    const result = await supertest(server)
      .post('/api/graphql')
      .send({
        query: `mutation { 
          signUp(credentials: {
            email: "abcd@email.com",
            name: "john",
            password: "password123"
          }) {
            id, 
            name, 
            email, 
            role
          }
        }`,
      });

    expect(result.body.data.signUp.id).toBeDefined();
    expect(result.body.data.signUp.name).toBe('john');
    expect(result.body.data.signUp.email).toBe('abc@email.com');
    expect(result.body.data.signUp.role).toBe('Shopper');
  });

  test('Rejects Sign Up with both google and regular credentials', async () => {
    const result = await supertest(server)
      .post('/api/graphql')
      .send({
        query: `mutation { 
          signUp(credentials: {
            email: "abcd@email.com",
            name: "john",
            password: "password123"
          },
          googleCredentials: {
            email: "abcd@email.com",
            name: "john",
            sub: "125"
          }) {
            id, 
            name, 
            email, 
            role
          }
        }`,
      });

    expect(result.body.errors).toBeDefined();
  });

  test('Rejects Sign Up with no credentials', async () => {
    const result = await supertest(server)
      .post('/api/graphql')
      .send({
        query: `mutation { 
          signUp {
            id, 
            name, 
            email, 
            role
          }
        }`,
      });

    expect(result.body.errors).toBeDefined();
  });

  test('Rejects signups with duplicate email', async () => {
    noError = false;
    duplicateError = true;
    const result = await supertest(server)
      .post('/api/graphql')
      .send({
        query: `mutation { 
          signUp(credentials: {
            email: "abcd@email.com",
            name: "john",
            password: "password123"
          }) {
            id, 
            name, 
            email, 
            role
          }
        }`,
      });

    expect(result.body.errors).toBeDefined();
    expect(result.body.errors[0].message).toBe('Duplicate account');
  });

  test('Rejects google signup with duplicate email', async () => {
    noError = false;
    duplicateError = true;
    const result = await supertest(server)
      .post('/api/graphql')
      .send({
        query: `mutation { 
          signUp(googleCredentials: {
            email: "abcd@email.com",
            name: "john",
            sub: "125"
          }) {
            id, 
            name, 
            email, 
            role
          }
        }`,
      });

    expect(result.body.errors).toBeDefined();
    expect(result.body.errors[0].message).toBe('Duplicate account');
  });

  test('Rejects google signup with microservice error', async () => {
    noError = false;
    const result = await supertest(server)
      .post('/api/graphql')
      .send({
        query: `mutation { 
          signUp(googleCredentials: {
            email: "abcd@email.com",
            name: "john",
            sub: "125"
          }) {
            id, 
            name, 
            email, 
            role
          }
        }`,
      });

    expect(result.body.errors).toBeDefined();
    expect(result.body.errors[0].message).toBe('Unexpected error.');
  });

  test('Rejects regular signup with microservice error', async () => {
    noError = false;
    const result = await supertest(server)
      .post('/api/graphql')
      .send({
        query: `mutation { 
          signUp(credentials: {
            email: "abcd@email.com",
            name: "john",
            password: "password123"
          }) {
            id, 
            name, 
            email, 
            role
          }
        }`,
      });

    expect(result.body.errors).toBeDefined();
    expect(result.body.errors[0].message).toBe('Unexpected error.');
  });

  test('Rejects google signup without sub', async () => {
    const result = await supertest(server)
      .post('/api/graphql')
      .send({
        query: `mutation { 
          signUp(googleCredentials: {
            email: "abcd@email.com",
            name: "john"
          }) {
            id, 
            name, 
            email, 
            role
          }
        }`,
      });

    expect(result.body.errors).toBeDefined();
  });

  test('Rejects google signup without email', async () => {
    const result = await supertest(server)
      .post('/api/graphql')
      .send({
        query: `mutation { 
          signUp(googleCredentials: {
            name: "john",
            sub: "125"
          }) {
            id, 
            name, 
            email, 
            role
          }
        }`,
      });

    expect(result.body.errors).toBeDefined();
  });

  test('Rejects google signup without name', async () => {
    const result = await supertest(server)
      .post('/api/graphql')
      .send({
        query: `mutation { 
          signUp(googleCredentials: {
            email: "abcd@email.com",
            sub: "125"
          }) {
            id, 
            name, 
            email, 
            role
          }
        }`,
      });

    expect(result.body.errors).toBeDefined();
  });

  test('Rejects regular signup without email', async () => {
    const result = await supertest(server)
      .post('/api/graphql')
      .send({
        query: `mutation { 
          signUp(credentials: {
            name: "john",
            password: "password123"
          }) {
            id, 
            name, 
            email, 
            role
          }
        }`,
      });

    expect(result.body.errors).toBeDefined();
  });

  test('Rejects regular signup without name', async () => {
    const result = await supertest(server)
      .post('/api/graphql')
      .send({
        query: `mutation { 
          signUp(credentials: {
            email: "abcd@email.com",
            password: "password123"
          }) {
            id, 
            name, 
            email, 
            role
          }
        }`,
      });

    expect(result.body.errors).toBeDefined();
  });

  test('Rejects regular signup without password', async () => {
    const result = await supertest(server)
      .post('/api/graphql')
      .send({
        query: `mutation { 
          signUp(credentials: {
            email: "abcd@email.com",
            name: "john"
          }) {
            id, 
            name, 
            email, 
            role
          }
        }`,
      });

    expect(result.body.errors).toBeDefined();
  });

  // FIXME: This test needs to be better
  test('Check test', async () => {
    await new AuthService().check();
  });
});
