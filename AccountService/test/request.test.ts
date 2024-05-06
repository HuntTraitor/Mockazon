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

describe("API TEST (REQUEST)", () => {
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

  test("GET /api/v0/request (No current requests)", async () => {
    // no requests
    await supertest(server)
      .get("/api/v0/request")
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body).toEqual([]);
      });
  });

  test("PUT /api/v0/request/{id}/request", async () => {
    // request userOne
    await supertest(server)
      .put(`/api/v0/request/${userOne}/request`)
      .then((res) => {
        expect(res.status).toBe(204);
      });

    // request userTwo
    await supertest(server)
      .put(`/api/v0/request/${userTwo}/request`)
      .then((res) => {
        expect(res.status).toBe(204);
      });

    // assert request exists
    await supertest(server)
      .get("/api/v0/request")
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

  test("PUT /api/v0/request/{id}/(approve + reject)", async () => {
    // approve userOne
    await supertest(server)
      .put(`/api/v0/request/${userOne}/approve`)
      .then((res) => {
        expect(res.status).toBe(204);
      });

    // reject userTwo
    await supertest(server)
      .put(`/api/v0/request/${userTwo}/reject`)
      .then((res) => {
        expect(res.status).toBe(204);
      });

    // assert requests are removed and userOne is now a vendor
    await supertest(server)
      .get("/api/v0/request")
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body).toEqual([]);
      });

    await supertest(server)
      .get("/api/v0/account")
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body).toEqual([
          {
            id: userTwo,
            email: "test2@email.com",
            name: "test account 2",
            role: "test",
            username: "testaccount2",
            suspended: "false",
          },
          {
            id: userOne,
            email: "test1@email.com",
            name: "test account 1",
            role: "vendor",
            username: "testaccount1",
            suspended: "false",
          },
        ]);
      });
  });
});
