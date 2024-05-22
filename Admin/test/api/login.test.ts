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
    `http://${process.env.MICROSERVICE_URL || 'localhost'}:3014/api/v0/admin/login`,
    async () => {
      if (error) {
        return new HttpResponse(null, { status: 401 });
      } else {
        return HttpResponse.json(
          {
            id: 'Some id',
            name: 'Some name',
            accessToken: 'Some access token',
          },
          { status: 200 }
        );
      }
    }
  ),
  // rest.get(
  //   `http://${process.env.MICROSERVICE_URL || 'localhost'}:3014/api/v0/admin/check`,
  //   async ({request}) => {
  //     const url = new URL(request.url);
  //     const accessToken = url.searchParams.get('accessToken');
  //     if (error || !accessToken) {
  //       return new HttpResponse(null, { status: 401 });
  //     } else {
  //       return HttpResponse.json(
  //         { id: 'some id' },
  //         { status: 200 }
  //       );
  //     }
  //   }
  // ),
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

it('Successful admin login', async () => {
  await supertest(server)
    .post('/api/graphql')
    .send({
      query: `query Login{
        login(email: "test@email.com" password: "password") {
          name accessToken id
        }
      }`,
    })
    .then(res => {
      expect(res.status).toBe(200);
      expect(res.body.data.login).toEqual({
        name: 'Some name',
        accessToken: 'Some access token',
        id: 'Some id',
      });
    });
});
