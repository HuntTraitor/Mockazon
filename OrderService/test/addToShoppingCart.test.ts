import supertest from 'supertest';
import { server } from './helper';
import { randomUUID } from 'crypto';

test('Creating a new shopping cart item gets 201', async () => {
  const result = await supertest(server)
    .post(`/api/v0/shoppingCart?vendorId=${randomUUID()}`)
    .send({
      product_id: randomUUID(),
      shopper_id: randomUUID(),
      quantity: '2',
    });
  expect(result.status).toBe(201);
});

test('Creating a new shopping cart item without vendorId gets 400', async () => {
  const result = await supertest(server).post(`/api/v0/shoppingCart`).send({
    product_id: randomUUID(),
    shopper_id: randomUUID(),
    quantity: '2',
  });
  expect(result.status).toBe(400);
});

test('Creating a new shopping cart item without productId gets 400', async () => {
  const result = await supertest(server)
    .post(`/api/v0/shoppingCart?vendorId=${randomUUID()}`)
    .send({
      shopper_id: randomUUID(),
      quantity: '2',
    });
  expect(result.status).toBe(400);
});

test('Creating a new shopping cart item without shoppoerId gets 400', async () => {
  const result = await supertest(server)
    .post(`/api/v0/shoppingCart?vendorId=${randomUUID()}`)
    .send({
      product_id: randomUUID(),
      quantity: '2',
    });
  expect(result.status).toBe(400);
});

test('Creating a new shopping cart item without quantity gets 400', async () => {
  const result = await supertest(server)
    .post(`/api/v0/shoppingCart?vendorId=${randomUUID()}`)
    .send({
      product_id: randomUUID(),
      shopper_id: randomUUID(),
    });
  expect(result.status).toBe(400);
});
