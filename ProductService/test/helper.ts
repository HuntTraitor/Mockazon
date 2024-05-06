import { Product, Review } from '../src/product';

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

export const validateProduct = (product: Product) => {
  expect(product.id).toBeDefined();
  expect(product.data.name).toBeDefined();
  expect(product.data.price).toBeDefined();
  expect(product.data.properties).toBeDefined();
  /*
  expect(product.active).toBeDefined();
  expect(product.vendorId).toBeDefined();
  expect(product.created).toBeDefined();
  expect(product.posted).toBeDefined();
  */
};

export const validateReview = (review: Review) => {
  expect(review.id).toBeDefined();
  expect(review.product_id).toBeDefined();
  expect(review.reviewer_id).toBeDefined();
  expect(review.created).toBeDefined();
  expect(review.data.rating).toBeDefined();
  expect(review.data.comment).toBeDefined();
};
