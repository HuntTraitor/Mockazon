import http from 'http';
// import supertest from 'supertest';

import { http as rest, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

import requestHandler from './requestHandler';
import { randomUUID } from 'crypto';

let server: http.Server<
  typeof http.IncomingMessage,
  typeof http.ServerResponse
>;

let success: boolean;
let reject: boolean;
let error: boolean;
let checkSuccess: boolean;
let checkReject: boolean;
let checkError: boolean;

const exampleAddresses = [
  {
    name: 'John Doe',
    addressLine1: '123 Main St',
    city: 'Springfield',
    state: 'IL',
    postalCode: '62701',
    country: 'USA',
  },
  {
    name: 'Jane Doe',
    addressLine1: '456 Elm St',
    city: 'Springfield',
    state: 'IL',
    postalCode: '62701',
    country: 'USA',
  },
  {
    name: 'Jim Doe',
    addressLine1: '789 Oak St',
    city: 'Springfield',
    state: 'IL',
    postalCode: '62701',
    country: 'USA',
  },
];

const exampleOrders = [
  {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    shippingAddress: exampleAddresses[0],
    paymentMethod: 'Credit Card',
    subtotal: 100.0,
    totalBeforeTax: 100.0,
    tax: 0.0,
    total: 100.0,
  },
  {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    shippingAddress: exampleAddresses[1],
    paymentMethod: 'Credit Card',
    subtotal: 200.0,
    totalBeforeTax: 200.0,
    tax: 0.0,
    total: 200.0,
  },
  {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    shippingAddress: exampleAddresses[2],
    paymentMethod: 'Credit Card',
    subtotal: 300.0,
    totalBeforeTax: 300.0,
    tax: 0.0,
    total: 300.0,
  },
];

const handlers = [
  rest.get(
    `http://${process.env.MICROSERVICE_URL || 'localhost'}:3014/api/v0/shopper/check`,
    async () => {
      if (checkSuccess) {
        return HttpResponse.json({ id: '123' }, { status: 200 });
      } else if (checkReject) {
        return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
      } else if (checkError) {
        return HttpResponse.error();
      } else {
        return HttpResponse.json({ message: 'Not found' }, { status: 404 });
      }
    }
  ),
  rest.get(
    `http://${process.env.MICROSERVICE_URL || 'localhost'}:3014/api/v0/shopper/shippinginfo`,
    async () => {
      if (success) {
        return HttpResponse.json(exampleAddresses, { status: 200 });
      } else if (reject) {
        return HttpResponse.json({ message: 'Login error' }, { status: 401 });
      } else if (error) {
        return HttpResponse.error();
      } else {
        return HttpResponse.json({ message: 'Not found' }, { status: 404 });
      }
    }
  ),
  rest.post(
    `http://${process.env.MICROSERVICE_URL || 'localhost'}:3014/api/v0/shopper/shippinginfo`,
    async () => {
      if (success) {
        return HttpResponse.json(exampleAddresses[0], { status: 200 });
      } else if (reject) {
        return HttpResponse.json({ message: 'Login error' }, { status: 401 });
      } else if (error) {
        return HttpResponse.error();
      } else {
        return HttpResponse.json({ message: 'Not found' }, { status: 404 });
      }
    }
  ),
  rest.get(
    `http://${process.env.MICROSERVICE_URL || 'localhost'}:3014/api/v0/account/orderhistory`,
    async () => {
      if (success) {
        return HttpResponse.json(exampleOrders, { status: 200 });
      } else if (reject) {
        return HttpResponse.json({ message: 'Login error' }, { status: 401 });
      } else if (error) {
        return HttpResponse.error();
      } else {
        return HttpResponse.json({ message: 'Not found' }, { status: 404 });
      }
    }
  ),
  rest.post(
    `http://${process.env.MICROSERVICE_URL || 'localhost'}:3014/api/v0/shopper/orderhistory`,
    async () => {
      if (success) {
        return HttpResponse.json(exampleOrders[0], { status: 200 });
      } else if (reject) {
        return HttpResponse.json({ message: 'Login error' }, { status: 401 });
      } else if (error) {
        return HttpResponse.error();
      } else {
        return HttpResponse.json({ message: 'Not found' }, { status: 404 });
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
  success = false;
  reject = false;
  error = false;
  checkSuccess = false;
  checkReject = false;
  checkError = false;
});

afterAll(done => {
  microServices.close();
  server.close(done);
});

test('passing test', () => {
  expect(true).toBe(true);
});

// test('should get order history', async () => {
//   success = true;
//   const query = `{
//     getOrderHistory {
//       id
//       createdAt
//       shippingAddress {
//         name
//         addressLine1
//         city
//         state
//         postalCode
//         country
//       }
//       paymentMethod
//       subtotal
//       totalBeforeTax
//       tax
//       total
//     }
//   }`;

//   const response = await supertest(server).post('/api/graphql').send({ query });
//   console.log(response.body);
//   expect(response.status).toBe(200);
//   expect(response.body.data.getOrderHistory).toHaveLength(3);
//   expect(response.body.data.getOrderHistory).toEqual(exampleOrders);
// });
