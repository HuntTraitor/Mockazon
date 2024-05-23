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

const getPasses = true;
let postPasses = true;

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
    `http://${process.env.MICROSERVICE_URL || 'localhost'}:3012/api/v0/stripeCheckout`,
    async () => {
      if (postPasses) {
        return HttpResponse.json(
          {
            id: '123',
            url: 'http://localhost:3000/checkout',
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

const lineItems = [
  {
    price_data: {
      currency: 'usd',
      unit_amount: 500,
      product_data: {
        name: 'T-Shirt',
        images: ['https://i.imgur.com/EHyR2nP.png'],
      },
    },
    quantity: 1,
  },
];
const shopperId = { shopperId: randomUUID() };
const origin = 'http://localhost:3000';

test('Create Stripe Checkout Session', async () => {
  postPasses = true;
  const result = await supertest(server)
    .post('/api/graphql')
    .send({
      query: `
          mutation CreateStripeCheckoutSession($lineItems: [LineItem!]!, $shopperId: ShopperId!, $origin: String!, $locale: Locale!) {
            createStripeCheckoutSession(
              lineItems: $lineItems, 
              shopperId: $shopperId, 
              origin: $origin,
              locale: $locale
            ) {
              id
              url
            }
          }
        `,
      variables: {
        lineItems,
        shopperId,
        origin,
        locale: 'en',
      },
    });
  expect(result.body.data.createStripeCheckoutSession.id).toBeDefined();
  expect(result.body.data.createStripeCheckoutSession.url).toBeDefined();
});

test('Create Stripe Checkout Session with error', async () => {
  postPasses = false;
  const result = await supertest(server)
    .post('/api/graphql')
    .send({
      query: `
          mutation CreateStripeCheckoutSession($lineItems: [LineItem!]!, $shopperId: ShopperId!, $origin: String!, $locale: Locale!) {
            createStripeCheckoutSession(
              lineItems: $lineItems, 
              shopperId: $shopperId, 
              origin: $origin,
              locale: $locale
            ) {
              id
              url
            }
          }
        `,
      variables: {
        lineItems,
        shopperId,
        origin,
        locale: 'en',
      },
    });

  expect(result.body.errors).toBeDefined();
  expect(result.body.errors[0].message).toBeDefined();
});

test('Create Stripe Checkout Session fails with invalid input', async () => {
  postPasses = false;
  const result = await supertest(server)
    .post('/api/graphql')
    .send({
      query: `
          mutation CreateStripeCheckoutSession($lineItems: [LineItem!]!, $shopperId: ShopperId!, $origin: String!, $locale: Locale!) {
            createStripeCheckoutSession(
              lineItems: $lineItems, 
              shopperId: $shopperId, 
              origin: $origin
              locale: $locale
            ) {
              id
              url
            }
          }
        `,
      variables: {},
    });

  expect(result.body.errors).toBeDefined();
  expect(result.body.errors[0].message).toBeDefined();
});
