import supertest from 'supertest';
import { server } from './helper';
import { NewOrder } from '../src/order';
import { randomUUID } from 'crypto';
import { validateOrder, validateNewOrder } from './helper';

const postOrder = async (): Promise<string | undefined> => {
  let orderId;
  const newOrder: NewOrder = {
    product_id: randomUUID(),
    shopper_id: randomUUID(),
    quantity: '2',
  };
  validateNewOrder(newOrder);
  await supertest(server)
    .post(`/api/v0/order`)
    .send(newOrder)
    .query({ vendorId: randomUUID() })
    .expect(201)
    .then(res => {
      validateOrder(res.body);
      orderId = res.body.id;
    });
  return orderId;
};

test('Gets successful order 200', async () => {
  const orderId = await postOrder();
  await supertest(server)
    .get(`/api/v0/order/${orderId}`)
    .expect(200)
    .then(res => {
      validateOrder(res.body);
    });
});

test('Gets order not found 404', async () => {
  const orderId = crypto.randomUUID();
  await supertest(server).get(`/api/v0/order/${orderId}`).expect(404);
});

test('Gets order bad orderId 400', async () => {
  await supertest(server).get(`/api/v0/order/badid`).expect(400);
});
