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

afterAll((done) => {
  db.shutdown();
  server.close(done);
});

const productId = '3f2687d0-d115-421f-ae23-ac572005a791'
const mockOrder = {
  purchaseDate: new Date().toISOString(),
  quantity: "2",
}

test('Opens the swagger docs page 200', async() => {
  await supertest(server)
    .post('/api/v0/docs')
    .expect(200)
})

test('Creates a new order 201', async() => {
  await supertest(server)
    .post(`/api/v0/order?productId=${productId}`)
    .send(mockOrder)
    .expect(201)
    .then((res) => {
      expect(res.body).toBeDefined()
      expect(res.body.id).toBeDefined()
      expect(res.body.product_id).toBe(productId)
      expect(res.body.data).toBeDefined()
      expect(res.body.data.quantity).toBe(mockOrder.quantity)
      expect(res.body.data.purchaseDate).toBe(mockOrder.purchaseDate)
      expect(res.body.data.delivered).toBeFalsy()
      expect(res.body.data.shipped).toBeFalsy()
    })
})

test('Creates a new order no order number 400', async() => {
  await supertest(server)
    .post(`/api/v0/order?productId=${productId}`)
    .send({purchaseDate: new Date().toISOString()})
    .expect(400)
})

test('Creates a new order no purchase date 400', async() => {
  await supertest(server)
    .post(`/api/v0/order?productId=${productId}`)
    .send({quantity: "2"})
    .expect(400)
})

test('Creates a new order quantity 0 400', async() => {
  await supertest(server)
    .post(`/api/v0/order?productId=${productId}`)
    .send({
      purchaseDate: new Date().toISOString(),
      quantity: "0"})
    .expect(400)
})

test('Creates a new order quantity 1000 400', async() => {
  await supertest(server)
    .post(`/api/v0/order?productId=${productId}`)
    .send({
      purchaseDate: new Date().toISOString(),
      quantity: "1000"})
    .expect(400)
})

test('Creates a new order unknown field 400', async() => {
  await supertest(server)
    .post(`/api/v0/order?productId=${productId}`)
    .send({
      purchaseDate: new Date().toISOString(),
      quantity: "2",
      uknown: "123",
    })
    .expect(400)
})

test('Create a new order no product id 400', async() => {
  await supertest(server)
    .post(`/api/v0/order`)
    .send(mockOrder)
    .expect(400)
})

test('Create a new order bad product id 400', async() => {
  await supertest(server)
    .post(`/api/v0/order?productId=123123`)
    .send(mockOrder)
    .expect(400)
})