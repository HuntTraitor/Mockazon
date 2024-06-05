import supertest from 'supertest';
import { server } from './helper';
import { NewOrder, ShopperOrder } from '../src/order';
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

const postShopperOrder = async (): Promise<string | undefined> => {
  let orderId;
  const shopper_id = randomUUID();
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

const postVendorShopperOrder = async (): Promise<string | undefined> => {
  const vendorOrderId = await postOrder();
  const shopperOrderId = await postShopperOrder();
  await supertest(server)
    .post(`/api/v0/order/vendorShopperOrder`)
    .send({ vendor_id: vendorOrderId, shopper_id: shopperOrderId })
    .expect(201)
    .then(res => {
      expect(res.body).toBeDefined();
      console.log(res.body);
      expect(res.body.shopper_order_id).toBeDefined();
      expect(res.body.vendor_order_id).toBeDefined();
    });
  return vendorOrderId;
};

describe('Update Vendor Order', () => {
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

  test('Updates /shipped to "true" 201', async () => {
    const orderId = await postVendorShopperOrder();
    await supertest(server)
      .put(`/api/v0/order/${orderId}/shipped?shipped=true`)
      .expect(201)
      .then(res => {
        expect(res.body.data.shipped).toBeTruthy();
      });
  });

  test('Updates /shipped to unknown order 404', async () => {
    const orderId = randomUUID();
    await supertest(server)
      .put(`/api/v0/order/${orderId}/shipped?shipped=true`)
      .expect(404);
  });

  test('Updates /delivered to "true" 201', async () => {
    const orderId = await postVendorShopperOrder();
    await supertest(server)
      .put(`/api/v0/order/${orderId}/delivered?delivered=true`)
      .expect(201)
      .then(res => {
        expect(res.body.data.delivered).toBeTruthy();
      });
  });

  test('Updates /delivered to unknown order 404', async () => {
    const orderId = randomUUID();
    await supertest(server)
      .put(`/api/v0/order/${orderId}/delivered?delivered=true`)
      .expect(404);
  });
});

/*
describe('Update Shopper Order', () => {
  let shopperOrderId: string | undefined;
  beforeAll(async () => {
    shopperOrderId = await postShopperOrder();
    console.log('shopperOrderId', shopperOrderId);
  });
  test('Updates shipped on order 201', async () => {
    await supertest(server)
      .put(`/api/v0/order/${shopperOrderId}/shipped?shipped=true`)
      .then(res => {
        console.log(res.body);
        expect(res.status).toBe(201);
        expect(res.body.data.shipped).toBeTruthy();
      });
  });

  test('Updates delivered on order 201', async () => {
    await supertest(server)
      .put(`/api/v0/order/${shopperOrderId}/delivered?delivered=true`)
      .expect(201)
      .then(res => {
        expect(res.body.data.delivered).toBeTruthy();
      });
  });

  test('Updates shipped and delivered on order 201', async () => {
    await supertest(server)
      .put(`/api/v0/order/${shopperOrderId}/shipped?shipped=true`)
      .expect(201)
      .then(res => {
        expect(res.body.data.shipped).toBeTruthy();
      });
    await supertest(server)
      .put(`/api/v0/order/${shopperOrderId}/delivered?delivered=true`)
      .expect(201)
      .then(res => {
        expect(res.body.data.delivered).toBeTruthy();
      });
  });

  test('Updates shipped on unknown order 404', async () => {
    const orderId = randomUUID();
    await supertest(server)
      .put(`/api/v0/order/${orderId}/shipped?shipped=true`)
      .expect(404);
  });

  test('Updates delivered on unknown order 404', async () => {
    const orderId = randomUUID();
    await supertest(server)
      .put(`/api/v0/order/${orderId}/delivered?delivered=true`)
      .expect(404);
  });
});
*/