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

let getOrderError = false;
let getAllOrdersError = false;
const validUUID = randomUUID();
let checkSuccess = true;
let checkReject = false;
let checkError = false;
let getProductsError = false;

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
    `http://${process.env.MICROSERVICE_URL || 'localhost'}:3011/api/v0/product/:id`,
    async () => {
      if (getProductsError) {
        return HttpResponse.json(
          { message: 'Get products error' },
          { status: 500 }
        );
      }
      return HttpResponse.json(
        {
          id: '123',
          vendor_id: randomUUID(),
          active: true,
          created: new Date(),
          posted: new Date(),
          data: {
            name: 'name',
            brand: 'brand',
            image: 'image',
            price: 5,
            rating: '5',
            description: 'description',
            deliveryDate: '5',
          },
        },
        { status: 200 }
      );
    }
  ),
  rest.get(
    `http://${process.env.MICROSERVICE_URL || 'localhost'}:3012/api/v0/order/shopperOrder/${validUUID}`,
    async () => {
      if (getOrderError) {
        return HttpResponse.json(
          { message: 'Get order error' },
          { status: 500 }
        );
      }
      return HttpResponse.json(
        {
          id: validUUID,
          createdAt: new Date(),
          shippingAddress: {
            name: 'name',
            addressLine1: 'address',
            city: 'city',
            state: 'state',
            postalCode: 'postalCode',
            country: 'country',
          },
          paymentMethod: '5',
          paymentDigits: '5',
          paymentBrand: '5',
          subtotal: 2,
          tax: 3,
          total: 5,
          shipped: true,
          delivered: true,
          deliveryTime: new Date(),
          products: [
            {
              id: validUUID,
              vendor_id: validUUID,
              quantity: 5,
              data: {
                brand: 'abc',
                name: 'name',
                rating: '5',
                price: 5,
                deliveryDate: '5',
                image: 'image',
                description: 'desc',
              },
            },
          ],
        },
        { status: 200 }
      );
    }
  ),
  rest.get(
    `http://${process.env.MICROSERVICE_URL || 'localhost'}:3012/api/v0/order/shopperOrder`,
    async () => {
      if (getAllOrdersError) {
        return HttpResponse.json(
          { message: 'Get order error' },
          { status: 500 }
        );
      }
      return HttpResponse.json(
        [
          {
            id: validUUID,
            createdAt: new Date(),
            shippingAddress: {
              name: 'name',
              addressLine1: 'address',
              city: 'city',
              state: 'state',
              postalCode: 'postalCode',
              country: 'country',
            },
            paymentMethod: '5',
            paymentDigits: '5',
            paymentBrand: '5',
            subtotal: 2,
            tax: 3,
            total: 5,
            shipped: true,
            delivered: true,
            deliveryTime: new Date(),
            products: [
              {
                id: validUUID,
                vendor_id: validUUID,
                quantity: 5,
                data: {
                  brand: 'abc',
                  name: 'name',
                  rating: '5',
                  price: 5,
                  deliveryDate: '5',
                  image: 'image',
                  description: 'desc',
                },
              },
            ],
          },
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
  getOrderError = false;
  getProductsError = false;
  checkSuccess = true;
  checkReject = false;
  checkError = false;
});

afterAll(done => {
  microServices.close();
  server.close(done);
});

test('Get order', async () => {
  const result = await supertest(server)
    .post('/api/graphql')
    .send({
      query: `
      { 
        getOrder(id: "${validUUID}") { 
          tax 
          total 
          shipped 
          subtotal 
          createdAt 
          delivered 
          deliveryTime 
          paymentDigits 
          paymentMethod 
          paymentBrand 
          shippingAddress{ 
            city 
            name 
            state 
            country 
            postalCode 
            addressLine1 
          } 
        } 
      }`,
    })
    .set('Authorization', 'Bearer 123');
  expect(result.body.data).toBeDefined();
  expect(result.body.data).not.toBeNull();
  expect(result.body.data.getOrder).toBeDefined();
  expect(result.body.data.getOrder).not.toBeNull();
  expect(result.body.data.getOrder.tax).toEqual(3);
  expect(result.body.data.getOrder.total).toEqual(5);
  expect(result.body.data.getOrder.shipped).toBeTruthy();
  expect(result.body.data.getOrder.subtotal).toEqual(2);
  expect(result.body.data.getOrder.createdAt).toBeDefined();
  expect(result.body.data.getOrder.delivered).toBeTruthy();
  expect(result.body.data.getOrder.deliveryTime).toBeDefined();
  expect(result.body.data.getOrder.paymentDigits).toEqual('5');
  expect(result.body.data.getOrder.paymentMethod).toEqual('5');
  expect(result.body.data.getOrder.paymentBrand).toEqual('5');
  expect(result.body.data.getOrder.shippingAddress).toBeDefined();
  expect(result.body.data.getOrder.shippingAddress).not.toBeNull();
  expect(result.body.data.getOrder.shippingAddress.city).toEqual('city');
  expect(result.body.data.getOrder.shippingAddress.name).toEqual('name');
  expect(result.body.data.getOrder.shippingAddress.state).toEqual('state');
  expect(result.body.data.getOrder.shippingAddress.country).toEqual('country');
  expect(result.body.data.getOrder.shippingAddress.postalCode).toEqual(
    'postalCode'
  );
  expect(result.body.data.getOrder.shippingAddress.addressLine1).toEqual(
    'address'
  );
});

test('Get order error', async () => {
  getOrderError = true;
  const result = await supertest(server)
    .post('/api/graphql')
    .send({
      query: `
      { 
        getOrder(id: "${validUUID}") { 
          tax 
          total 
          shipped 
          subtotal 
          createdAt 
          delivered 
          deliveryTime 
          paymentDigits 
          paymentMethod 
          paymentBrand 
          shippingAddress{ 
            city 
            name 
            state 
            country 
            postalCode 
            addressLine1 
          } 
        } 
      }`,
    })
    .set('Authorization', 'Bearer 123');
  expect(result.body.data).toBeNull();
  expect(result.body.errors[0].message).toEqual('Internal Server Error');
});

test('Get product error', async () => {
  getProductsError = true;
  const result = await supertest(server)
    .post('/api/graphql')
    .send({
      query: `
      { 
        getOrder(id: "${validUUID}") { 
          tax 
          total 
          shipped 
          subtotal 
          createdAt 
          delivered 
          deliveryTime 
          paymentDigits 
          paymentMethod 
          paymentBrand 
          shippingAddress{ 
            city 
            name 
            state 
            country 
            postalCode 
            addressLine1 
          } 
        } 
      }`,
    })
    .set('Authorization', 'Bearer 123');
  expect(result.body.data).toBeNull();
  expect(result.body.errors[0].message).toEqual('Internal Server Error');
});

test('Get orders', async () => {
  const result = await supertest(server)
    .post('/api/graphql')
    .send({
      query: `
      { 
        getAllOrders { 
          tax 
          total 
          shipped 
          subtotal 
          createdAt 
          delivered 
          deliveryTime 
          paymentDigits 
          paymentMethod 
          paymentBrand 
          shippingAddress{ 
            city 
            name 
            state 
            country 
            postalCode 
            addressLine1 
          } 
        } 
      }`,
    })
    .set('Authorization', 'Bearer 123');
  expect(result.body.data).toBeDefined();
  expect(result.body.data).not.toBeNull();
  expect(result.body.data.getAllOrders[0]).toBeDefined();
  expect(result.body.data.getAllOrders[0]).not.toBeNull();
  expect(result.body.data.getAllOrders[0].tax).toEqual(3);
  expect(result.body.data.getAllOrders[0].total).toEqual(5);
  expect(result.body.data.getAllOrders[0].shipped).toBeTruthy();
  expect(result.body.data.getAllOrders[0].subtotal).toEqual(2);
  expect(result.body.data.getAllOrders[0].createdAt).toBeDefined();
  expect(result.body.data.getAllOrders[0].delivered).toBeTruthy();
  expect(result.body.data.getAllOrders[0].deliveryTime).toBeDefined();
  expect(result.body.data.getAllOrders[0].paymentDigits).toEqual('5');
  expect(result.body.data.getAllOrders[0].paymentMethod).toEqual('5');
  expect(result.body.data.getAllOrders[0].paymentBrand).toEqual('5');
  expect(result.body.data.getAllOrders[0].shippingAddress).toBeDefined();
  expect(result.body.data.getAllOrders[0].shippingAddress).not.toBeNull();
  expect(result.body.data.getAllOrders[0].shippingAddress.city).toEqual('city');
  expect(result.body.data.getAllOrders[0].shippingAddress.name).toEqual('name');
  expect(result.body.data.getAllOrders[0].shippingAddress.state).toEqual(
    'state'
  );
  expect(result.body.data.getAllOrders[0].shippingAddress.country).toEqual(
    'country'
  );
  expect(result.body.data.getAllOrders[0].shippingAddress.postalCode).toEqual(
    'postalCode'
  );
  expect(result.body.data.getAllOrders[0].shippingAddress.addressLine1).toEqual(
    'address'
  );
});

test('Get all orders error', async () => {
  getAllOrdersError = true;
  const result = await supertest(server)
    .post('/api/graphql')
    .send({
      query: `
      { 
        getAllOrders { 
          tax 
          total 
          shipped 
          subtotal 
          createdAt 
          delivered 
          deliveryTime 
          paymentDigits 
          paymentMethod 
          paymentBrand 
          shippingAddress{ 
            city 
            name 
            state 
            country 
            postalCode 
            addressLine1 
          } 
        } 
      }`,
    })
    .set('Authorization', 'Bearer 123');
  expect(result.body.data).toBeNull();
  expect(result.body.errors[0].message).toEqual('Internal Server Error');
});
