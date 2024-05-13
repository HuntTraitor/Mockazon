import supertest from 'supertest';
import { randomUUID } from 'crypto';
import { server } from './helper';

const keys = [];

describe('Vendor Operations', () => {
  const vendorId = randomUUID();

  test('Create 2 Keys', async () => {
    await supertest(server)
      .post(`/api/v0/key/${vendorId}/request`)
      .then(res => {
        expect(res.body).toBeDefined();
        expect(res.body.key).toBeDefined();
        keys.push(res.body);
      });
    await supertest(server)
      .post(`/api/v0/key/${vendorId}/request`)
      .then(res => {
        expect(res.body).toBeDefined();
        expect(res.body.key).toBeDefined();
        keys.push(res.body);
      });
  });

  test('GET all API keys belonging to vendor', async () => {
    await supertest(server)
      .get(`/api/v0/key/${vendorId}`)
      .then(res => {
        expect(res.body).toBeDefined();
        expect(res.body.length).toEqual(2);
      });
  });
});
