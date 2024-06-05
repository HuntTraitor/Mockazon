import supertest from 'supertest';
import { server } from './helper';

// const orderUpdateData = {
//   quantity: '4',
//   shipped: true,
// };

// let orderID: string = '';

test('Unauthorized user cannot fetch orders', async () => {
  await supertest(server).get('/v0/order/').expect(401);
});

// test('Authorized user can fetch orders', async () => {
//   await supertest(server)
//     .get('/v0/order/')
//     .set('x-api-key', `bf582726-1927-4604-8d94-7f1540a7eb37`)
//     .expect(200)
//     .then((res) => {
//       expect(res.body.length).toBeGreaterThan(0)
//     })
// });

// test('Vendor update order', async () => {
//   console.log(orderID)
//   await supertest(server)
//     .put('/v0/order/ecddd831-d753-46ce-9c8b-ab37201b74a8')
//     .set('x-api-key', 'bf582726-1927-4604-8d94-7f1540a7eb37')
//     // .send(orderUpdateData)
//     .expect(201)
//     .then((res) => {
//       console.log(res)
//     })
// });
