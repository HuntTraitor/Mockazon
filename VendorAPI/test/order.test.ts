import supertest from 'supertest';
import { server } from './helper';
test('Unauthorized user cannot fetch orders', async () => {
  await supertest(server).get('/v0/order/').expect(401);
});

test('Authorized user can fetch orders', async () => {
  await supertest(server)
    .get('/v0/order/')
    .set('x-api-key', `bf582726-1927-4604-8d94-7f1540a7eb37`)
    .expect(200)
    .then((res) => {
      expect(res.body.length).toBeGreaterThan(0)
    })
});
