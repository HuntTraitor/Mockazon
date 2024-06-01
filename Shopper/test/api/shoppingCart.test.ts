// Referenced from Dr. Harrison's CSE 187 examples
import http from 'http';
import supertest from 'supertest';

import { http as rest, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

import requestHandler from './requestHandler';
import { randomUUID } from 'node:crypto';

let server: http.Server<
  typeof http.IncomingMessage,
  typeof http.ServerResponse
>;

let getPasses = true;
let postPasses = true;
let updateShoppingCartSuccess = true;
let removeFromShoppingCartSuccess = true;

const handlers = [
  rest.get(
    `http://${process.env.MICROSERVICE_URL || 'localhost'}:3012/api/v0/shoppingCart`,
    async () => {
      if (getPasses) {
        return HttpResponse.json(
          [
            {
              id: '123',
              product_id: '123',
              shopper_id: '123',
              vendor_id: '123',
              data: { quantity: '5' },
            },
          ],
          { status: 200 }
        );
      } else {
        return HttpResponse.json({ message: 'Login error' }, { status: 500 });
      }
    }
  ),
  rest.post(
    `http://${process.env.MICROSERVICE_URL || 'localhost'}:3012/api/v0/shoppingCart`,
    async () => {
      if (postPasses) {
        return HttpResponse.json(
          {
            id: '123',
            product_id: '123',
            shopper_id: '123',
            data: { quantity: '5' },
          },
          { status: 200 }
        );
      } else {
        return HttpResponse.json({ message: 'Login error' }, { status: 500 });
      }
    }
  ),
  rest.get(
    `http://${process.env.MICROSERVICE_URL || 'localhost'}:3014/api/v0/shopper/check`,
    async () => {
      return HttpResponse.json({ accessToken: '12345' }, { status: 200 });
    }
  ),
  rest.put(
    `http://${process.env.MICROSERVICE_URL || 'localhost'}:3012/api/v0/shoppingCart`,
    async () => {
      if (updateShoppingCartSuccess) {
        return HttpResponse.json(
          {
            id: '123',
            product_id: '123',
            shopper_id: '123',
            data: { quantity: '5' },
          },
          { status: 200 }
        );
      } else {
        return HttpResponse.json(
          { message: 'Update shopping cart error' },
          { status: 500 }
        );
      }
    }
  ),
  rest.delete(
    `http://${process.env.MICROSERVICE_URL || 'localhost'}:3012/api/v0/shoppingCart`,
    async () => {
      if (removeFromShoppingCartSuccess) {
        return HttpResponse.json(
          {
            product_id: '123',
          },
          { status: 200 }
        );
      } else {
        return HttpResponse.json(
          { message: 'Remove from shopping cart error' },
          { status: 500 }
        );
      }
    }
  ),
];

const microServices = setupServer(...handlers);

beforeAll(async () => {
  microServices.listen({ onUnhandledRequest: 'bypass' });
  server = http.createServer(requestHandler);
  server.listen();
});

afterEach(() => {
  microServices.resetHandlers();
});

afterAll(done => {
  microServices.close();
  server.close(done);
});

test('Gets shopping cart success', async () => {
  getPasses = true;
  const result = await supertest(server)
    .post('/api/graphql')
    .set('Authorization', 'Bearer ' + 123)
    .send({
      query: `{getShoppingCart {
                id
                product_id
                shopper_id
                data {
                  quantity
                }
              }
            }`,
    });
  expect(result.body.data).toBeDefined();
  expect(result.body.data.getShoppingCart[0].id).toBe('123');
  expect(result.body.data.getShoppingCart[0].product_id).toBe('123');
  expect(result.body.data.getShoppingCart[0].shopper_id).toBe('123');
  expect(result.body.data.getShoppingCart[0].data.quantity).toBe('5');
});

test('Gets shopping cart with failure', async () => {
  getPasses = false;
  const result = await supertest(server)
    .post('/api/graphql')
    .set('Authorization', 'Bearer ' + 123)
    .send({
      query: `{getShoppingCart {
                id
                product_id
                shopper_id
                data {
                  quantity
                }
              }
            }`,
    });
  expect(result.body.errors[0].message).toBeDefined();
  expect(result.body.errors.data).toBeUndefined();
});

test('Add item to shopping cart', async () => {
  postPasses = true;
  const result = await supertest(server)
    .post('/api/graphql')
    .set('Authorization', 'Bearer ' + 123)
    .send({
      query: `mutation { addToShoppingCart(
      productId: "${randomUUID()}",
      quantity: "3")
    { id, product_id, shopper_id, data { quantity } }}`,
    });

  expect(result.body.data).toBeDefined();
  expect(result.body.data.addToShoppingCart.id).toBe('123');
  expect(result.body.data.addToShoppingCart.product_id).toBe('123');
  expect(result.body.data.addToShoppingCart.shopper_id).toBe('123');
  expect(result.body.data.addToShoppingCart.data.quantity).toBe('5');
});

test('Add item to shopping cart with failure', async () => {
  postPasses = false;
  const result = await supertest(server)
    .post('/api/graphql')
    .set('Authorization', 'Bearer ' + 123)
    .send({
      query: `mutation { addToShoppingCart(
      productId: "${randomUUID()}",
      quantity: "3")
    { id, product_id, shopper_id, data { quantity } }}`,
    });

  expect(result.body.errors[0].message).toBeDefined();
  expect(result.body.errors.data).toBeUndefined();
});

test('Update shopping cart success', async () => {
  updateShoppingCartSuccess = true;
  const result = await supertest(server)
    .post('/api/graphql')
    .set('Authorization', 'Bearer ' + 123)
    .send({
      query: `mutation { updateShoppingCart(
      productId: "${randomUUID()}",
      quantity: "3")
    { id, product_id, shopper_id, data { quantity } }}`,
    });

  expect(result.body.data).toBeDefined();
  expect(result.body.data.updateShoppingCart.id).toBe('123');
  expect(result.body.data.updateShoppingCart.product_id).toBe('123');
  expect(result.body.data.updateShoppingCart.shopper_id).toBe('123');
  expect(result.body.data.updateShoppingCart.data.quantity).toBe('5');
});

test('Update shopping cart failure', async () => {
  updateShoppingCartSuccess = false;
  const result = await supertest(server)
    .post('/api/graphql')
    .set('Authorization', 'Bearer ' + 123)
    .send({
      query: `mutation { updateShoppingCart(
      productId: "${randomUUID()}",
      quantity: "3")
    { id, product_id, shopper_id, data { quantity } }}`,
    });

  expect(result.body.data).toBeNull();
  expect(result.body.errors[0].message).toBe('Internal Server Error');
});

test('Delete shopping cart success', async () => {
  removeFromShoppingCartSuccess = true;
  const result = await supertest(server)
    .post('/api/graphql')
    .set('Authorization', 'Bearer ' + 123)
    .send({
      query: `mutation { removeFromShoppingCart(
      productId: "${randomUUID()}")
    { product_id }}`,
    });

  expect(result.body.data).toBeDefined();
  expect(result.body.data.removeFromShoppingCart.product_id).toBe('123');
});

test('Delete shopping cart failure', async () => {
  removeFromShoppingCartSuccess = false;
  const result = await supertest(server)
    .post('/api/graphql')
    .set('Authorization', 'Bearer ' + 123)
    .send({
      query: `mutation { removeFromShoppingCart(
      productId: "${randomUUID()}")
    { product_id }}`,
    });

  expect(result.body.data).toBeNull();
  expect(result.body.errors[0].message).toBe('Internal Server Error');
});
