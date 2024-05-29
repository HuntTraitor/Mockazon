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
  rest.get(
    `http://${process.env.MICROSERVICE_URL || 'localhost'}:3014/api/v0/vendor/check`,
    async () => {
      if (error) {
        return new HttpResponse(null, { status: 401 });
      } else {
        return HttpResponse.json(
          {
            id: '37a65191-2a4a-46c6-b7e5-d36133132b09',
            role: 'vendor',
          },
          { status: 200 }
        );
      }
    }
  ),
  rest.get(
    `http://${process.env.MICROSERVICE_URL || 'localhost'}:3013/api/v0/key/:vendor_id`,
    async ({ params }) => {
      if (error) {
        return new HttpResponse(null, { status: 401 });
      } else {
        return HttpResponse.json(
          [
            {
              key: 'some key',
              vendor_id: 'some id',
              active: true,
              blacklisted: false,
            },
            {
              key: 'some key2',
              vendor_id: 'some id',
              active: false,
              blacklisted: false,
            },
          ],
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

test('Successful key retrieval', async () => {
  error = false;
  await supertest(server)
    .post('/api/graphql')
    .set('Authorization', 'Bearer someToken')
    .send({
      query: `query key {keys {key, vendor_id, active, blacklisted}}`,
    })
    .expect('Content-Type', /json/)
    .then(res => {
      expect(res).toBeDefined();
      console.log(res.body);
      expect(res.body.data).toBeDefined();
      expect(res.body.data.keys).toBeDefined();
      expect(res.body.data.keys.length).toEqual(2);
    });
});

// test('Errors on a bad email', async () => {
//   await supertest(server)
//     .post('/api/graphql')
//     .send({
//       query: `{signup(
//       name: "Test name"
//       email: "test@gmail"
//       password: "password123"
//     ) {content}}`,
//     })
//     .expect('Content-Type', /json/)
//     .then(res => {
//       console.log(res.body);
//       expect(res).toBeDefined();
//       expect(res.body.errors.length).toEqual(1);
//       expect(res.body.errors[0].message).toBe('Argument Validation Error');
//     });
// });

// test('Errors on a too short password', async () => {
//   await supertest(server)
//     .post('/api/graphql')
//     .send({
//       query: `{signup(
//       name: "Test name"
//       email: "test@gmail.com"
//       password: "123"
//     ) {content}}`,
//     })
//     .expect('Content-Type', /json/)
//     .then(res => {
//       console.log(res.body);
//       expect(res).toBeDefined();
//       expect(res.body.errors.length).toEqual(1);
//       expect(res.body.errors[0].message).toBe('Argument Validation Error');
//     });
// });

// test('Errors on a bad microservice response', async () => {
//   error = true;
//   await supertest(server)
//     .post('/api/graphql')
//     .send({
//       query: `{signup(
//       name: "Test name"
//       email: "test@gmail.com"
//       password: "password123"
//     ) {content}}`,
//     })
//     .expect('Content-Type', /json/)
//     .then(res => {
//       console.log(res.body);
//       expect(res).toBeDefined();
//       expect(res.body.errors.length).toEqual(1);
//       expect(res.body.errors[0].message).toBe(
//         'Request failed, please try again'
//       );
//     });
// });
