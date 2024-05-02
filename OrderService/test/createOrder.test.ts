import supertest from "supertest";
import * as http from "http";

import * as db from "./db";
import app from "../src/app";

let server: http.Server<
  typeof http.IncomingMessage,
  typeof http.ServerResponse
>;

beforeEach(async () => {
  server = http.createServer(app);
  server.listen();
  await db.reset();
});

afterAll((done) => {
  db.shutdown();
  server.close(done);
});

const productId = "3f2687d0-d115-421f-ae23-ac572005a791";
const accountId = "1ed8ca72-2027-4d19-ba6b-e6be75ab7d8b";
const mockOrder = {
  product_id: productId,
  account_id: accountId,
  purchaseDate: new Date().toISOString(),
  quantity: "2",
};

test("Opens the swagger docs page 200", async () => {
  await supertest(server).post("/api/v0/docs").expect(200);
});

test("Creates a new order 201", async () => {
  await supertest(server)
    .post(`/api/v0/order?productId=${productId}`)
    .send(mockOrder)
    .expect(201)
    .then((res) => {
      expect(res.body).toBeDefined();
      expect(res.body.id).toBeDefined();
      expect(res.body.product_id).toBe(productId);
      expect(res.body.account_id).toBe(accountId);
      expect(res.body.data).toBeDefined();
      expect(res.body.data.quantity).toBe(mockOrder.quantity);
      expect(res.body.data.purchaseDate).toBe(mockOrder.purchaseDate);
      expect(res.body.data.delivered).toBeFalsy();
      expect(res.body.data.shipped).toBeFalsy();
    });
});

test("Creates a new order no order number 400", async () => {
  await supertest(server)
    .post(`/api/v0/order`)
    .send({
      account_id: accountId,
      purchaseDate: new Date().toISOString(),
      quantity: "2",
    })
    .expect(400);
});

test("Creates a new order no purchase date 400", async () => {
  await supertest(server)
    .post(`/api/v0/order`)
    .send({
      product_id: productId,
      account_id: accountId,
      quantity: "2",
    })
    .expect(400);
});

test("Creates a new order quantity 0 400", async () => {
  const badQuantity = mockOrder;
  badQuantity.quantity = "0";
  await supertest(server).post(`/api/v0/order`).send(badQuantity).expect(400);
});

test("Creates a new order quantity 1000 400", async () => {
  const badQuantity = mockOrder;
  badQuantity.quantity = "1000";
  await supertest(server).post(`/api/v0/order`).send(badQuantity).expect(400);
});

test("Creates a new order unknown field 400", async () => {
  await supertest(server)
    .post(`/api/v0/order`)
    .send({
      product_id: productId,
      account_id: accountId,
      purchaseDate: new Date().toISOString(),
      quantity: "2",
      uknown: "123",
    })
    .expect(400);
});

test("Create a new order no account id 400", async () => {
  await supertest(server)
    .post(`/api/v0/order`)
    .send({
      product_id: productId,
      purchaseDate: new Date().toISOString(),
      quantity: "2",
    })
    .expect(400);
});

test("Create a new order bad product id 400", async () => {
  const badProductId = mockOrder;
  badProductId.product_id = "123";
  await supertest(server).post(`/api/v0/order`).send(badProductId).expect(400);
});
