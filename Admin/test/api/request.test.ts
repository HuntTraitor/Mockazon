import * as http from 'http';
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
    `http://${process.env.MICROSERVICE_URL || 'localhost'}:3014/api/v0/admin/requests`,
    async () => {
      if (error) {
        return new HttpResponse(null, { status: 404 });
      } else {
        return HttpResponse.json(
          [
            {
              id: '81c689b1-b7a7-4100-8b2d-309908b444f1',
              email: 'request@email.com',
              name: 'request account 1',
              role: 'vendor',
              suspended: false,
            },
            {
              id: '81c689b1-b7a7-4100-8b2d-309908b444f2',
              email: 'request@email.com',
              name: 'request account 2',
              role: 'vendor',
              suspended: false,
            },
          ],
          { status: 200 }
        );
      }
    }
  ),
  rest.get(
    `http://${process.env.MICROSERVICE_URL || 'localhost'}:3014/api/v0/admin/check?someToken`,
    async () => {
      if (error) {
        return new HttpResponse(null, { status: 401 });
      } else {
        return HttpResponse.json(
          {
            id: '37a65191-2a4a-46c6-b7e5-d36133132b09',
            role: 'admin',
          },
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

it('fetches all requests', async () => {
  await supertest(server)
    .post('/api/graphql')
    .set('Authorization', 'Bearer someToken')
    .send({
      query: 'query GetRequests {request {id name email role suspended}}',
    })
    .expect(200)
    .then(res => {
      expect(res.body).toEqual({
        data: {
          request: [
            {
              id: '81c689b1-b7a7-4100-8b2d-309908b444f1',
              email: 'request@email.com',
              name: 'request account 1',
              role: 'vendor',
              suspended: false,
            },
            {
              id: '81c689b1-b7a7-4100-8b2d-309908b444f2',
              email: 'request@email.com',
              name: 'request account 2',
              role: 'vendor',
              suspended: false,
            },
          ],
        },
      });
    });
});

it('Approves a request', async () => {
  await supertest(server)
    .post('/api/graphql')
    .set('Authorization', 'Bearer someToken')
    .send({
      query: 'query GetRequests {request {id name email role suspended}}',
    });
});
