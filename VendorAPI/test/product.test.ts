import supertest from 'supertest';
import { server } from './helper';

const productData = {
  name: "Sample Product",
  price: "99.99",
  description: "This is a sample product.",
  brand: "Sample Brand",
  image: "some image",
  rating: "4.5 stars",
  deliveryDate: "2024-10-11"
};

test('Unauthorized user cannot fetch product', async () => {
  await supertest(server).get('/v0/product/').expect(401);
});

test('Authorized user can fetch product', async () => {
  await supertest(server)
    .get('/v0/product/')
    .set('x-api-key', `bf582726-1927-4604-8d94-7f1540a7eb37`)
    .expect(200)
    .then((res) => {
      console.log(res.body)
    })
});
test('Unauthorized user cannot post a product', async () => {
  await supertest(server)
    .post('/v0/product/')
    // .set('x-api-key', `bf582726-1927-4604-8d94-7f1540a7eb37`)
    .expect(401)
});

test('Authorized vendor can post a product', async () => {
  await supertest(server)
    .post('/v0/product/')
    .set('x-api-key', `bf582726-1927-4604-8d94-7f1540a7eb37`)
    .send(productData)
    .expect(201)
    .then((res) => (
      expect(res.body.data.name).toEqual("Sample Product")
    ));
});