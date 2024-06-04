import supertest from 'supertest';
import { server } from './helper';

describe('General', () => {
  test('Unauthorized user cannot fetch product', async () => {
    await supertest(server).get('/v0/product/').expect(401);
  });
});
