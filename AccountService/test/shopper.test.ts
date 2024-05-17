import supertest from "supertest";
import * as http from "http";

import * as db from "./db";
import app from "../src/app";

let server: http.Server<
  typeof http.IncomingMessage,
  typeof http.ServerResponse
>;

beforeAll(async () => {
  server = http.createServer(app);
  server.listen();
  return db.reset();
});

afterAll((done) => {
  db.shutdown();
  server.close(done);
});

test("Renders the Swagger UI", async () => {
  await supertest(server)
    .get("/api/v0/docs/")
    .then((res) => {
      expect(res.status).toBe(200);
    });
});

describe("API TEST (SHOPPER) - Authorization", () => {
  test("POST /api/v0/shopper/signup", async () => {
    await supertest(server)
      .post("/api/v0/shopper/signup")
      .send({ email: "test@email.com", name: "test", sub: "password" })
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.accessToken).toBeDefined();
      });

    await supertest(server)
      .get("/api/v0/shopper/login?sub=password")
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.accessToken).toBeDefined();
      });
  });

  test("POST /api/v0/shopper/login (unauthorized)", async () => {
    await supertest(server)
      .get("/api/v0/shopper/login?sub=invalid")
      .then((res) => {
        expect(res.status).toBe(400);
      });
  });

  // test("POST /api/v0/shopper/signup (duplicate)", async () => {
  //   await supertest(server)
  //     .post("/api/v0/shopper/signup")
  //     .send({ email: "testemail.com", name: "test", sub: "password" })
  //     .then((res) => {
  //       expect(res.status).toBe(409);
  //     });
  // });
});
