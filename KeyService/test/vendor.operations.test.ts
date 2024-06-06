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
        keys.push(res.body.key);
      });
    await supertest(server)
      .post(`/api/v0/key/${vendorId}/request`)
      .then(res => {
        expect(res.body).toBeDefined();
        expect(res.body.key).toBeDefined();
        keys.push(res.body.key);
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

  test('Validate the api key with a valid vendorId', async() => {
    await supertest(server)
      .get(`/api/v0/key/validate?apiKey=${keys[0]}`)
      .expect(200)
      .then(res => {
        expect(res.body.vendor_id).toBe(vendorId);
      })
  })

  test('Validate api key with an unknown key', async() => {
    await supertest(server)
      .get(`/api/v0/key/validate?apiKey=${randomUUID()}`)
      .expect(401)
  })

  test('Validate an api key that is not inputted', async() => {
    await supertest(server)
      .get(`/api/v0/key/validate`)
      .expect(400)
  })

  test('Deactive the current api key (success)', async() => {
    await supertest(server)
      .put(`/api/v0/key/${keys[0]}/active`)
      .expect(200)
      .then(res => {
        expect(res.body).toBeDefined()
        expect(res.body.active).toBe(false)
        expect(res.body.key).toBe(keys[0])
        expect(res.body.vendor_id).toBe(vendorId)
      })
  })

  test('Flip the current api key (failure)', async() => {
    await supertest(server)
      .put(`/api/v0/key/${randomUUID()}/active`)
      .expect(409)
  })

  test('Reactivate the current api key (success)', async() => {
    await supertest(server)
      .put(`/api/v0/key/${keys[0]}/active`)
      .expect(200)
      .then(res => {
        expect(res.body).toBeDefined()
        expect(res.body.active).toBe(true)
        expect(res.body.key).toBe(keys[0])
        expect(res.body.vendor_id).toBe(vendorId)
      })
  })
});
