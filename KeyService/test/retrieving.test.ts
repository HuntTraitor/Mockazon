import supertest from 'supertest';
import { server } from './helper';

describe('Misc', () => {
  test('Successfully opens docs', async () => {
    await supertest(server).get(`/api/v0/docs/`).expect(200);
  });

  test('Tries to open unknown route', async () => {
    await supertest(server).get(`/api/v0/unknown`).expect(404);
  });
});
