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
      .then((response) => {
        expect(response.text).toContain('Swagger UI');
      });
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

describe('Retrieving products', () => {
  beforeAll(async () => {
    return await db.reset();
  });

  const vendorOne = '78b9467a-8029-4c1f-afd9-ea56932c3f46';
  const vendorTwo = '78b9467a-8029-4c1f-afd9-ea56932c3f45';

  test('Should retrieve all products', async () => {
    const products = await supertest(server)
      .get('/api/v0/product')
      .expect(200);
    
    expect(products.body).toHaveLength(3);
    for (const product of products.body) {
      validateProduct(product);
    }
  });

  test('Should retrieve products for a specific vendor', async () => {
    const products = await supertest(server)
      .get('/api/v0/product')
      .query({vendorId: vendorOne})
      .expect(200);
    
    for (const product of products.body) {
      validateProduct(product);
      expect(product.vendor_id).toBe(vendorOne);
    }

    const productsTwo = await supertest(server)
      .get('/api/v0/product')
      .query({vendorId: vendorTwo})
      .expect(200);
    
    for (const product of productsTwo.body) {
      validateProduct(product);
      expect(product.vendor_id).toBe(vendorTwo);
    }
  });

  test('Should be able to search products by name', async () => {
    const products = await supertest(server)
      .get('/api/v0/product')
      .query({search: 'Gatsby'})
      .expect(200);
    
    expect(products.body).toHaveLength(1);
    for (const product of products.body) {
      console.log(product);
      validateProduct(product);
      expect(product.data.name).toContain('Gatsby');
    }
  });

  test('Should be able to sort products by price', async () => {
    const products = await supertest(server)
      .get('/api/v0/product')
      .query({orderBy: 'price'})
      .expect(200);
    
    let currPrice = products.body[0].data.price;
    console.log(products.body);
    for (const product of products.body) {
      validateProduct(product);
      expect(product.data.price).toBeGreaterThanOrEqual(currPrice);
      currPrice = product.data.price;
    }
  });

  test('Should be able to sort products by price in descending order', async () => {
    const products = await supertest(server)
      .get('/api/v0/product')
      .query({orderBy: 'price', descending: true})
      .expect(200);
    
    let currPrice = products.body[0].data.price;
    for (const product of products.body) {
      validateProduct(product);
      expect(product.data.price).toBeLessThanOrEqual(currPrice);
      currPrice = product.data.price;
    }
  });

  test('Should be able to retrieve inactive products', async () => {
    const products = await supertest(server)
      .get('/api/v0/product')
      .query({active: false})
      .expect(200);
    
    for (const product of products.body) {
      validateProduct(product);
      expect(product.active).toBe(false);
    }
  });

  test('Should be able to retrieve active products', async () => {
    const products = await supertest(server)
      .get('/api/v0/product')
      .query({active: true})
      .expect(200);
    
    for (const product of products.body) {
      validateProduct(product);
      expect(product.active).toBe(true);
    }
  });
  
  test('Should retrieve products sorted by posted date', async () => {
    const products = await supertest(server)
      .get('/api/v0/product')
      .query({orderBy: 'postedAt'})
      .expect(200);

    let currDate = new Date(products.body[0].data.postedAt);
    for (const product of products.body) {
      validateProduct(product);
      const productDate = new Date(product.data.postedAt);
      expect(productDate.getTime()).toBeGreaterThanOrEqual(currDate.getTime());
      currDate = productDate;
    }
  });

  test('Should retrieve products sorted by posted date in descending order', async () => {
    const products = await supertest(server)
      .get('/api/v0/product')
      .query({orderBy: 'postedAt', descending: 'true'},)
      .expect(200);

    let currDate = new Date(products.body[0].data.postedAt);
    for (const product of products.body) {
      validateProduct(product);
      const productDate = new Date(product.data.postedAt);
      expect(productDate.getTime()).toBeLessThanOrEqual(currDate.getTime());
      currDate = productDate;
    }
  });

  test('Should retrieve a single product', async () => {
    const products = await supertest(server)
      .get('/api/v0/product')
      .expect(200);
    
    const product = await supertest(server)
      .get(`/api/v0/product/${products.body[0].id}`)
      .expect(200);
    
    validateProduct(product.body);
  });

  test('Should return 404 for a non-existent product', async () => {
    const productId = randomUUID();
    await supertest(server)
      .get(`/api/v0/product/${productId}`)
      .expect(404);
  });
});

describe('Editing products', () => {
  beforeAll(async () => {
    return await db.reset();
  });

  const updatedProduct = {
    name: 'Updated Product',
    price: '200.00',
  };

  test('Should update a product', async () => {
    const products = await supertest(server)
      .get('/api/v0/product')
      .expect(200);
    
    const product = products.body[0];

    const updatedProductResponse = await supertest(server)
      .put(`/api/v0/product/${product.id}`)
      .send(updatedProduct)
      .then((response) => {
        console.log(response);
        return response;
      })
    
    validateProduct(updatedProductResponse.body);
    expect(updatedProductResponse.body.data.name).toBe(updatedProduct.name);
    expect(updatedProductResponse.body.data.price).toBe(updatedProduct.price);
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
    const products = await supertest(server)
      .get('/api/v0/product')
      .expect(200);
    
    const product = products.body[0];
    const updatedProduct = await supertest(server)
      .put(`/api/v0/product/${product.id}/setActiveStatus`)
      .query({active: true})
      .expect(200);
    
    validateProduct(updatedProduct.body);
    expect(updatedProduct.body.active).toBe(true);
  });

  test('Should deactivate a product', async () => {
    const products = await supertest(server)
      .get('/api/v0/product')
      .expect(200);
    
    const product = products.body[0];
    const updatedProduct = await supertest(server)
      .put(`/api/v0/product/${product.id}/setActiveStatus`)
      .query({active: false})
      .expect(200);
    
    validateProduct(updatedProduct.body);
    expect(updatedProduct.body.active).toBe(false);
  });

  test('Should return 404 for a non-existent product', async () => {
    const productId = randomUUID();
    await supertest(server)
      .put(`/api/v0/product/${productId}/setActiveStatus`)
      .query({active: true})
      .expect(404);
  });
});