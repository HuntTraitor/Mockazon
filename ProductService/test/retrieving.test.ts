import { randomUUID } from 'crypto';
import supertest from 'supertest';
import { server, validateProduct, validateReview } from './helper';

describe('Retrieving products', () => {
  const vendorOne = '78b9467a-8029-4c1f-afd9-ea56932c3f46';
  const vendorTwo = '78b9467a-8029-4c1f-afd9-ea56932c3f45';

  test('Should retrieve all products', async () => {
    const products = await supertest(server).get('/api/v0/product').expect(200);

    expect(products.body).toHaveLength(3);
    for (const product of products.body) {
      validateProduct(product);
    }
  });

  test('Should retrieve products for a specific vendor', async () => {
    const products = await supertest(server)
      .get('/api/v0/product')
      .query({ vendorId: vendorOne })
      .expect(200);

    for (const product of products.body) {
      validateProduct(product);
      expect(product.vendor_id).toBe(vendorOne);
    }

    const productsTwo = await supertest(server)
      .get('/api/v0/product')
      .query({ vendorId: vendorTwo })
      .expect(200);

    for (const product of productsTwo.body) {
      validateProduct(product);
      expect(product.vendor_id).toBe(vendorTwo);
    }
  });

  test('Should be able to search products by name', async () => {
    const products = await supertest(server)
      .get('/api/v0/product')
      .query({ search: 'Gatsby' })
      .expect(200);

    expect(products.body).toHaveLength(1);
    for (const product of products.body) {
      validateProduct(product);
      expect(product.data.name).toContain('Gatsby');
    }
  });

  test('Should be able to sort products by price', async () => {
    const products = await supertest(server)
      .get('/api/v0/product')
      .query({ orderBy: 'price' })
      .expect(200);

    let currPrice = products.body[0].data.price;
    for (const product of products.body) {
      validateProduct(product);
      expect(product.data.price).toBe(currPrice);
      currPrice = product.data.price;
    }
  });

  test('Should be able to sort products by price in descending order', async () => {
    const products = await supertest(server)
      .get('/api/v0/product')
      .query({ orderBy: 'price', descending: true })
      .expect(200);

    let currPrice = products.body[0].data.price;
    for (const product of products.body) {
      validateProduct(product);
      expect(product.data.price).toBe(currPrice);
      currPrice = product.data.price;
    }
  });

  test('Should be able to retrieve inactive products', async () => {
    const products = await supertest(server)
      .get('/api/v0/product')
      .query({ active: false })
      .expect(200);

    for (const product of products.body) {
      validateProduct(product);
      expect(product.active).toBe(false);
    }
  });

  test('Should be able to retrieve active products', async () => {
    const products = await supertest(server)
      .get('/api/v0/product')
      .query({ active: true })
      .expect(200);

    for (const product of products.body) {
      validateProduct(product);
      expect(product.active).toBe(true);
    }
  });

  test('Should retrieve products sorted by posted date', async () => {
    const products = await supertest(server)
      .get('/api/v0/product')
      .query({ orderBy: 'posted' })
      .expect(200);

    let currDate = new Date(products.body[0].posted);
    for (const product of products.body) {
      validateProduct(product);
      const productDate = new Date(product.posted);
      expect(productDate.getTime()).toBeGreaterThanOrEqual(currDate.getTime());
      currDate = productDate;
    }
  });

  test('Should retrieve products sorted by posted date in descending order', async () => {
    const products = await supertest(server)
      .get('/api/v0/product')
      .query({ orderBy: 'posted', descending: 'true' })
      .expect(200);

    let currDate = new Date(products.body[0].posted);
    for (const product of products.body) {
      validateProduct(product);
      const productDate = new Date(product.posted);
      expect(productDate.getTime()).toBeLessThanOrEqual(currDate.getTime());
      currDate = productDate;
    }
  });

  test('Should retrieve a single product', async () => {
    const products = await supertest(server).get('/api/v0/product').expect(200);

    const product = await supertest(server)
      .get(`/api/v0/product/${products.body[0].id}`)
      .expect(200);

    validateProduct(product.body);
  });

  test('Should return 404 for a non-existent product', async () => {
    const productId = randomUUID();
    await supertest(server).get(`/api/v0/product/${productId}`).expect(404);
  });
});

describe('Getting reviews', () => {
  // test('Should retrieve all reviews for a product', async () => {
  //   const productId = 'd1c689b1-b7a7-4100-8b2d-309908b444f5';
  //   const reviews = await supertest(server)
  //     .get(`/api/v0/product/${productId}/review`)
  //     .expect(200);

  //   expect(reviews.body).toHaveLength(2);
  //   for (const review of reviews.body) {
  //     validateReview(review);
  //   }
  // });

  test('Should return 404 for a non-existent product', async () => {
    const productId = randomUUID();
    await supertest(server)
      .get(`/api/v0/product/${productId}/review`)
      .expect(404);
  });
});

// test('Should retrieve search suggestions', async () => {
//   const suggestions = await supertest(server)
//     .get('/api/v0/product/suggestions')
//     .query({ search: 'Gatsby' })
//     .expect(200);

//   expect(suggestions.body).toHaveLength(1);
//   expect(suggestions.body[0]).toContain('Gatsby');
// });

// test('Should retrieve search suggestions for a partial search', async () => {
//   const suggestions = await supertest(server)
//     .get('/api/v0/product/suggestions?search="G"')
//     .expect(200);

//   expect(suggestions.body).toHaveLength(1);
//   expect(suggestions.body[0]).toContain('Gatsby');
// });

// test('Should return an empty array for no search suggestions', async () => {
//   const suggestions = await supertest(server)
//     .get('/api/v0/product/suggestions')
//     .query({ search: 'Z' })
//     .expect(200);

//   expect(suggestions.body).toHaveLength(0);
// });
