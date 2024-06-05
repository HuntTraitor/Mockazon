import supertest from 'supertest';
import { server, validateShopperOrder } from './helper';
import { NewOrder } from '../src/order';
import { randomUUID } from 'crypto';
import { validateOrder, validateNewOrder } from './helper';
import { ShopperOrder } from '../src/order';

const shopper_id = randomUUID();

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

const postShopperOrder = async (): Promise<string | undefined> => {
  let orderId;
  const newOrder: ShopperOrder = {
    tax: 0.1,
    total: 100,
    shipped: false,
    subtotal: 90,
    createdAt: new Date(),
    delivered: false,
    deliveryTime: '1-2 weeks',
    paymentDigits: '1234',
    paymentMethod: 'Credit Card',
    paymentBrand: 'Visa',
    shippingAddress: {
      city: 'San Francisco',
      name: 'John Doe',
      state: 'CA',
      country: 'USA',
      postalCode: '94101',
      addressLine1: '123 Main St',
    },
  };
  await supertest(server)
    .post(`/api/v0/order/shopperOrder?shopperId=${shopper_id}`)
    .send(newOrder)
    .then(res => {
      expect(res.status).toBe(201);
      orderId = res.body.id;
    });
  return orderId;
};

const postProduct = async (orderId: string | undefined) => {
  await supertest(server)
    .post(`/api/v0/order/shopperOrder/orderProduct`)
    .send({
      shopper_order_id: orderId,
      product_id: randomUUID(),
      quantity: 2,
    })
    .expect(201);
};

describe('Get one vendor order', () => {
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
    const orderId = randomUUID();
    await supertest(server).get(`/api/v0/order/${orderId}`).expect(404);
  });

  test('Gets order bad orderId 400', async () => {
    await supertest(server).get(`/api/v0/order/badid`).expect(400);
  });
});

describe('Get one shopper order', () => {
  test('Gets successful order 200', async () => {
    const orderId = await postShopperOrder();
    await supertest(server)
      .get(`/api/v0/order/shopperOrder/${orderId}`)
      .expect(200)
      .then(res => {
        validateShopperOrder(res.body);
      });
  });

  test('Gets order with products 200', async () => {
    const orderId = await postShopperOrder();
    await postProduct(orderId);
    await supertest(server)
      .get(`/api/v0/order/shopperOrder/${orderId}`)
      .expect(200)
      .then(res => {
        validateShopperOrder(res.body);
      });
  });

  test('Gets order not found 404', async () => {
    const orderId = randomUUID();
    await supertest(server)
      .get(`/api/v0/order/shopperOrder/${orderId}`)
      .expect(404);
  });

  test('Gets order bad orderId 400', async () => {
    await supertest(server).get(`/api/v0/order/shopperOrder/badid`).expect(400);
  });
});
