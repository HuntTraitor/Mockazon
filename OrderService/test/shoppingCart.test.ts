import supertest from 'supertest';
import { server } from './helper';
import { randomUUID } from 'crypto';

describe('Add to Shopping Cart', () => {
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

  test('Creating a new shopping cart item with existing item adds quantity', async () => {
    const shopperId = randomUUID();
    const productId = randomUUID();

    await supertest(server)
      .post(`/api/v0/shoppingCart?vendorId=${randomUUID()}`)
      .send({
        product_id: productId,
        shopper_id: shopperId,
        quantity: '2',
      });

    const result = await supertest(server)
      .post(`/api/v0/shoppingCart?vendorId=${randomUUID()}`)
      .send({
        product_id: productId,
        shopper_id: shopperId,
        quantity: '2',
      });
    expect(result.status).toBe(201);
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
});

describe('Update Shopping Cart', () => {
  test('Updating shopping cart gets 201', async () => {
    const shopperId = randomUUID();
    const productId = randomUUID();

    await supertest(server)
      .post(`/api/v0/shoppingCart?vendorId=${randomUUID()}`)
      .send({
        product_id: productId,
        shopper_id: shopperId,
        quantity: '2',
      });

    const result = await supertest(server)
      .put(`/api/v0/shoppingCart`)
      .send({
        product_id: productId,
        shopper_id: shopperId,
        quantity: '3',
      });
    expect(result.status).toBe(201);
  });

  test('Updating shopping cart on non-existing item gets 404', async () => {
    const shopperId = randomUUID();
    const productId = randomUUID();

    const result = await supertest(server)
      .put(`/api/v0/shoppingCart`)
      .send({
        product_id: productId,
        shopper_id: shopperId,
        quantity: '3',
      });
    expect(result.status).toBe(404);
  });
});

describe('Remove from Shopping Cart', () => {
  test('Removing a shopping cart item gets 201', async () => {
    const shopperId = randomUUID();
    const productId = randomUUID();

    await supertest(server)
      .post(`/api/v0/shoppingCart?vendorId=${randomUUID()}`)
      .send({
        product_id: productId,
        shopper_id: shopperId,
        quantity: '2',
      });

    const result = await supertest(server)
      .delete(`/api/v0/shoppingCart`)
      .send({
        product_id: productId,
        shopper_id: shopperId,
      });
    expect(result.status).toBe(201);
  });

  test('Removing a shopping cart item on non-existing item gets 404', async () => {
    const shopperId = randomUUID();
    const productId = randomUUID();

    const result = await supertest(server)
      .delete(`/api/v0/shoppingCart`)
      .send({
        product_id: productId,
        shopper_id: shopperId,
      });
    expect(result.status).toBe(404);
  });
});