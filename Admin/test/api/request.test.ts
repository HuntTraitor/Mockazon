import * as http from 'http';
import supertest from 'supertest';

import requestHandler from './requestHandler';

let server: http.Server<
  typeof http.IncomingMessage,
  typeof http.ServerResponse
>;

beforeAll(async () => {
  server = http.createServer(requestHandler);
  server.listen();
});

afterAll(done => {
  server.close(done);
});

it('fetches all requests', async () => {
  await supertest(server)
    .post('/api/graphql')
    .send({
      query: 'query GetRequests {request {id name email role suspended}}',
    })
    .expect(200);
});
