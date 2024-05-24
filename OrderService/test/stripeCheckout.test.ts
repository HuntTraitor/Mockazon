import supertest from 'supertest';
import { server } from './helper';
import { randomUUID } from 'crypto';

// test('Successfully creates checkout session 201', async () => {
//   const result = await supertest(server)
//     .post(`/api/v0/stripeCheckout`)
//     .send({
//       lineItems: [
//         {
//           price_data: {
//             currency: 'usd',
//             unit_amount: 1000,
//             product_data: {
//               name: 'T-Shirt',
//               images: ['https://example.com/t-shirt.png'],
//             },
//           },
//           quantity: 3,
//         },
//       ],
//       shopperId: { shopperId: randomUUID() },
//       origin: 'http://localhost:3000',
//       locale: 'en',
//       metadata: {
//         itemIds: [randomUUID()],
//       },
//     });
//   expect(result.status).toBe(201);
//   expect(result.body.id).toBeDefined();
//   expect(result.body.url).toBeDefined();
// });

// test('Successfully creates checkout session in spanish 201', async () => {
//   const result = await supertest(server)
//     .post(`/api/v0/stripeCheckout`)
//     .send({
//       lineItems: [
//         {
//           price_data: {
//             currency: 'usd',
//             unit_amount: 1000,
//             product_data: {
//               name: 'T-Shirt',
//               images: ['https://example.com/t-shirt.png'],
//             },
//           },
//           quantity: 3,
//         },
//       ],
//       shopperId: { shopperId: randomUUID() },
//       origin: 'http://localhost:3000',
//       locale: 'es',
//       metadata: {
//         itemIds: [randomUUID()],
//       },
//     });
//   expect(result.status).toBe(201);
//   expect(result.body.id).toBeDefined();
//   expect(result.body.url).toBeDefined();
// });

// test('Failing to create checkout session due to invalid lineItems 400', async () => {
//   const result = await supertest(server)
//     .post(`/api/v0/stripeCheckout`)
//     .send({
//       lineItems: [],
//       shopperId: { shopperId: randomUUID() },
//       origin: 'http://localhost:3000',
//       locale: 'en',
//       metadata: {
//         itemIds: [randomUUID()],
//       },
//     });
//   expect(result.status).toBe(400);
//   expect(result.body.message).toBeDefined();
// });

test('Failing to create checkout session due to missing lineItems 400', async () => {
  const result = await supertest(server)
    .post(`/api/v0/stripeCheckout`)
    .send({
      shopperId: { shopperId: randomUUID() },
      origin: 'http://localhost:3000',
      locale: 'en',
      metadata: {
        itemIds: [randomUUID()],
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
        itemIds: [randomUUID()],
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
        itemIds: ['123'],
      },
    });
  expect(result.status).toBe(400);
});
