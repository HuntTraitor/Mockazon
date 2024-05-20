import supertest from "supertest";
import * as http from "http";

import * as db from "./db";
import app from "../src/app";
import { randomUUID } from "crypto";

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

test("Renders the Swagger UI", async () => {
  await supertest(server)
    .get("/api/v0/docs/")
    .then((res) => {
      expect(res.status).toBe(200);
    });
});

describe("API TEST (SHOPPER) - Login", () => {
  test("Logs in with valid credentials", async () => {
    await supertest(server)
      .post("/api/v0/shopper/login")
      .send({
        email: "shirly@books.com",
        password: "shirlyshopper",
      })
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.accessToken).toBeDefined();
        expect(res.body.id).toBeDefined();
        expect(res.body.name).toBeDefined();
        expect(res.body.role).toBeDefined();
      });
  });

  test("Logs in with valid sub", async () => {
    await supertest(server)
      .post("/api/v0/shopper/login")
      .send({
        sub: "testsub",
      })
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.accessToken).toBeDefined();
        expect(res.body.id).toBeDefined();
        expect(res.body.name).toBeDefined();
        expect(res.body.role).toBeDefined();
      });
  });

  test("Fails to login with invalid credentials", async () => {
    await supertest(server)
      .post("/api/v0/shopper/login")
      .send({
        email: "wrong@email.com",
        password: "wrongpassword",
      })
      .then((res) => {
        expect(res.status).toBe(404);
      });
  });

  test("Fails to login with invalid sub", async () => {
    await supertest(server)
      .post("/api/v0/shopper/login")
      .send({
        sub: "wrongsub",
      })
      .then((res) => {
        expect(res.status).toBe(404);
      });
  });

  test("Fails to login with invalid input", async () => {
    await supertest(server)
      .post("/api/v0/shopper/login")
      .send({
        email: "test@email.com",
      })
      .then((res) => {
        expect(res.status).toBe(400);
      });
  });
});

describe("API TEST (SHOPPER) - Signup", () => {
  test("Signs up with valid credentials", async () => {
    await supertest(server)
      .post("/api/v0/shopper/signup")
      .send({
        email: "test@gmail.com",
        name: "test",
        password: "testpassword",
      })
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.accessToken).toBeDefined();
        expect(res.body.id).toBeDefined();
        expect(res.body.name).toBeDefined();
        expect(res.body.role).toBeDefined();
      });
  });

  test("Signs up with valid sub", async () => {
    await supertest(server)
      .post("/api/v0/shopper/signup")
      .send({
        email: "test2@email.com",
        name: "test2",
        sub: `${randomUUID()}`,
      })
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.accessToken).toBeDefined();
        expect(res.body.id).toBeDefined();
        expect(res.body.name).toBeDefined();
        expect(res.body.role).toBeDefined();
      });
  });

  test("Fails to signup without email", async () => {
    await supertest(server)
      .post("/api/v0/shopper/signup")
      .send({
        email: "test3@email.com",
        name: "test3",
      })
      .then((res) => {
        expect(res.status).toBe(400);
      });
  });

  test("Fails to sign up without name", async () => {
    await supertest(server)
      .post("/api/v0/shopper/signup")
      .send({
        email: "test3@email.com",
        password: "testpassword",
      })
      .then((res) => {
        expect(res.status).toBe(400);
      });
  });

  test("Fails to sign up with sub and password", async () => {
    await supertest(server)
      .post("/api/v0/shopper/signup")
      .send({
        email: "test3@email.com",
        name: "test3",
        sub: `${randomUUID()}`,
        password: "testpassword",
      })
      .then((res) => {
        expect(res.status).toBe(400);
      });
  });

  test("Fails to sign up without password", async () => {
    await supertest(server)
      .post("/api/v0/shopper/signup")
      .send({
        email: "test3@email.com",
        name: "test3",
      })
      .then((res) => {
        expect(res.status).toBe(400);
      });
  });

  test("Fails to sign up with duplicate email", async () => {
    await supertest(server)
      .post("/api/v0/shopper/signup")
      .send({
        email: "test5@email.com",
        name: "test5",
        password: "testpassword",
      })
      .then((res) => {
        expect(res.status).toBe(200);
      });

    await supertest(server)
      .post("/api/v0/shopper/signup")
      .send({
        email: "test5@email.com",
        name: "test5",
        password: "testpassword",
      })
      .then((res) => {
        expect(res.status).toBe(409);
      });
  });
});
