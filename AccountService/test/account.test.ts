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

describe("API TEST (ACCOUNT)", () => {
  const userOne = "81c689b1-b7a7-4100-8b2d-309908b444f5";
  const userTwo = "81c689b1-b7a7-4100-8b2d-309908b444f6";

  test("GET /api/v0/account", async () => {
    await supertest(server)
      .get("/api/v0/account")
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body).toEqual([
          {
            id: userOne,
            email: "test1@email.com",
            name: "test account 1",
            role: "test",
            username: "testaccount1",
            suspended: "false",
          },
          {
            id: userTwo,
            email: "test2@email.com",
            name: "test account 2",
            role: "test",
            username: "testaccount2",
            suspended: "false",
          },
        ]);
      });
  });

  test("PUT /api/v0/account/{id}/suspend", async () => {
    // suspend userOne
    await supertest(server)
      .put(`/api/v0/account/${userTwo}/suspend`)
      .then((res) => {
        expect(res.status).toBe(204);
      });

    // assert account is suspended
    await supertest(server)
      .get("/api/v0/account")
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body).toEqual([
          {
            id: userOne,
            email: "test1@email.com",
            name: "test account 1",
            role: "test",
            username: "testaccount1",
            suspended: "false",
          },
          {
            id: userTwo,
            email: "test2@email.com",
            name: "test account 2",
            role: "test",
            username: "testaccount2",
            suspended: "true",
          },
        ]);
      });
  });

  test("PUT /api/v0/account/{id}/resume", async () => {
    // resume userOne
    await supertest(server)
      .put(`/api/v0/account/${userTwo}/resume`)
      .then((res) => {
        expect(res.status).toBe(204);
      });

    // assert account is resumed
    await supertest(server)
      .get("/api/v0/account")
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body).toEqual([
          {
            id: userOne,
            email: "test1@email.com",
            name: "test account 1",
            role: "test",
            username: "testaccount1",
            suspended: "false",
          },
          {
            id: userTwo,
            email: "test2@email.com",
            name: "test account 2",
            role: "test",
            username: "testaccount2",
            suspended: "false",
          },
        ]);
      });
  });
});
