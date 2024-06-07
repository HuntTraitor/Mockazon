import supertest from 'supertest';
import { server, mockMicroservices } from './helper';

// const orderUpdateData = {
//   quantity: '4',
//   shipped: true,
// };

// let orderID: string = '';
test('Unauthorized vendor cannot fetch orders', async () => {
  mockMicroservices.unauthorized = true;
  await supertest(server)
    .get('/v0/order/')
    .set('x-api-key', `bf582726-1927-4604-8d94-7f1540a7eb37`)
    .expect(401);
});

test('Authorized vendor can fetch orders', async () => {
  await supertest(server)
    .get('/v0/order/')
    .set('x-api-key', `bf582726-1927-4604-8d94-7f1540a7eb37`)
    .expect(200)
    .then(res => {
      expect(res.body.length).toBeGreaterThan(0);
    });
});

test('Vendors can update orders they own', async () => {
  await supertest(server)
    .put('/v0/order/28d37910-66ae-4da2-b8f6-9d7e48c5dd57')
    .set('x-api-key', `bf582726-1927-4604-8d94-7f1540a7eb37`)
    .send({
      quantity: '4',
      shipped: true,
      delivered: false,
    })
    .expect(201)
    .then(res => {
      expect(res.body.data.quantity).toEqual('4');
      expect(res.body.data.shipped).toEqual('true');
      expect(res.body.data.delivered).toEqual('false');
    });
});

test('Vendors cannot update orders they do not own', async () => {
  mockMicroservices.orderOwnership = false;
  await supertest(server)
    .put('/v0/order/28d37910-66ae-4da2-b8f6-9d7e48c5dd57')
    .set('x-api-key', `bf582726-1927-4604-8d94-7f1540a7eb37`)
    .send({
      quantity: '4',
      shipped: true,
      delivered: false,
    })
    .expect(404);
});

test('Vendors can update shipped status of orders they own', async () => {
  await supertest(server)
    .put('/v0/order/28d37910-66ae-4da2-b8f6-9d7e48c5dd57/shipped?shipped=true')
    .set('x-api-key', `bf582726-1927-4604-8d94-7f1540a7eb37`)
    .expect(201)
    .then(res => {
      expect(res.body.data.shipped).toEqual('true');
    });
});

test('Vendors cannot update shipped status of orders they do not own', async () => {
  mockMicroservices.orderOwnership = false;
  await supertest(server)
    .put('/v0/order/28d37910-66ae-4da2-b8f6-9d7e48c5dd57/shipped?shipped=true')
    .set('x-api-key', `bf582726-1927-4604-8d94-7f1540a7eb37`)
    .expect(404);
});

test('Vendors can update delivered status of orders they own', async () => {
  await supertest(server)
    .put(
      '/v0/order/28d37910-66ae-4da2-b8f6-9d7e48c5dd57/delivered?delivered=true'
    )
    .set('x-api-key', `bf582726-1927-4604-8d94-7f1540a7eb37`)
    .expect(201)
    .then(res => {
      expect(res.body.data.delivered).toEqual('true');
    });
});

test('Vendors cannot update delivered status of orders they do not own', async () => {
  mockMicroservices.orderOwnership = false;
  await supertest(server)
    .put(
      '/v0/order/28d37910-66ae-4da2-b8f6-9d7e48c5dd57/delivered?delivered=true'
    )
    .set('x-api-key', `bf582726-1927-4604-8d94-7f1540a7eb37`)
    .expect(404);
});

test('Errors in getting orders are handled', async () => {
  mockMicroservices.orderError = true;
  await supertest(server)
    .get('/v0/order/')
    .set('x-api-key', `bf582726-1927-4604-8d94-7f1540a7eb37`)
    .expect(500);
});

test('Errors in updating orders are handled', async () => {
  mockMicroservices.orderError = true;
  await supertest(server)
    .put('/v0/order/28d37910-66ae-4da2-b8f6-9d7e48c5dd57')
    .set('x-api-key', `bf582726-1927-4604-8d94-7f1540a7eb37`)
    .send({
      quantity: '4',
      shipped: true,
      delivered: false,
    })
    .expect(500);
});

test('Errors in updating shipped status of orders are handled', async () => {
  mockMicroservices.orderError = true;
  await supertest(server)
    .put('/v0/order/28d37910-66ae-4da2-b8f6-9d7e48c5dd57/shipped?shipped=true')
    .set('x-api-key', `bf582726-1927-4604-8d94-7f1540a7eb37`)
    .expect(500);
});

test('Errors in updating delivered status of orders are handled', async () => {
  mockMicroservices.orderError = true;
  await supertest(server)
    .put(
      '/v0/order/28d37910-66ae-4da2-b8f6-9d7e48c5dd57/delivered?delivered=true'
    )
    .set('x-api-key', `bf582726-1927-4604-8d94-7f1540a7eb37`)
    .expect(500);
});

test('Updating order with no changes returns the order', async () => {
  await supertest(server)
    .put('/v0/order/28d37910-66ae-4da2-b8f6-9d7e48c5dd57')
    .set('x-api-key', `bf582726-1927-4604-8d94-7f1540a7eb37`)
    .expect(201)
    .then(res => {
      expect(res.body.data.quantity).toEqual(1);
      expect(res.body.data.shipped).toEqual(false);
      expect(res.body.data.delivered).toEqual(false);
    });
});

test('Handles error in checking order ownership', async () => {
  mockMicroservices.orderError = true;
  mockMicroservices.orderOwnership = false;
  await supertest(server)
    .put('/v0/order/28d37910-66ae-4da2-b8f6-9d7e48c5dd57')
    .set('x-api-key', `bf582726-1927-4604-8d94-7f1540a7eb37`)
    .send({
      quantity: '4',
      shipped: true,
      delivered: false,
    })
    .expect(500);
});
