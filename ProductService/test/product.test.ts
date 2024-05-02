import supertest from 'supertest';
import * as http from 'http';

import * as db from './db';
import app from '../src/app';
import { randomUUID } from 'crypto';
import { Product } from '../src/product';

let server: http.Server<
  typeof http.IncomingMessage,
  typeof http.ServerResponse
>;

beforeAll(async () => {
  server = http.createServer(app);
  server.listen();
  return await db.reset();
});

afterAll((done) => {
  db.shutdown();
  server.close(done);
});

const validateProduct = (product: Product) => {
  expect(product.id).toBeDefined();
  expect(product.data.name).toBeDefined();
  expect(product.data.price).toBeDefined();
  /* FIXME: Implement extra fields
  expect(product.data.active).toBeDefined();
  expect(product.data.vendorId).toBeDefined();
  expect(product.data.createdAt).toBeDefined();
  expect(product.data.postedAt).toBeDefined();
  */
};

describe('General', () => {
  test('Rejects invalid URLs', async () => {
    await supertest(server)
      .get('/api/v0/invalid')
      .expect(404)
  });
  
  test('Renders Swagger UI', async () => {
    await supertest(server)
      .get('/api/v0/docs/')
      .expect(200)
      // FIXME: Expect something here?
  });
});


describe('Listing new products', () => {
  const newProduct = {
    name: 'Test Product',
    price: '100.00',
  };

  const vendorId = randomUUID();

  test('Rejects new product with missing fields', async () => {
    await supertest(server)
      .post('/api/v0/product')
      .query({vendorId})
      .send({})
      .expect(400)
      .then((response) => {
        expect(response.body.status).toBe(400);
        expect(response.body.message).toBeDefined();
      });
  });

  test('Should create a new product', async () => {
    await supertest(server)
      .get('/api/v0/product')
      .query({vendorId})
      .expect(200)
      .then((response) => response.body)
      .then((products) => {
        expect(products).toHaveLength(0);
        for (const product of products) {
          validateProduct(product);
        }
      });

    const newProductResponse = await supertest(server)
      .post('/api/v0/product')
      .query({vendorId})
      .send(newProduct)
      .expect(201);
    
    validateProduct(newProductResponse.body);
    expect(newProductResponse.body.data.name).toBe(newProduct.name);
    expect(newProductResponse.body.data.price).toBe(newProduct.price);

    const products = await supertest(server)
      .get('/api/v0/product')
      .query({vendorId})
      .expect(200);
    
    expect(products.body).toHaveLength(1);
    validateProduct(products.body[0]);
    expect(products.body[0].data.name).toBe(newProduct.name);
    expect(products.body[0].data.price).toBe(newProduct.price);
  });
});