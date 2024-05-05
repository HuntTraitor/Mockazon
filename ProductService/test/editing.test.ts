import { randomUUID } from 'crypto';
import supertest from 'supertest';
import { server, validateProduct } from './helper';
import * as db from './db';

describe('Editing products', () => {
  const updatedProduct = {
    name: 'Updated Product',
    price: '200.00',
    properties: {
      color: 'blue',
      size: 'large',
      material: 'cotton',
    },
  };

  test('Should update a product', async () => {
    const products = await supertest(server).get('/api/v0/product').expect(200);

    const product = products.body[0];
    console.log('product', product);
    const updatedProductResponse = await supertest(server)
      .put(`/api/v0/product/${product.id}`)
      .send(updatedProduct)
      .then(response => {
        return response;
      });
    validateProduct(updatedProductResponse.body);
    expect(updatedProductResponse.body.data.name).toBe(updatedProduct.name);
    expect(updatedProductResponse.body.data.price).toBe(updatedProduct.price);
    expect(updatedProductResponse.body.data.properties).toEqual(
      updatedProduct.properties
    );
  });

  test('Should return 404 for a non-existent product', async () => {
    const productId = randomUUID();
    await supertest(server)
      .put(`/api/v0/product/${productId}`)
      .send(updatedProduct)
      .expect(404);
  });
});

describe('Setting product status', () => {
  beforeAll(async () => {
    return await db.reset();
  });

  test('Should activate a product', async () => {
    const products = await supertest(server).get('/api/v0/product').expect(200);

    const product = products.body[0];
    const updatedProduct = await supertest(server)
      .put(`/api/v0/product/${product.id}/setActiveStatus`)
      .query({ active: true })
      .expect(200);

    validateProduct(updatedProduct.body);
    expect(updatedProduct.body.active).toBe(true);
  });

  test('Should deactivate a product', async () => {
    const products = await supertest(server).get('/api/v0/product').expect(200);

    const product = products.body[0];
    const updatedProduct = await supertest(server)
      .put(`/api/v0/product/${product.id}/setActiveStatus`)
      .query({ active: false })
      .expect(200);

    validateProduct(updatedProduct.body);
    expect(updatedProduct.body.active).toBe(false);
  });

  test('Should return 404 for a non-existent product', async () => {
    const productId = randomUUID();
    await supertest(server)
      .put(`/api/v0/product/${productId}/setActiveStatus`)
      .query({ active: true })
      .expect(404);
  });
});
