import supertest from 'supertest';
import { server, validateShopperOrder } from './helper';
import { Order, ShopperOrder } from '../src/order';
import { randomUUID } from 'crypto';
import { validateOrder, validateNewOrder, compareOrders } from './helper';

let orders: Order[] = [];
beforeAll(async () => {
  const response = await supertest(server).get(`/api/v0/order`).expect(200);
  orders = response.body;
});

describe('Vendor Get Orders', () => {
  test('Post 201 and Get Orders 200', async () => {
    const newOrders = [
      {
        product_id: randomUUID(),
        shopper_id: randomUUID(),
        quantity: '2',
      },
      {
        product_id: randomUUID(),
        shopper_id: randomUUID(),
        quantity: '2',
      },
    ];
    for (const newOrder of newOrders) {
      validateNewOrder(newOrder);
      await supertest(server)
        .post(`/api/v0/order`)
        .send(newOrder)
        .query({ vendorId: randomUUID() })
        .expect(201)
        .then(res => {
          validateOrder(res.body);
        });
    }
    const response = await supertest(server).get(`/api/v0/order`).expect(200);
    expect(response.body).toBeDefined();
    expect(response.body.length).toBe(orders.length + newOrders.length);
  });

  test('Gets a specific order by ids 200', async () => {
    await supertest(server)
      .get(
        `/api/v0/order?productId=${orders[0].product_id}&shopperId=${orders[0].shopper_id}&vendorId=${orders[0].vendor_id}`
      )
      .expect(200)
      .then(res => {
        validateOrder(res.body[0]);
        compareOrders(res.body[0], orders[0]);
      });
  });

  // test('Gets one order by accountId 200', async () => {
  //   await postOrders(1);
  //   await supertest(server)
  //     .get(`/api/v0/order?accountId=${accountId}`)
  //     .expect(200)
  //     .then(res => {
  //       expect(res.body).toBeDefined();
  //       expect(res.body[0].id).toBeDefined();
  //       expect(res.body[0].product_id).toBe(productId);
  //       expect(res.body[0].data).toBeDefined();
  //       expect(res.body[0].data.quantity).toBe('2');
  //       expect(res.body[0].data.purchaseDate).toBeDefined();
  //       expect(res.body[0].data.delivered).toBeFalsy();
  //       expect(res.body[0].data.received).toBeFalsy();
  //     });
  // });

  // test('Gets one order by both accountId and productId 200', async () => {
  //   await postOrders(1);
  //   await supertest(server)
  //     .get(`/api/v0/order?accountId=${accountId}&productId=${productId}`)
  //     .expect(200)
  //     .then(res => {
  //       expect(res.body).toBeDefined();
  //       expect(res.body[0].id).toBeDefined();
  //       expect(res.body[0].product_id).toBe(productId);
  //       expect(res.body[0].data).toBeDefined();
  //       expect(res.body[0].data.quantity).toBe('2');
  //       expect(res.body[0].data.purchaseDate).toBeDefined();
  //       expect(res.body[0].data.delivered).toBeFalsy();
  //       expect(res.body[0].data.received).toBeFalsy();
  //     });
  // });

  // test('Gets multiple orders 200', async () => {
  //   await postOrders(4);
  //   await supertest(server)
  //     .get(`/api/v0/order?productId=${productId}`)
  //     .expect(200)
  //     .then(res => {
  //       expect(res.body).toBeDefined();
  //       expect(res.body.length).toBe(4);
  //     });
  // });

  // test('Gets no orders productId 200', async () => {
  //   await supertest(server)
  //     .get(`/api/v0/order?productId=${productId}`)
  //     .expect(200)
  //     .then(res => {
  //       expect(res.body).toBeDefined();
  //       expect(res.body.length).toBe(0);
  //     });
  // });

  // test('Gets no orders accountId 200', async () => {
  //   await supertest(server)
  //     .get(`/api/v0/order?accountId=${accountId}`)
  //     .expect(200)
  //     .then(res => {
  //       expect(res.body).toBeDefined();
  //       expect(res.body.length).toBe(0);
  //     });
  // });

  // test('Gets all order bad product id 400', async () => {
  //   await supertest(server).get(`/api/v0/order?productId=123123`).expect(400);
  // });

  // test('Gets all order bad account id 400', async () => {
  //   await supertest(server).get(`/api/v0/order?accountId=123123`).expect(400);
  // });
});

describe('Shopper Get Orders', () => {
  test('Post 201 and Get Orders 200', async () => {
    const newShopperOrders: ShopperOrder[] = [
      {
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
      },
      {
        tax: 0.2,
        total: 200,
        shipped: true,
        subtotal: 160,
        createdAt: new Date(),
        delivered: true,
        deliveryTime: '2-3 weeks',
        paymentDigits: '5678',
        paymentMethod: 'Debit Card',
        paymentBrand: 'MasterCard',
        shippingAddress: {
          city: 'New York',
          name: 'Jane Doe',
          state: 'NY',
          country: 'USA',
          postalCode: '10001',
          addressLine1: '456 Broadway',
        },
      },
    ];

    const shopper_id = randomUUID();
    for (const newShopperOrder of newShopperOrders) {
      await supertest(server)
        .post(`/api/v0/order/shopperOrder?shopperId=${shopper_id}`)
        .send(newShopperOrder)
        .expect(201);
    }

    const response = await supertest(server)
      .get(`/api/v0/order/shopperOrder?shopperId=${shopper_id}`)
      .expect(200);
    expect(response.body).toBeDefined();
    expect(response.body.length).toBe(newShopperOrders.length);
    for (const shopperOrder of response.body) {
      validateShopperOrder(shopperOrder);
    }
  });
});
