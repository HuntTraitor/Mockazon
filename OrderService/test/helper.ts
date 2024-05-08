import { Order, NewOrder, UpdateOrder } from '../src/order';

import * as http from 'http';

import * as db from './db';
import app from '../src/app';

let server: http.Server<
  typeof http.IncomingMessage,
  typeof http.ServerResponse
>;

beforeAll(async () => {
  server = http.createServer(app);
  server.listen();
  return await db.reset();
});

afterAll(done => {
  db.shutdown();
  server.close(done);
});

export { server };

const validateOrder = (order: Order) => {
  expect(order).toBeDefined();
  expect(order.id).toBeDefined();
  expect(order.product_id).toBeDefined();
  expect(order.shopper_id).toBeDefined();
  expect(order.vendor_id).toBeDefined();
  expect(order.data).toBeDefined();
  expect(order.data.quantity).toBeDefined();
  expect(order.data.purchaseDate).toBeDefined();
  expect(order.data.shipped).toBeDefined();
  expect(order.data.delivered).toBeDefined();
};

const validateNewOrder = (order: NewOrder) => {
  expect(order).toBeDefined();
  expect(order.product_id).toBeDefined();
  expect(order.shopper_id).toBeDefined();
  expect(order.quantity).toBeDefined();
};

const validateUpdateOrder = (order: UpdateOrder) => {
  expect(order).toBeDefined();
  expect(order.quantity).toBeDefined();
  expect(order.shipped).toBeDefined();
  expect(order.delivered).toBeDefined();
};

const compareOrders = (order1: Order, order2: Order) => {
  expect(order1.id).toBe(order2.id);
  expect(order1.product_id).toBe(order2.product_id);
  expect(order1.shopper_id).toBe(order2.shopper_id);
  expect(order1.vendor_id).toBe(order2.vendor_id);
  expect(order1.data.quantity).toBe(order2.data.quantity);
  expect(order1.data.purchaseDate).toBe(order2.data.purchaseDate);
  expect(order1.data.shipped).toBe(order2.data.shipped);
  expect(order1.data.delivered).toBe(order2.data.delivered);
};

const compareNewOrders = (order1: NewOrder, order2: NewOrder) => {
  expect(order1.product_id).toBe(order2.product_id);
  expect(order1.shopper_id).toBe(order2.shopper_id);
  expect(order1.quantity).toBe(order2.quantity);
};

const compareUpdateOrders = (order1: UpdateOrder, order2: UpdateOrder) => {
  expect(order1.quantity).toBe(order2.quantity);
  expect(order1.shipped).toBe(order2.shipped);
  expect(order1.delivered).toBe(order2.delivered);
};

export {
  validateOrder,
  validateNewOrder,
  validateUpdateOrder,
  compareOrders,
  compareNewOrders,
  compareUpdateOrders,
};
