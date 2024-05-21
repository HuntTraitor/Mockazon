import * as http from 'http';
import supertest from 'supertest';

import * as db from './db';
import requestHandler from './requestHandler';

let server: http.Server<
  typeof http.IncomingMessage,
  typeof http.ServerResponse
>;

beforeAll(async () => {
  server = http.createServer(requestHandler);
  server.listen();
  await db.reset();
});

afterAll(done => {
  db.shutdown(() => {
    server.close(done);
  });
});

it('fetches all requests', async () => {
  await supertest(server)
    .post('/api/graphql')
    .send({
      query: 'query GetRequests {request {id name email role suspended}}',
    })
    .expect(200);
});
