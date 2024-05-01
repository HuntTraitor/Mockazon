import supertest from 'supertest';
import * as http from 'http';

import * as db from './db';
import app from '../src/app';

let server: http.Server<
  typeof http.IncomingMessage,
  typeof http.ServerResponse
>;

beforeAll(async () => {
  server = http.createServer(app);
  server.listen();
  return db.reset();
});

afterAll((done) => {
  db.shutdown();
  server.close(done);
});

test('test', async () => {
  expect(1).toBe(1);
});

// test('Anna Create Product', async () => {
//   const newProduct = {
//     name: 'Basketball',
//     price: '20.00'
//   }
//   const vendor_id = '81c689b1-b7a7-4100-8b2d-309908b444f5';
//   await supertest(server)
//     .post('/api/v0/product')
//     .send(newProduct)
//     .expect(201)
// });