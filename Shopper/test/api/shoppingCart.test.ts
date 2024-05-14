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
    `http://${process.env.MICROSERVICE_URL || 'localhost'}:3012/api/v0/shoppingCart`,
    async () => {
      if (rightCreds) {
        return HttpResponse.json(
          {
            id: '123',
            product_id: '123',
            shopper_id: '123',
            vendor_id: '123',
            data: { quantity: '5' },
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

// TODO fix test
// test('Gets shopping cart', async () => {
//   rightCreds = true;
//   const result = await supertest(server)
//     .post('/api/graphql')
//     .send({
//       query: `{getShoppingCart(
//         shopperId: "123"
//       ) {
//                 id
//                 product_id
//                 shopper_id
//                 vendor_id
//                 data {
//                   quantity
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

test('Gets shopping cart with failure', async () => {
  rightCreds = false;
  const result = await supertest(server)
    .post('/api/graphql')
    .send({
      query: `{getShoppingCart(
        shopperId: "123"
      ) {
                id
                product_id
                shopper_id
                vendor_id
                data {
                  quantity
                }
              }
            }`,
    });
  expect(result.body.errors[0].message).toBeDefined();
  expect(result.body.errors.data).toBeUndefined();
});
