import supertest from 'supertest';
import { server, mockMicroservices } from './helper';

test('Unauthorized vendor cannot fetch product', async () => {
  mockMicroservices.unauthorized = true;
  await supertest(server)
    .get('/v0/product/')
    .set('x-api-key', `bf582726-1927-4604-8d94-7f1540a7eb37`)
    .expect(401);
});

test('Authorized vendor can fetch product', async () => {
  await supertest(server)
    .get('/v0/product/')
    .set('x-api-key', `bf582726-1927-4604-8d94-7f1540a7eb37`)
    .expect(200)
    .then(res => {
      expect(res.body.length).toBeGreaterThan(0);
    });
});

test('Vendors can create product', async () => {
  await supertest(server)
    .post('/v0/product')
    .set('x-api-key', `bf582726-1927-4604-8d94-7f1540a7eb37`)
    .send({
      name: 'string',
      brand: 'string',
      image: 'string',
      rating: '5',
      price: '100',
      description: 'string',
      deliveryDate: '2024-06-07T04:57:05.668Z',
    })
    .expect(201)
    .then(res => {
      expect(res.body.data.name).toEqual('string');
      expect(res.body.data.brand).toEqual('string');
      expect(res.body.data.description).toEqual('string');
      expect(res.body.data.price).toEqual('100');
      expect(res.body.data.rating).toEqual('5');
      expect(res.body.data.image).toEqual('string');
    });
});

test('Vendors can get products with filters', async () => {
  await supertest(server)
    .get(
      '/v0/product/?active=true&pageSize=5&page=2&search=Product&orderBy=price&descending=true'
    )
    .set('x-api-key', `bf582726-1927-4604-8d94-7f1540a7eb37`)
    .expect(200)
    .then(res => {
      expect(res.body.length).toBeGreaterThan(0);
    });
});

test('Errors in fetching products are handled', async () => {
  mockMicroservices.productError = true;
  await supertest(server)
    .get('/v0/product/')
    .set('x-api-key', `bf582726-1927-4604-8d94-7f1540a7eb37`)
    .expect(500);
});

test('Errors in creating products are handled', async () => {
  mockMicroservices.productError = true;
  await supertest(server)
    .post('/v0/product')
    .set('x-api-key', `bf582726-1927-4604-8d94-7f1540a7eb37`)
    .send({
      name: 'string',
      brand: 'string',
      image: 'string',
      rating: '5',
      price: '100',
      description: 'string',
      deliveryDate: '2024-06-07T04:57:05.668Z',
    })
    .expect(500);
});
