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
    `http://${process.env.MICROSERVICE_URL || 'localhost'}:3014/api/v0/vendor/login`,
    async () => {
      if (error) {
        return new HttpResponse(null, { status: 401 });
      } else {
        return HttpResponse.json(
          { accessToken: 'Some access token' },
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

test('Successful vendor login', async() => {
  await supertest(server)
    .post('/api/graphql')
    .send({query: `{login(
      email: "test@gmail.com"
      password: "somepassword"
    ) {accessToken}}`})
    .expect('Content-Type', /json/)
    .then(res => {
      console.log(res.body)
      expect(res).toBeDefined()
      expect(res.body).toBeDefined()
      expect(res.body.data).toBeDefined()
      expect(res.body.data.login).toBeDefined()
      expect(res.body.data.login.accessToken).toBe('Some access token')
    })
})

test('Errors on wrong credentials login', async() => {
  error = true;
  await supertest(server)
    .post('/api/graphql')
    .send({query: `{login(
      email: "test@gmail.com"
      password: "somepassword"
    ) {accessToken}}`})
    .expect('Content-Type', /json/)
    .then(res => {
      expect(res).toBeDefined()
      expect(res.body.errors.length).toEqual(1)
      expect(res.body.errors[0].message).toBe("Unauthorised")
  })
})