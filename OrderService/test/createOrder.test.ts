import supertest from 'supertest';
import * as http from 'http';

import * as db from './db';
import app from '../src/app';

let server: http.Server<
  typeof http.IncomingMessage,
  typeof http.ServerResponse
>;

beforeEach(async () => {
  server = http.createServer(app);
  server.listen();
  await db.reset();
});

afterAll(done => {
  db.shutdown();
  server.close(done);
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const vendorId = '6a2f7661-a63f-4dd5-bcda-e9c1d4f85ff8';
const productId = '3f2687d0-d115-421f-ae23-ac572005a791';
const shopperId = '1ed8ca72-2027-4d19-ba6b-e6be75ab7d8b';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockOrder = {
  product_id: productId,
  shopper_id: shopperId,
  quantity: '2',
};

test('Opens the swagger docs page 200', async () => {
  await supertest(server).post('/api/v0/docs').expect(200);
});

// test('Creates a new order 201', async () => {
//   await supertest(server)
//     .post(`/api/v0/vendororder?vendorId=${vendorId}`)
//     .send(mockOrder)
//     .expect(201)
//     .then(res => {
//       expect(res.body).toBeDefined();
//       expect(res.body.id).toBeDefined();
//       expect(res.body.vendor_id).toBe(vendorId);
//       expect(res.body.product_id).toBe(productId);
//       expect(res.body.shopper_id).toBe(shopperId);
//       expect(res.body.data).toBeDefined();
//       expect(res.body.data.quantity).toBe(mockOrder.quantity);
//       expect(res.body.data.purchaseDate).toBeDefined();
//       expect(res.body.data.delivered).toBeFalsy();
//       expect(res.body.data.shipped).toBeFalsy();
//     });
// });

// test('Creates a new order no vendorId 400', async () => {
//   await supertest(server)
//     .post(`/api/v0/vendororder`)
//     .send(mockOrder)
//     .expect(400);
// });

// test('Creates a new order bad vendorId 400', async () => {
//   await supertest(server)
//     .post(`/api/v0/vendororder?vendorId=1234`)
//     .send(mockOrder)
//     .expect(400);
// });

// test('Creates a new order extra param in body 400', async () => {
//   await supertest(server)
//     .post(`/api/v0/vendororder?vendorId=${vendorId}`)
//     .send({
//       product_id: productId,
//       shopper_id: shopperId,
//       quantity: '2',
//       badParam: 'test',
//     })
//     .expect(400);
// });

// test('Creates a new order missing param in body 400', async () => {
//   await supertest(server)
//     .post(`/api/v0/vendororder?vendorId=${vendorId}`)
//     .send({
//       product_id: productId,
//       shopper_id: shopperId,
//     })
//     .expect(400);
// });

// test('Creates a new order bad productId 400', async () => {
//   await supertest(server)
//     .post(`/api/v0/vendororder?vendorId=${vendorId}`)
//     .send({
//       product_id: '1234',
//       shopper_id: shopperId,
//       quantity: '2',
//     })
//     .expect(400);
// });

// test('Creates a new order bad shopperId 400', async () => {
//   await supertest(server)
//     .post(`/api/v0/vendororder?vendorId=${vendorId}`)
//     .send({
//       product_id: productId,
//       shopper_id: '1234',
//       quantity: '2',
//     })
//     .expect(400);
// });

// test('Creates a new order quantity 0 400', async () => {
//   const badQuantity = mockOrder;
//   badQuantity.quantity = '0';
//   await supertest(server)
//     .post(`/api/v0/vendororder?vendorId=${vendorId}`)
//     .send(badQuantity)
//     .expect(400);
// });

// test('Creates a new order quantity 1000 400', async () => {
//   const badQuantity = mockOrder;
//   badQuantity.quantity = '1000';
//   await supertest(server)
//     .post(`/api/v0/vendororder?vendorId=${vendorId}`)
//     .send(badQuantity)
//     .expect(400);
// });
