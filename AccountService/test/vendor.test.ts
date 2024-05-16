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

describe("API TEST (VENDOR) - Authorization", () => {
  test("POST /api/v0/vendor/login", async () => {
    await supertest(server)
      .post("/api/v0/vendor/login")
      .send({ email: "victor@books.com", password: "victorvendor" })
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.accessToken).toBeDefined();
      });
  });

  test("POST /api/v0/vendor/login (unauthorized)", async () => {
    await supertest(server)
      .post("/api/v0/vendor/login")
      .send({ email: "invalid@books.com", password: "invalid" })
      .then((res) => {
        expect(res.status).toBe(401);
      });
  });

  test("POST /api/v0/vendor/signup", async () => {
    await supertest(server)
      .post("/api/v0/vendor/signup")
      .send({
        email: "newuser@books.com",
        name: "New User",
        password: "newuser",
      })
      .then((res) => {
        expect(res.status).toBe(201);
        expect(res.body.id).toBeDefined();
        expect(res.body.email).toBe("newuser@books.com");
        expect(res.body.name).toBe("New User");
        expect(res.body.role).toBe("vendor");
        expect(res.body.suspended).toBe(false);
      });
  });

  test("POST /api/v0/vendor/signup (existing user)", async () => {
    await supertest(server)
      .post("/api/v0/vendor/signup")
      .send({
        email: "newuser@books.com",
        name: "New User",
        password: "newuser",
      })
      .then((res) => {
        expect(res.status).toBe(400);
      });
  });
});
