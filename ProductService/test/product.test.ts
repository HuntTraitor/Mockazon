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

// const vendorId = '81c689b1-b7a7-4100-8b2d-309908b444f5';
// let productId = '';

// test('Anna Create Product', async () => {
//   const newProduct = {
//     name: 'Basketball',
//     price: '20.00'
//   }
//   await supertest(server)
//     .post('/api/v0/product')
//     .send(newProduct)
//     .expect(201)
//     .then((response) => {
//       console.log(response.body);
//       expect(response.body.vendor_id).toBe(vendorId);
//       productId = response.body.id;
//     });
// });

// test('Anna Disables Product', async () => {
//   await supertest(server)
//     .put(`/api/v0/product/${productId}`)
//     .expect(200)
//     .then((response) => {
//       expect(response.body.id).toBe(productId);
//       expect(response.body.vendor_id).toBe(vendorId);
//       expect(response.body.data.name).toBe('The Great Gatsby');
//       expect(response.body.active).toBe(false);
//     });
// });