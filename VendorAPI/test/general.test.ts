import supertest from 'supertest';
import { server } from './helper';

describe('General', () => {
  test('Rejects invalid URLs', async () => {
    await supertest(server).get('/api/v0/invalid').expect(404);
  });

  test('Renders Swagger UI', async () => {
    await supertest(server)
      .get('/v0/docs/')
      .expect(200)
      .then(response => {
        expect(response.text).toContain('Swagger UI');
      });
  });
});
