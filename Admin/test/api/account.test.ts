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

it('fetches all accounts', async () => {
  await supertest(server)
    .post('/api/graphql')
    .send({
      query: 'query GetAccount {account {id name email role suspended}}',
    })
    .expect(200);
});

it('approve an existing vendor request', async () => {
  await supertest(server)
    .post('/api/graphql')
    .send({
      query:
        'mutation approveVendor{approveVendor(VendorId: "81c689b1-b7a7-4100-8b2d-309908b444f7") {id email name role suspended}}',
    })
    .expect(200);
});

it('approve non-existing vendor request', async () => {
  const invalidID = '53c64c72-d616-45da-83ea-e6ac9f458f49';

  await supertest(server)
    .post('/api/graphql')
    .send({
      query: `mutation approveVendor{approveVendor(VendorId: "${invalidID}") {id email name role suspended}}`,
    })
    .expect(200);
});
