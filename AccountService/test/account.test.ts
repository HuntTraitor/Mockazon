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

describe("API TEST", () => {
  test("GET /api/v0/account", async () => {
    await supertest(server)
      .get("/api/v0/account")
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body).toEqual([
          {
            id: "81c689b1-b7a7-4100-8b2d-309908b444f5",
            data: {
              email: "test@email.com",
              name: "test account",
              role: "test",
              username: "testaccount",
            },
          },
        ]);
      });
  });
});
