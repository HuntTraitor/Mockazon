import supertest from 'supertest';
import { server } from './helper';
import { randomUUID } from 'crypto';

test('Getting a shopping cart item gets 200', async () => {
  const result = await supertest(server).get(
    `/api/v0/shoppingCart?shopperId=${randomUUID()}`
  );
  expect(result.status).toBe(200);
});

test('Getting a shopping shopping cart without shopperId gets 404', async () => {
  const result = await supertest(server).get(`/api/v0/shoppingCart}`);
  expect(result.status).toBe(404);
});
