import { randomUUID } from 'crypto';
import supertest from 'supertest';
import { server, validateProduct } from './helper';

describe('Listing new products', () => {
  const newProduct = {
    name: 'Test Product',
    price: '100.00',
    properties: {
      color: 'red',
      size: 'small',
      material: 'cotton',
    },
  };

  const vendorId = randomUUID();

  test('Rejects new product with missing fields', async () => {
    await supertest(server)
      .post('/api/v0/product')
      .query({ vendorId })
      .send({})
      .expect(400)
      .then(response => {
        expect(response.body.status).toBe(400);
        expect(response.body.message).toBeDefined();
      });
  });

  test('Should create a new product', async () => {
    await supertest(server)
      .get('/api/v0/product')
      .query({ vendorId })
      .expect(200)
      .then(response => response.body)
      .then(products => {
        expect(products).toHaveLength(0);
        for (const product of products) {
          validateProduct(product);
        }
      });

    const newProductResponse = await supertest(server)
      .post('/api/v0/product')
      .query({ vendorId })
      .send(newProduct)
      .expect(201);

    validateProduct(newProductResponse.body);
    expect(newProductResponse.body.data.name).toBe(newProduct.name);
    expect(newProductResponse.body.data.price).toBe(newProduct.price);
    expect(newProductResponse.body.data.properties).toEqual(
      newProduct.properties
    );

    const products = await supertest(server)
      .get('/api/v0/product')
      .query({ vendorId })
      .expect(200);

    expect(products.body).toHaveLength(1);
    validateProduct(products.body[0]);
    expect(products.body[0].data.name).toBe(newProduct.name);
    expect(products.body[0].data.price).toBe(newProduct.price);
    expect(products.body[0].data.properties).toEqual(newProduct.properties);
  });
});
