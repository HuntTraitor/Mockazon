import supertest from 'supertest';
import { server } from './helper';
import { randomUUID } from 'crypto';
import { validateOrder } from './helper';

test('Opens the swagger docs page 200', async () => {
  await supertest(server).post('/api/v0/docs').expect(200);
});

test('Creates a new order 201', async () => {
  await supertest(server)
    .post(`/api/v0/order?vendorId=${randomUUID()}`)
    .send({
      product_id: randomUUID(),
      shopper_id: randomUUID(),
      quantity: '2',
    })
    .expect(201)
    .then(res => {
      validateOrder(res.body);
    });
});

test('Creates a new order no vendorId 400', async () => {
  await supertest(server)
    .post(`/api/v0/order`)
    .send({
      product_id: randomUUID(),
      shopper_id: randomUUID(),
      quantity: '2',
    })
    .expect(400);
});

test('Creates a new order bad vendorId 400', async () => {
  await supertest(server)
    .post(`/api/v0/order?vendorId=1234`)
    .send({
      product_id: randomUUID(),
      shopper_id: randomUUID(),
      quantity: '2',
    })
    .expect(400);
});

test('Creates a new order extra param in body 400', async () => {
  await supertest(server)
    .post(`/api/v0/order?vendorId=${randomUUID()}`)
    .send({
      product_id: randomUUID(),
      shopper_id: randomUUID(),
      quantity: '2',
      badParam: 'test',
    })
    .expect(400);
});

test('Creates a new order missing param in body 400', async () => {
  await supertest(server)
    .post(`/api/v0/order?vendorId=${randomUUID()}`)
    .send({
      product_id: randomUUID(),
      shopper_id: randomUUID(),
    })
    .expect(400);
});

test('Creates a new order bad productId 400', async () => {
  await supertest(server)
    .post(`/api/v0/order?vendorId=${randomUUID()}`)
    .send({
      product_id: '1234',
      shopper_id: randomUUID(),
      quantity: '2',
    })
    .expect(400);
});

test('Creates a new order bad shopperId 400', async () => {
  await supertest(server)
    .post(`/api/v0/order?vendorId=${randomUUID()}`)
    .send({
      product_id: randomUUID(),
      shopper_id: '1234',
      quantity: '2',
    })
    .expect(400);
});

test('Creates a new order quantity 0 400', async () => {
  await supertest(server)
    .post(`/api/v0/order?vendorId=${randomUUID()}`)
    .send({
      product_id: randomUUID(),
      shopper_id: randomUUID(),
      quantity: '0',
    })
    .expect(400);
});

test('Creates a new order quantity 1000 400', async () => {
  await supertest(server)
    .post(`/api/v0/order?vendorId=${randomUUID()}`)
    .send({
      product_id: randomUUID(),
      shopper_id: randomUUID(),
      quantity: '1000',
    })
    .expect(400);
});
