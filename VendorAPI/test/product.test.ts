import supertest from 'supertest';
import { server } from './helper';

describe('General', () => {
  test('Unauthorized user cannot fetch product', async () => {
    await supertest(server).get('/v0/product/').expect(401);
  });
});

test('Authorized user can fetch product', async () => {
  await supertest(server)
    .get('/v0/product/')
    .set('x-api-key', `bf582726-1927-4604-8d94-7f1540a7eb37`)
    .expect(200)
});