import supertest from 'supertest';
import { randomUUID } from 'crypto';
import { server } from './helper';

describe('Requesting a new Key', () => {
  const vendorId = randomUUID();

  test('Successfully accepts a key 201', async () => {
    await supertest(server)
      .post(`/api/v0/key/${vendorId}/request`)
      .then(res => {
        console.log(res.body);
        expect(res.body).toBeDefined();
        expect(res.body.key).toBeDefined();
      });
  });

  test('Attempts to create a key bad vendorId', async () => {
    await supertest(server).post(`/api/v0/key/helpme/request`).expect(400);
  });
});
