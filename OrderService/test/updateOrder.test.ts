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

test('Successfully updates quantity an order 201', async () => {
  const orderId = await postOrder();
  await supertest(server)
    .put(`/api/v0/order/${orderId}?quantity=3`)
    .expect(201)
    .then(res => {
      validateOrder(res.body);
      expect(res.body.data.quantity).toBe('3');
    });
});

test('Succssfuly updates partial quantity and shipped on order 201', async () => {
  const orderId = await postOrder();
  await supertest(server)
    .put(`/api/v0/order/${orderId}?quantity=4&shipped=true`)
    .expect(201)
    .then(res => {
      expect(res.body.data.quantity).toBe('4');
      expect(res.body.data.delivered).toBeFalsy();
      expect(res.body.data.shipped).toBeTruthy();
    });
});

test('Successfully updates everything on order 201', async () => {
  const orderId = await postOrder();
  await supertest(server)
    .put(`/api/v0/order/${orderId}?quantity=4&shipped=true&delivered=true`)
    .expect(201)
    .then(res => {
      expect(res.body.data.quantity).toBe('4');
      expect(res.body.data.delivered).toBeTruthy();
      expect(res.body.data.shipped).toBeTruthy();
    });
});

test('No query parameters returns no updates 201', async () => {
  const orderId = await postOrder();
  await supertest(server)
    .put(`/api/v0/order/${orderId}`)
    .expect(201)
    .then(res => {
      validateOrder(res.body);
      expect(res.body.data.quantity).toBe('2');
    });
});

test('Updates with an unknown query parameter', async () => {
  const orderId = await postOrder();
  await supertest(server)
    .put(`/api/v0/order/${orderId}?test=good`)
    .expect(201)
    .then(res => {
      validateOrder(res.body);
      expect(res.body.data.quantity).toBe('2');
    });
});

test('Updates unknown Order ID 404', async () => {
  const orderId = randomUUID();
  await supertest(server)
    .put(`/api/v0/order/${orderId}?quantity=4&shipped=true&delivered=true`)
    .expect(404);
});

test('Updates bad Order ID 400', async () => {
  await supertest(server)
    .put(`/api/v0/order/123?quantity=4&shipped=true&delivered=true`)
    .expect(400);
});

test('Updates quantity to bad value 400', async () => {
  const orderId = await postOrder();
  await supertest(server)
    .put(`/api/v0/order/${orderId}?quantity=hello`)
    .expect(400);
});

test('Updates quantity to "0" 400', async () => {
  const orderId = await postOrder();
  await supertest(server)
    .put(`/api/v0/order/${orderId}?quantity=0`)
    .expect(400);
});

test('Updates quantity to "1000" 400', async () => {
  const orderId = await postOrder();
  await supertest(server)
    .put(`/api/v0/order/${orderId}?quantity=1000`)
    .expect(400);
});

test('Updates delivered to bad value 400', async () => {
  const orderId = await postOrder();
  await supertest(server)
    .put(`/api/v0/order/${orderId}?delivered=hello`)
    .expect(400);
});

test('Updates shipped to bad value 400', async () => {
  const orderId = await postOrder();
  await supertest(server)
    .put(`/api/v0/order/${orderId}?shipped=hello`)
    .expect(400);
});
