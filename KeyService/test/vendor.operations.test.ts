import supertest from 'supertest';
import { randomUUID } from 'crypto';
import { server } from './helper';
import { Key } from 'src/types';

const keys: Key[] = [];

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

  // test('Flip active status', async () => {
  //   let origBool: string = (keys[0]).key;
  //   await supertest(server)
  //     .put(`/api/v0/key/${keys[0].key}/`)
  //     .then(res => {
  //       expect(res.body).toBeDefined();
  //       expect(res.body.length).toEqual(2);
  //     });
  // });
});
