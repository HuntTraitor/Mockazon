import http from 'http';
import supertest from 'supertest';

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
    id: `${randomUUID()}`,
    createdAt: `${new Date().toISOString()}`,
    shippingAddress: exampleAddresses[0],
    paymentMethod: 'Credit Card',
    subtotal: 100.0,
    totalBeforeTax: 100.0,
    tax: 0.0,
    total: 100.0,
  },
  {
    id: `${randomUUID()}`,
    createdAt: `${new Date().toISOString()}`,
    shippingAddress: exampleAddresses[1],
    paymentMethod: 'Credit Card',
    subtotal: 200.0,
    totalBeforeTax: 200.0,
    tax: 0.0,
    total: 200.0,
  },
  {
    id: `${randomUUID()}`,
    createdAt: `${new Date().toISOString()}`,
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
        return HttpResponse.json([...exampleAddresses, exampleAddresses[0]], {
          status: 200,
        });
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
    `http://${process.env.MICROSERVICE_URL || 'localhost'}:3014/api/v0/shopper/orderhistory`,
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
        return HttpResponse.json([...exampleOrders, exampleOrders[0]], {
          status: 200,
        });
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

const mockShippingQuery = `{
  getShippingInfo {
    name
    addressLine1
    city
    state
    postalCode
    country
  }
}`;

const mockOrderHistoryQuery = `{
  getOrderHistory {
    createdAt
    id
    paymentMethod
    shippingAddress {
      addressLine1
      city
      country
      name
      postalCode
      state
    }
    subtotal
    total
    tax
    totalBeforeTax
  }
}`;

const mockAddOrderMutation = `mutation {
  addOrderHistory(
    order: {
      id: "${exampleOrders[0].id}",
      createdAt: "${exampleOrders[0].createdAt}",
      shippingAddress: {
        name: "${exampleOrders[0].shippingAddress.name}",
        addressLine1: "${exampleOrders[0].shippingAddress.addressLine1}", 
        city: "${exampleOrders[0].shippingAddress.city}",
        state: "${exampleOrders[0].shippingAddress.state}",
        postalCode: "${exampleOrders[0].shippingAddress.postalCode}",
        country: "${exampleOrders[0].shippingAddress.country}"
      },
      paymentMethod: "${exampleOrders[0].paymentMethod}",
      subtotal: ${exampleOrders[0].subtotal},
      totalBeforeTax: ${exampleOrders[0].totalBeforeTax},
      tax: ${exampleOrders[0].tax},
      total: ${exampleOrders[0].total}
    }
  ) {
    createdAt
    id
    paymentMethod
    shippingAddress {
      addressLine1
      city
      country
      name
      postalCode
      state
    }
    subtotal
    tax
    total
    totalBeforeTax
  }
}`;

const mockAddShippingMutation = `mutation {
  addShippingInfo(
    shippingInfo: {
      name: "${exampleAddresses[0].name}",
      addressLine1: "${exampleAddresses[0].addressLine1}",
      city: "${exampleAddresses[0].city}",
      state: "${exampleAddresses[0].state}",
      postalCode: "${exampleAddresses[0].postalCode}",
      country: "${exampleAddresses[0].country}"
    }
  ) {
    name
    addressLine1
    city
    state
    postalCode
    country
  }
}`;

test('unauthorized check', async () => {
  checkReject = true;
  const response = await supertest(server)
    .post('/api/graphql')
    .set('Authorization', 'Bearer 123')
    .send({ query: mockShippingQuery });
  expect(response.body.errors[0].message).toBe(
    "Access denied! You don't have permission for this action!"
  );
});

test('error check', async () => {
  checkError = true;
  const response = await supertest(server)
    .post('/api/graphql')
    .set('Authorization', 'Bearer 123')
    .send({ query: mockShippingQuery });
  expect(response.body.errors[0].message).toBe(
    "Access denied! You don't have permission for this action!"
  );
});

test('should get shipping info', async () => {
  checkSuccess = true;
  success = true;
  const response = await supertest(server)
    .post('/api/graphql')
    .set('Authorization', 'Bearer 123')
    .send({ query: mockShippingQuery });
  expect(response.status).toBe(200);
  expect(response.body.data.getShippingInfo).toHaveLength(3);
  expect(response.body.data.getShippingInfo).toEqual(exampleAddresses);
});

test('shipping get error', async () => {
  checkSuccess = true;
  error = true;
  const response = await supertest(server)
    .post('/api/graphql')
    .set('Authorization', 'Bearer 123')
    .send({ query: mockShippingQuery });
  expect(response.body.data.getShippingInfo).toEqual([]);
});

test('shipping get reject', async () => {
  checkSuccess = true;
  reject = true;
  const response = await supertest(server)
    .post('/api/graphql')
    .set('Authorization', 'Bearer 123')
    .send({ query: mockShippingQuery });
  expect(response.body.data.getShippingInfo).toEqual([]);
});

test('should get order history', async () => {
  checkSuccess = true;
  success = true;
  const response = await supertest(server)
    .post('/api/graphql')
    .set('Authorization', 'Bearer 123')
    .send({ query: mockOrderHistoryQuery });
  expect(response.status).toBe(200);
  expect(response.body.data.getOrderHistory).toHaveLength(3);
});

test('order get error', async () => {
  checkSuccess = true;
  error = true;
  const response = await supertest(server)
    .post('/api/graphql')
    .set('Authorization', 'Bearer 123')
    .send({ query: mockOrderHistoryQuery });
  expect(response.body.data.getOrderHistory).toEqual([]);
});

test('order get reject', async () => {
  checkSuccess = true;
  reject = true;
  const response = await supertest(server)
    .post('/api/graphql')
    .set('Authorization', 'Bearer 123')
    .send({ query: mockOrderHistoryQuery });
  expect(response.body.data.getOrderHistory).toEqual([]);
});

test('order add success', async () => {
  checkSuccess = true;
  success = true;
  const response = await supertest(server)
    .post('/api/graphql')
    .set('Authorization', 'Bearer 123')
    .send({ query: mockAddOrderMutation });
  expect(response.status).toBe(200);
  console.log(mockAddOrderMutation);
  console.log(response.body);
  expect(response.body.data.addOrderHistory).toEqual([
    ...exampleOrders,
    exampleOrders[0],
  ]);
});

test('order add error', async () => {
  checkSuccess = true;
  error = true;
  const response = await supertest(server)
    .post('/api/graphql')
    .set('Authorization', 'Bearer 123')
    .send({ query: mockAddOrderMutation });
  expect(response.body.errors).toBeDefined();
});

test('order add reject', async () => {
  checkSuccess = true;
  reject = true;
  const response = await supertest(server)
    .post('/api/graphql')
    .set('Authorization', 'Bearer 123')
    .send({ query: mockAddOrderMutation });
  expect(response.body.errors).toBeDefined();
});

test('Shipping info add success', async () => {
  checkSuccess = true;
  success = true;
  const response = await supertest(server)
    .post('/api/graphql')
    .set('Authorization', 'Bearer 123')
    .send({ query: mockAddShippingMutation });
  expect(response.status).toBe(200);
  expect(response.body.data.addShippingInfo).toEqual([
    ...exampleAddresses,
    exampleAddresses[0],
  ]);
});

test('Shipping info add error', async () => {
  checkSuccess = true;
  error = true;
  const response = await supertest(server)
    .post('/api/graphql')
    .set('Authorization', 'Bearer 123')
    .send({ query: mockAddShippingMutation });
  expect(response.body.errors).toBeDefined();
});

test('Shipping info add reject', async () => {
  checkSuccess = true;
  reject = true;
  const response = await supertest(server)
    .post('/api/graphql')
    .set('Authorization', 'Bearer 123')
    .send({ query: mockAddShippingMutation });
  expect(response.body.errors).toBeDefined();
});
