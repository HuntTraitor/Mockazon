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

const productId = '3f2687d0-d115-421f-ae23-ac572005a791';
const accountId = '1ed8ca72-2027-4d19-ba6b-e6be75ab7d8b';
const mockOrder = {
  product_id: productId,
  account_id: accountId,
  purchaseDate: new Date().toISOString(),
  quantity: '2',
};

const postOrder = async (): Promise<string | undefined> => {
  let orderId;
  await supertest(server)
    .post(`/api/v0/order`)
    .send(mockOrder)
    .expect(201)
    .then(res => {
      orderId = res.body.id;
    });
  return orderId;
};

test('Successfully updates quantity an order 201', async () => {
  const orderId = await postOrder();
  await supertest(server)
    .put(`/api/v0/order/${orderId}?quantity=3`)
    .expect(201)
    .then(res => {
      expect(res.body).toBeDefined();
      expect(res.body.id).toBeDefined();
      expect(res.body.product_id).toBe(productId);
      expect(res.body.data).toBeDefined();
      expect(res.body.data.quantity).toBe('3');
      expect(res.body.data.purchaseDate).toBe(mockOrder.purchaseDate);
    });
});

test('Succssfuly updates partial quantity and shipped on order 201', async () => {
  const orderId = await postOrder();
  await supertest(server)
    .put(`/api/v0/order/${orderId}?quantity=4&shipped=true`)
    .expect(201)
    .then(res => {
      expect(res.body.data.quantity).toBe('4');
      expect(res.body.data.delivered).toBeFalsy();
      expect(res.body.data.shipped).toBeTruthy();
    });
});

test('Successfully updates everything on order 201', async () => {
  const orderId = await postOrder();
  await supertest(server)
    .put(`/api/v0/order/${orderId}?quantity=4&shipped=true&delivered=true`)
    .expect(201)
    .then(res => {
      expect(res.body.data.quantity).toBe('4');
      expect(res.body.data.delivered).toBeTruthy();
      expect(res.body.data.shipped).toBeTruthy();
    });
});

test('No query parameters returns no updates 201', async () => {
  const orderId = await postOrder();
  await supertest(server)
    .put(`/api/v0/order/${orderId}`)
    .expect(201)
    .then(res => {
      expect(res.body).toBeDefined();
      expect(res.body.id).toBeDefined();
      expect(res.body.product_id).toBe(productId);
      expect(res.body.data).toBeDefined();
      expect(res.body.data.quantity).toBe('2');
      expect(res.body.data.purchaseDate).toBe(mockOrder.purchaseDate);
    });
});

test('Updates with an unknown query parameter', async () => {
  const orderId = await postOrder();
  await supertest(server)
    .put(`/api/v0/order/${orderId}?test=good`)
    .expect(201)
    .then(res => {
      expect(res.body).toBeDefined();
      expect(res.body.id).toBeDefined();
      expect(res.body.product_id).toBe(productId);
      expect(res.body.data).toBeDefined();
      expect(res.body.data.quantity).toBe('2');
      expect(res.body.data.purchaseDate).toBe(mockOrder.purchaseDate);
    });
});

test('Updates unknown Order ID 404', async () => {
  const orderId = crypto.randomUUID();
  await supertest(server)
    .put(`/api/v0/order/${orderId}?quantity=4&shipped=true&delivered=true`)
    .expect(404);
});

test('Updates bad Order ID 400', async () => {
  await supertest(server)
    .put(`/api/v0/order/123?quantity=4&shipped=true&delivered=true`)
    .expect(400);
});

test('Updates quantity to bad value 400', async () => {
  const orderId = await postOrder();
  await supertest(server)
    .put(`/api/v0/order/${orderId}?quantity=hello`)
    .expect(400);
});

test('Updates quantity to "0" 400', async () => {
  const orderId = await postOrder();
  await supertest(server)
    .put(`/api/v0/order/${orderId}?quantity=0`)
    .expect(400);
});

test('Updates quantity to "1000" 400', async () => {
  const orderId = await postOrder();
  await supertest(server)
    .put(`/api/v0/order/${orderId}?quantity=1000`)
    .expect(400);
});

test('Updates delivered to bad value 400', async () => {
  const orderId = await postOrder();
  await supertest(server)
    .put(`/api/v0/order/${orderId}?delivered=hello`)
    .expect(400);
});

test('Updates shipped to bad value 400', async () => {
  const orderId = await postOrder();
  await supertest(server)
    .put(`/api/v0/order/${orderId}?shipped=hello`)
    .expect(400);
});
