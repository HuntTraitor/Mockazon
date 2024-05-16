import http from 'http';
import supertest from 'supertest';

import { http as rest, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

import requestHandler from './requestHandler';

let server: http.Server<
  typeof http.IncomingMessage,
  typeof http.ServerResponse
>;
let error = false;
const handlers = [
  rest.post(
    `http://${process.env.MICROSERVICE_URL || 'localhost'}:3014/api/v0/vendor/signup`,
    async () => {
      if (error) {
        return new HttpResponse(null, { status: 401 });
      } else {
        return HttpResponse.json(
          { content: 'Message sent successfully' },
          { status: 200 }
        );
      }
    }
  ),
];

const microServices = setupServer(...handlers);

beforeAll(async () => {
  microServices.listen();
  server = http.createServer(requestHandler);
  server.listen();
});

afterEach(() => {
  error = false;
  microServices.resetHandlers();
});

afterAll(done => {
  microServices.close();
  server.close(done);
});

test('Successful request', async () => {
  await supertest(server)
    .post('/api/graphql')
    .send({
      query: `{signup(
      name: "Test name"
      email: "test@gmail.com"
      password: "password123"
    ) {content}}`,
    })
    .expect('Content-Type', /json/)
    .then(res => {
      expect(res).toBeDefined();
      expect(res.body.data).toBeDefined();
      expect(res.body.data.signup).toBeDefined();
      expect(res.body.data.signup.content).toBe(
        'Account successfully requested'
      );
    });
});

test('Errors on a bad email', async () => {
  await supertest(server)
    .post('/api/graphql')
    .send({
      query: `{signup(
      name: "Test name"
      email: "test@gmail"
      password: "password123"
    ) {content}}`,
    })
    .expect('Content-Type', /json/)
    .then(res => {
      console.log(res.body);
      expect(res).toBeDefined();
      expect(res.body.errors.length).toEqual(1);
      expect(res.body.errors[0].message).toBe('Argument Validation Error');
    });
});

test('Errors on a too short password', async () => {
  await supertest(server)
    .post('/api/graphql')
    .send({
      query: `{signup(
      name: "Test name"
      email: "test@gmail.com"
      password: "123"
    ) {content}}`,
    })
    .expect('Content-Type', /json/)
    .then(res => {
      console.log(res.body);
      expect(res).toBeDefined();
      expect(res.body.errors.length).toEqual(1);
      expect(res.body.errors[0].message).toBe('Argument Validation Error');
    });
});

test('Errors on a bad microservice response', async () => {
  error = true;
  await supertest(server)
    .post('/api/graphql')
    .send({
      query: `{signup(
      name: "Test name"
      email: "test@gmail.com"
      password: "password123"
    ) {content}}`,
    })
    .expect('Content-Type', /json/)
    .then(res => {
      console.log(res.body);
      expect(res).toBeDefined();
      expect(res.body.errors.length).toEqual(1);
      expect(res.body.errors[0].message).toBe(
        'Request failed, please try again'
      );
    });
});
