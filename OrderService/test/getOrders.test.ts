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
const accountId = '1ed8ca72-2027-4d19-ba6b-e6be75ab7d8b'
const mockOrder = {
  product_id: productId,
  account_id: accountId,
  purchaseDate: new Date().toISOString(),
  quantity: "2",
}

const postOrders = async (amount: number) => {
  for (let i = 0; i < amount; i++) {
    await supertest(server)
      .post(`/api/v0/order`)
      .send(mockOrder)
      .expect(201)
  }
}

test('Gets one order 200', async() => {
  await postOrders(1)
  await supertest(server)
    .get(`/api/v0/order?productId=${productId}`)
    .expect(200)
    .then((res) => {
      expect(res.body).toBeDefined()
      expect(res.body[0].id).toBeDefined()
      expect(res.body[0].product_id).toBe(productId)
      expect(res.body[0].data).toBeDefined()
      expect(res.body[0].data.quantity).toBe("2")
      expect(res.body[0].data.purchaseDate).toBeDefined()
      expect(res.body[0].data.delivered).toBeFalsy()
      expect(res.body[0].data.received).toBeFalsy()
    })
})

test('Gets multiple orders 200', async() => {
  await postOrders(4)
  await supertest(server)
    .get(`/api/v0/order?productId=${productId}`)
    .expect(200)
    .then((res) => {
      expect(res.body).toBeDefined()
      expect(res.body.length).toBe(4)
    })
})

test('Gets no orders 200', async() => {
  await supertest(server)
    .get(`/api/v0/order?productId=${productId}`)
    .expect(200)
    .then((res) => {
      expect(res.body).toBeDefined()
      expect(res.body.length).toBe(0)
    })
})

test('Gets all orders no product id 400', async() => {
  await supertest(server)
    .get(`/api/v0/order`)
    .expect(400)
})

test('Gets all order bad product id 400', async() => {
  await supertest(server)
    .get(`/api/v0/order?productId=123123`)
    .expect(400)
})