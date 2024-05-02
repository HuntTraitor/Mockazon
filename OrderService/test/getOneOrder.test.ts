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

const postOrder = async (): Promise<string | undefined> => {
  let orderId;
  await supertest(server)
    .post(`/api/v0/order`)
    .send(mockOrder)
    .expect(201)
    .then((res) => {
      orderId = res.body.id;
    });
  return orderId;
};

test("Gets successful order 200", async () => {
  const orderId = await postOrder();
  await supertest(server)
    .get(`/api/v0/order/${orderId}`)
    .expect(200)
    .then((res) => {
      expect(res.body).toBeDefined();
      expect(res.body.id).toBe(orderId);
      expect(res.body.product_id).toBe(productId);
      expect(res.body.account_id).toBe(accountId);
      expect(res.body.data).toBeDefined();
      expect(res.body.data.purchaseDate).toBeDefined();
      expect(res.body.data.quantity).toBe("2");
      expect(res.body.data.delivered).toBeFalsy();
      expect(res.body.data.received).toBeFalsy();
    });
});

test("Gets order not found 404", async () => {
  const orderId = crypto.randomUUID();
  await supertest(server).get(`/api/v0/order/${orderId}`).expect(404);
});

test("Gets order bad orderId 400", async () => {
  await supertest(server).get(`/api/v0/order/badid`).expect(400);
});
