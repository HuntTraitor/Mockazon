// Referenced from Dr. Harrison's CSE 187 examples
import http from 'http';
import supertest from 'supertest';

import { http as rest, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

import requestHandler from './requestHandler';

let server: http.Server<
  typeof http.IncomingMessage,
  typeof http.ServerResponse
>;

let rightCreds = true;

const handlers = [
  rest.get(
    `http://${process.env.MICROSERVICE_URL || 'localhost'}:3011/api/v0/product/123`,
    async () => {
      if (rightCreds) {
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

// TODO Fix test
// test('Gets product', async () => {
//   rightCreds = true;
//   const productId = "123";
//   const result = await supertest(server)
//     .post('/api/graphql')
//     .send({
//       query: `{getProduct(
//       productId: "${productId}") {
//                 id
//                 data {
//                   brand
//                   name
//                   rating
//                   price
//                   deliveryDate
//                   image
//                 }
//               }
//             }`,
//     });
//   expect(result.body.data).toBeDefined();
//   expect(result.body.data.id).toBe('123');
//   expect(result.body.data.data.brand).toBe('brand');
//   expect(result.body.data.data.name).toBe('name');
//   expect(result.body.data.data.rating).toBe('5');
//   expect(result.body.data.data.price).toBe(5);
//   expect(result.body.data.data.deliveryDate).toBe('5');
//   expect(result.body.data.data.image).toBe('image');
// });

test('Gets product with failure', async () => {
  rightCreds = false;
  const result = await supertest(server)
    .post('/api/graphql')
    .send({
      query: `{getProduct(
      productId: "123"
    ) {id, data {brand, name, rating, price, deliveryDate, image}}}`,
    });
  expect(result.body.errors[0].message).toBeDefined();
  expect(result.body.errors.data).toBeUndefined();
});
