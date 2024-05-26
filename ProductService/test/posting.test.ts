import { randomUUID } from 'crypto';
import supertest from 'supertest';
import { server, validateProduct, validateReview } from './helper';

describe('Listing new products', () => {
  const newProduct = {
    name: 'Test name',
    brand: 'Test brand',
    image: 'http://test-image.jpg',
    rating: 'Test rating',
    price: "19.99",
    description: 'This is a test product',
    deliveryDate: new Date().toISOString(),
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

    const products = await supertest(server)
      .get('/api/v0/product')
      .query({ vendorId })
      .expect(200);

    expect(products.body).toHaveLength(1);
    validateProduct(products.body[0]);
    expect(products.body[0].data.name).toBe(newProduct.name);
    expect(products.body[0].data.price).toBe(newProduct.price);
  });
});

describe('Creating Reviews', () => {
  const newReview = {
    rating: 5,
    comment: 'Great product!',
  };

  const productId = 'd1c689b1-b7a7-4100-8b2d-309908b444f5';
  const userId = randomUUID();

  test('Should create a new review', async () => {
    const reviewResponse = await supertest(server)
      .post(`/api/v0/product/${productId}/review`)
      .send(newReview)
      .query({ userId })
      .expect(201);
    validateReview(reviewResponse.body);
    expect(reviewResponse.body.data.rating).toBe(newReview.rating);
    expect(reviewResponse.body.data.comment).toBe(newReview.comment);
  });

  test('review non-existent product', async () => {
    await supertest(server)
      .post(`/api/v0/product/${randomUUID()}/review`)
      .send(newReview)
      .query({ userId })
      .expect(404);
  });

  test('double review', async () => {
    await supertest(server)
      .post(`/api/v0/product/${productId}/review`)
      .send(newReview)
      .query({ userId })
      .expect(500);
  });
});
