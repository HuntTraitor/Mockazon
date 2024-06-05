import supertest from 'supertest';
import { server } from './helper';
import { randomUUID } from 'crypto';

test('Successfully creates checkout session 201', async () => {
  const lineItem = {
    price_data: {
      currency: 'usd',
      unit_amount: 1000,
      product_data: {
        name: 'T-Shirt',
        images: ['https://example.com/t-shirt.png'],
        metadata: {
          productId: randomUUID(),
          vendorId: randomUUID(),
        },
      },
    },
    quantity: 3,
  };

  const sessionInput = {
    lineItems: [lineItem],
    shopperId: { shopperId: randomUUID() },
    origin: 'http://localhost:3000',
    locale: 'en',
  };

  const result = await supertest(server)
    .post(`/api/v0/stripeCheckout`)
    .send(sessionInput);

  expect(result.status).toBe(201);
  expect(result.body.id).toBeDefined();
  expect(result.body.url).toBeDefined();
});

test('Successfully creates checkout session 201', async () => {
  const lineItem = {
    price_data: {
      currency: 'usd',
      unit_amount: 1000,
      product_data: {
        name: 'T-Shirt',
        images: ['https://example.com/t-shirt.png'],
        metadata: {
          productId: randomUUID(),
          vendorId: randomUUID(),
        },
      },
    },
    quantity: 3,
  };

  const sessionInput = {
    lineItems: [lineItem],
    shopperId: { shopperId: randomUUID() },
    origin: 'http://localhost:3000',
    locale: 'es',
  };

  const result = await supertest(server)
    .post(`/api/v0/stripeCheckout`)
    .send(sessionInput);

  expect(result.status).toBe(201);
  expect(result.body.id).toBeDefined();
  expect(result.body.url).toBeDefined();
});

test('Failing to create checkout session due to missing lineItems 400', async () => {
  const result = await supertest(server)
    .post(`/api/v0/stripeCheckout`)
    .send({
      shopperId: { shopperId: randomUUID() },
      origin: 'http://localhost:3000',
      locale: 'en',
      metadata: {
        items: [{ productId: randomUUID(), vendorId: randomUUID() }],
      },
    });
  expect(result.status).toBe(400);
  expect(result.body.message).toBeDefined();
});

test('Failing to create checkout session due to invalid shopperId 400', async () => {
  const result = await supertest(server)
    .post(`/api/v0/stripeCheckout`)
    .send({
      lineItems: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: 1000,
            product_data: {
              name: 'T-Shirt',
              images: ['https://example.com/t-shirt.png'],
            },
          },
          quantity: 3,
        },
      ],
      shopperId: { shopperId: '123' },
      origin: 'http://localhost:3000',
      locale: 'en',
      metadata: {
        items: [{ productId: randomUUID(), vendorId: randomUUID() }],
      },
    });
  expect(result.status).toBe(400);
});

test('Failing to create checkout session due to invalid itemId 400', async () => {
  const result = await supertest(server)
    .post(`/api/v0/stripeCheckout`)
    .send({
      lineItems: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: 1000,
            product_data: {
              name: 'T-Shirt',
              images: ['https://example.com/t-shirt.png'],
            },
          },
          quantity: 3,
        },
      ],
      shopperId: { shopperId: randomUUID() },
      origin: 'http://localhost:3000',
      locale: 'en',
      metadata: {
        items: [{ productId: '123', vendorId: randomUUID() }],
      },
    });
  expect(result.status).toBe(400);
});

test('Failing to create checkout session due to invalid vendorId 400', async () => {
  const result = await supertest(server)
    .post(`/api/v0/stripeCheckout`)
    .send({
      lineItems: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: 1000,
            product_data: {
              name: 'T-Shirt',
              images: ['https://example.com/t-shirt.png'],
            },
          },
          quantity: 3,
        },
      ],
      shopperId: { shopperId: randomUUID() },
      origin: 'http://localhost:3000',
      locale: 'en',
      metadata: {
        items: [{ productId: randomUUID(), vendorId: '123' }],
      },
    });
  expect(result.status).toBe(400);
});
