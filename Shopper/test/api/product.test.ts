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

let noErrorInProduct = true;
let noErrorInProducts = true;

const handlers = [
  rest.get(
    `http://${process.env.MICROSERVICE_URL || 'localhost'}:3011/api/v0/product/*`,
    async () => {
      if (noErrorInProduct) {
        return HttpResponse.json(
          {
            id: '123',
            data: {
              brand: 'brand',
              name: 'name',
              rating: '5',
              price: 5,
              deliveryDate: '5',
              image: 'image',
            },
          },
          { status: 200 }
        );
      } else {
        return HttpResponse.json({ message: 'Login error' }, { status: 500 });
      }
    }
  ),
  rest.get(
    `http://${process.env.MICROSERVICE_URL || 'localhost'}:3011/api/v0/product`,
    async () => {
      if (noErrorInProducts) {
        return HttpResponse.json(
          [
            {
              id: '123',
              data: {
                brand: 'brand',
                name: 'name',
                rating: '5',
                price: 5,
                deliveryDate: '5',
                image: 'image',
              },
            },
          ],
          { status: 200 }
        );
      } else {
        return HttpResponse.json({ message: 'Login error' }, { status: 500 });
      }
    }
  ),
  rest.get(
    `http://${process.env.MICROSERVICE_URL || 'localhost'}:3011/api/v0/product/suggestions`,
    async () => {
      return HttpResponse.json(
        [
          'name1',
          'name2',
          'name3',
          'name4',
          'name5',
          'name6',
          'name7',
          'name8',
          'name9',
          'name10',
        ],
        { status: 200 }
      );
    }
  ),
];

const microServices = setupServer(...handlers);

beforeAll(async () => {
  microServices.listen({ onUnhandledRequest: 'bypass' });
  server = http.createServer(requestHandler);
  server.listen();
});

beforeEach(() => {
  microServices.resetHandlers();
});

afterAll(done => {
  microServices.close();
  server.close(done);
});

test('Gets product', async () => {
  noErrorInProduct = true;
  const result = await supertest(server)
    .post('/api/graphql')
    .send({
      query: `{getProduct(productId: "${randomUUID()}") {
                id
                data {
                  brand
                  name
                  rating
                  price
                  deliveryDate
                  image
                }
              }
            }`,
    });
  expect(result.body.data).toBeDefined();
  expect(result.body.data.getProduct.id).toBe('123');
  expect(result.body.data.getProduct.data.brand).toBe('brand');
  expect(result.body.data.getProduct.data.name).toBe('name');
  expect(result.body.data.getProduct.data.rating).toBe('5');
  expect(result.body.data.getProduct.data.price).toBe(5);
  expect(result.body.data.getProduct.data.deliveryDate).toBe('5');
  expect(result.body.data.getProduct.data.image).toBe('image');
});

test('Gets product with failure', async () => {
  noErrorInProduct = false;
  const result = await supertest(server)
    .post('/api/graphql')
    .send({
      query: `{getProduct(
      productId: "${randomUUID()}"
    ) {id, data {brand, name, rating, price, deliveryDate, image}}}`,
    });
  expect(result.body.errors[0].message).toBeDefined();
  expect(result.body.errors.data).toBeUndefined();
});

test('Gets products', async () => {
  noErrorInProducts = true;
  const result = await supertest(server)
    .post('/api/graphql')
    .send({
      query: `{getProducts {
                id
                data {
                  brand
                  name
                  rating
                  price
                  deliveryDate
                  image
                }
              }
            }`,
    });
  expect(result.body.data).toBeDefined();
  expect(result.body.data.getProducts[0].id).toBe('123');
  expect(result.body.data.getProducts[0].data.brand).toBe('brand');
  expect(result.body.data.getProducts[0].data.name).toBe('name');
  expect(result.body.data.getProducts[0].data.rating).toBe('5');
  expect(result.body.data.getProducts[0].data.price).toBe(5);
  expect(result.body.data.getProducts[0].data.deliveryDate).toBe('5');
  expect(result.body.data.getProducts[0].data.image).toBe('image');
});

test('Gets product with failure', async () => {
  noErrorInProducts = false;
  const result = await supertest(server)
    .post('/api/graphql')
    .send({
      query: `{getProducts {
                id
                data {
                  brand
                  name
                  rating
                  price
                  deliveryDate
                  image
                }
              }
            }`,
    });
  expect(result.body.errors[0].message).toBeDefined();
  expect(result.body.errors.data).toBeUndefined();
});

test('Gets products with parameters', async () => {
  noErrorInProducts = true;
  const result = await supertest(server)
    .post('/api/graphql')
    .send({
      query: `{getProducts(
        vendorId: "${randomUUID()}",
        active: true,
        page: 1,
        pageSize: 1,
        search: "search",
        orderBy: "orderBy",
        descending: true
      ) {
                id
                data {
                  brand
                  name
                  rating
                  price
                  deliveryDate
                  image
                }
              }
            }`,
    });
  expect(result.body.data).toBeDefined();
  expect(result.body.data.getProducts[0].id).toBe('123');
  expect(result.body.data.getProducts[0].data.brand).toBe('brand');
  expect(result.body.data.getProducts[0].data.name).toBe('name');
  expect(result.body.data.getProducts[0].data.rating).toBe('5');
  expect(result.body.data.getProducts[0].data.price).toBe(5);
  expect(result.body.data.getProducts[0].data.deliveryDate).toBe('5');
  expect(result.body.data.getProducts[0].data.image).toBe('image');
});

// test('Gets search suggestions', async () => {
//   const result = await supertest(server)
//     .post('/api/graphql')
//     .send({
//       query: `{getSearchSuggestions(search: "search")}`,
//     });
//   expect(result.body.data).toBeDefined();
//   expect(result.body.data.getSearchSuggestions).toEqual([
//     'name1',
//     'name2',
//     'name3',
//     'name4',
//     'name5',
//     'name6',
//     'name7',
//     'name8',
//     'name9',
//     'name10',
//   ]);
// });
