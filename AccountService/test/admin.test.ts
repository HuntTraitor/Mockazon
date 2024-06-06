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

export type Account = {
  id: string;
  email: string;
  name: string;
  role: string;
  suspended: boolean;
};

describe("API TEST (ADMIN) - Authorization", () => {
  test("POST /api/v0/admin/login", async () => {
    await supertest(server)
      .post("/api/v0/admin/login")
      .send({ email: "anna@books.com", password: "annaadmin" })
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.accessToken).toBeDefined();
      });
  });

  test("POST /api/v0/admin/login (unauthorized)", async () => {
    await supertest(server)
      .post("/api/v0/admin/login")
      .send({ email: "invalid@books.com", password: "invalid" })
      .then((res) => {
        expect(res.status).toBe(401);
      });
  });
});

describe("API TEST (ADMIN) - General", () => {
  const userOne = "81c689b1-b7a7-4100-8b2d-309908b444f5";
  const userTwo = "81c689b1-b7a7-4100-8b2d-309908b444f6";
  const requestApprove = "81c689b1-b7a7-4100-8b2d-309908b444f7";
  const requestDeny = "81c689b1-b7a7-4100-8b2d-309908b444f8";

  test("GET /api/v0/admin/accounts", async () => {
    await supertest(server)
      .get("/api/v0/admin/accounts")
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: userOne,
              email: "shopper@email.com",
              name: "shopper account 1",
              role: "shopper",
              suspended: false,
            }),
            expect.objectContaining({
              email: "victor@books.com",
              id: "81c689b1-b7a7-4100-8b2d-309908b444f3",
              name: "Victor",
              role: "vendor",
              suspended: false,
            }),
            expect.objectContaining({
              email: "shirly@books.com",
              id: "81c689b1-b7a7-4100-8b2d-309908b444f1",
              name: "Shirly",
              role: "shopper",
              suspended: false,
            }),
            expect.objectContaining({
              id: userTwo,
              email: "vendor@email.com",
              name: "vendor account 1",
              role: "vendor",
              suspended: false,
            }),
          ]),
        );
      });
  });

  test("GET /api/v0/admin/requests", async () => {
    await supertest(server)
      .get("/api/v0/admin/requests")
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body).toEqual([
          {
            id: requestDeny,
            email: "request2@email.com",
            name: "request account 2",
            role: "vendor",
            suspended: false,
          },
          {
            id: requestApprove,
            email: "request1@email.com",
            name: "request account 1",
            role: "vendor",
            suspended: false,
          },
        ]);
      });
  });

  test("PUT /api/v0/admin/account/{id}/suspend vendor", async () => {
    // suspend userTwo
    await supertest(server)
      .put(`/api/v0/admin/account/${userTwo}/suspend`)
      .then((res) => {
        expect(res.status).toBe(200);
      });

    // assert account is suspended
    await supertest(server)
      .get("/api/v0/admin/accounts")
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: userOne,
              email: "shopper@email.com",
              name: "shopper account 1",
              role: "shopper",
              suspended: false,
            }),
            expect.objectContaining({
              id: userTwo,
              email: "vendor@email.com",
              name: "vendor account 1",
              role: "vendor",
              suspended: true,
            }),
            expect.objectContaining({
              email: "victor@books.com",
              id: "81c689b1-b7a7-4100-8b2d-309908b444f3",
              name: "Victor",
              role: "vendor",
              suspended: false,
            }),
            expect.objectContaining({
              email: "shirly@books.com",
              id: "81c689b1-b7a7-4100-8b2d-309908b444f1",
              name: "Shirly",
              role: "shopper",
              suspended: false,
            }),
          ]),
        );
      });
  });

  test("PUT /api/v0/admin/account/{id}/suspend shopper", async () => {
    // suspend userTwo
    await supertest(server)
      .put(`/api/v0/admin/account/${userOne}/suspend`)
      .then((res) => {
        expect(res.status).toBe(200);
      });

    // assert account is suspended
    await supertest(server)
      .get("/api/v0/admin/accounts")
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: userOne,
              email: "shopper@email.com",
              name: "shopper account 1",
              role: "shopper",
              suspended: true,
            }),
            expect.objectContaining({
              id: userTwo,
              email: "vendor@email.com",
              name: "vendor account 1",
              role: "vendor",
              suspended: true,
            }),
            expect.objectContaining({
              email: "victor@books.com",
              id: "81c689b1-b7a7-4100-8b2d-309908b444f3",
              name: "Victor",
              role: "vendor",
              suspended: false,
            }),
            expect.objectContaining({
              email: "shirly@books.com",
              id: "81c689b1-b7a7-4100-8b2d-309908b444f1",
              name: "Shirly",
              role: "shopper",
              suspended: false,
            }),
          ]),
        );
      });
  });

  test("PUT /api/v0/admin/account/{id}/resume vendor", async () => {
    // resume userTwo
    await supertest(server)
      .put(`/api/v0/admin/account/${userTwo}/resume`)
      .then((res) => {
        expect(res.status).toBe(200);
      });

    // assert account is resumed
    await supertest(server)
      .get("/api/v0/admin/accounts")
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: userOne,
              email: "shopper@email.com",
              name: "shopper account 1",
              role: "shopper",
              suspended: true,
            }),
            expect.objectContaining({
              id: userTwo,
              email: "vendor@email.com",
              name: "vendor account 1",
              role: "vendor",
              suspended: false,
            }),
            expect.objectContaining({
              email: "victor@books.com",
              id: "81c689b1-b7a7-4100-8b2d-309908b444f3",
              name: "Victor",
              role: "vendor",
              suspended: false,
            }),
            expect.objectContaining({
              email: "shirly@books.com",
              id: "81c689b1-b7a7-4100-8b2d-309908b444f1",
              name: "Shirly",
              role: "shopper",
              suspended: false,
            }),
          ]),
        );
      });
  });

  test("PUT /api/v0/admin/account/{id}/resume shopper", async () => {
    // resume userTwo
    await supertest(server)
      .put(`/api/v0/admin/account/${userOne}/resume`)
      .then((res) => {
        expect(res.status).toBe(200);
      });

    // assert account is resumed
    await supertest(server)
      .get("/api/v0/admin/accounts")
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: userOne,
              email: "shopper@email.com",
              name: "shopper account 1",
              role: "shopper",
              suspended: false,
            }),
            expect.objectContaining({
              id: userTwo,
              email: "vendor@email.com",
              name: "vendor account 1",
              role: "vendor",
              suspended: false,
            }),
            expect.objectContaining({
              email: "victor@books.com",
              id: "81c689b1-b7a7-4100-8b2d-309908b444f3",
              name: "Victor",
              role: "vendor",
              suspended: false,
            }),
            expect.objectContaining({
              email: "shirly@books.com",
              id: "81c689b1-b7a7-4100-8b2d-309908b444f1",
              name: "Shirly",
              role: "shopper",
              suspended: false,
            }),
          ]),
        );
      });
  });

  // Admin Approve
  test("PUT /api/v0/admin/{id}/approve", async () => {
    await supertest(server)
      .put(`/api/v0/admin/requests/${requestApprove}/approve`)
      .then((res) => {
        expect(res.status).toBe(200);
      });

    // assert account is resumed
    await supertest(server)
      .get("/api/v0/admin/accounts")
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              email: "request1@email.com",
              name: "request account 1",
              role: "vendor",
              suspended: false,
            }),
          ]),
        );
      });
  });

  // Admin Reject
  test("PUT /api/v0/admin/{id}/reject", async () => {
    await supertest(server)
      .put(`/api/v0/admin/requests/${requestDeny}/reject`)
      .then((res) => {
        expect(res.status).toBe(200);
      });

    // assert account is resumed
    await supertest(server)
      .get("/api/v0/admin/accounts")
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body).toEqual(
          expect.not.arrayContaining([
            expect.objectContaining({
              email: "request2@email.com",
              name: "request account 2",
              role: "vendor",
              suspended: false,
            }),
          ]),
        );
      });
  });
});

describe("API TEST (ADMIN) - Error Handling", () => {
  const invalidID = "91c689b1-b7a7-4100-8b2d-309908b444f2";

  test("PUT /api/v0/admin/account/{id}/suspend (not found)", async () => {
    await supertest(server)
      .put(`/api/v0/admin/account/${invalidID}/suspend`)
      .then((res) => {
        expect(res.status).toBe(500);
      });
  });

  test("PUT /api/v0/admin/account/{id}/resume (not found)", async () => {
    await supertest(server)
      .put(`/api/v0/admin/account/${invalidID}/resume`)
      .then((res) => {
        expect(res.status).toBe(500);
      });
  });

  test("PUT /api/v0/admin/{id}/approve (not found)", async () => {
    await supertest(server)
      .put(`/api/v0/admin/requests/${invalidID}/approve`)
      .then((res) => {
        expect(res.status).toBe(500);
      });
  });
});

describe("API TEST (ADMIN) - Check", () => {
  let token: string;

  beforeAll(async () => {
    await supertest(server)
      .post("/api/v0/admin/login")
      .send({ email: "anna@books.com", password: "annaadmin" })
      .then((res) => {
        expect(res.body.accessToken).toBeDefined();
        token = res.body.accessToken;
      });
  });

  test("GET /api/v0/admin/check (authorized)", async () => {
    await supertest(server)
      .get(`/api/v0/admin/check?accessToken=${token}`)
      .then((res) => {
        expect(res.status).toBe(200);
      });
  });

  test("GET /api/v0/admin/check (unauthorized)", async () => {
    await supertest(server)
      .get("/api/v0/admin/check?accessToken=invalid")
      .then((res) => {
        expect(res.status).toBe(401);
      });
  });

  test("GET /api/v0/admin/check (invalid input)", async () => {
    await supertest(server)
      .get("/api/v0/admin/check")
      .then((res) => {
        expect(res.status).toBe(400);
      });
  });
});
