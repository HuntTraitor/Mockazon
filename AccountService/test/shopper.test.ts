import supertest from "supertest";
import * as http from "http";
import * as db from "./db";
import app from "../src/app";
import { randomUUID } from "crypto";
import { ShippingAddress } from "../src/shopper/index";

let server: http.Server<
  typeof http.IncomingMessage,
  typeof http.ServerResponse
>;

beforeAll(async () => {
  server = http.createServer(app);
  server.listen();
  return await db.reset();
}, 30000);

afterAll((done) => {
  db.shutdown();
  server.close(done);
});

const exampleShippingInfo = [
  {
    name: "John Doe",
    addressLine1: "123 Main St",
    city: "Santa Cruz",
    state: "CA",
    postalCode: "95060",
    country: "USA",
  },
  {
    name: "Jane Doe",
    addressLine1: "456 Main St",
    city: "Santa Cruz",
    state: "CA",
    postalCode: "95060",
    country: "USA",
  },
];

const validateShippingInfo = (shippingInfo: ShippingAddress) => {
  expect(shippingInfo.addressLine1).toBeDefined();
  expect(shippingInfo.city).toBeDefined();
  expect(shippingInfo.state).toBeDefined();
  expect(shippingInfo.postalCode).toBeDefined();
  expect(shippingInfo.country).toBeDefined();
};

const compareShippingInfo = (
  shippingInfo1: ShippingAddress,
  shippingInfo2: ShippingAddress,
) => {
  expect(shippingInfo1.addressLine1).toBe(shippingInfo2.addressLine1);
  expect(shippingInfo1.city).toBe(shippingInfo2.city);
  expect(shippingInfo1.state).toBe(shippingInfo2.state);
  expect(shippingInfo1.postalCode).toBe(shippingInfo2.postalCode);
  expect(shippingInfo1.country).toBe(shippingInfo2.country);
};

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

describe("API TEST (SHOPPER) - Check", () => {
  let token: string;

  beforeAll(async () => {
    await supertest(server)
      .post("/api/v0/shopper/login")
      .send({
        email: "testuser@gmail.com",
        password: "pass",
      })
      .then((res) => {
        expect(res.body.accessToken).toBeDefined();
        token = res.body.accessToken;
      });
  });

  test("GET /api/v0/shopper/check (authorized)", async () => {
    await supertest(server)
      .get(`/api/v0/shopper/check?accessToken=${token}`)
      .then((res) => {
        expect(res.status).toBe(200);
      });
  });

  test("GET /api/v0/shopper/check (unauthorized)", async () => {
    await supertest(server)
      .get("/api/v0/shopper/check?accessToken=invalid")
      .then((res) => {
        expect(res.status).toBe(401);
      });
  });

  test("GET /api/v0/shopper/check (invalid input)", async () => {
    await supertest(server)
      .get("/api/v0/shopper/check")
      .then((res) => {
        expect(res.status).toBe(400);
      });
  });
});

describe("API TEST (SHOPPER) - Shipping Info", () => {
  let id: string;
  let otherId: string;

  beforeAll(async () => {
    await supertest(server)
      .post("/api/v0/shopper/login")
      .send({
        email: "testuser@gmail.com",
        password: "pass",
      })
      .then((res) => {
        expect(res.body.id).toBeDefined();
        id = res.body.id;
      });

    await supertest(server)
      .post("/api/v0/shopper/login")
      .send({
        email: "shirly@books.com",
        password: "shirlyshopper",
      })
      .then((res) => {
        expect(res.body.id).toBeDefined();
        otherId = res.body.id;
      });
  });

  test("GET /api/v0/shopper/shippinginfo (unauthorized)", async () => {
    await supertest(server)
      .get(`/api/v0/shopper/shippinginfo?userId=invalid`)
      .then((res) => {
        expect(res.status).toBe(404);
      });
  });

  test("GET /api/v0/shopper/shippinginfo (authorized)", async () => {
    await supertest(server)
      .get(`/api/v0/shopper/shippinginfo?userId=${id}`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body).toBeDefined();
      });
  });

  test("GET /api/v0/shopper/shippinginfo (authorized) (other user)", async () => {
    await supertest(server)
      .get(`/api/v0/shopper/shippinginfo?userId=${otherId}`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body).toBeDefined();
      });
  });

  test("POST /api/v0/shopper/shippinginfo (unauthorized) (invalid input)", async () => {
    await supertest(server)
      .post("/api/v0/shopper/shippinginfo")
      .send({ shippingInfo: "test" })
      .then((res) => {
        expect(res.status).toBe(400);
      });
  });

  test("POST /api/v0/shopper/shippinginfo (unauthorized) (valid input)", async () => {
    await supertest(server)
      .post("/api/v0/shopper/shippinginfo")
      .send({ shippingInfo: exampleShippingInfo[0] })
      .then((res) => {
        expect(res.status).toBe(400);
      });
  });

  test("POST /api/v0/shopper/shippinginfo (authorized) (valid input)", async () => {
    const shippingInfo = await supertest(server)
      .get(`/api/v0/shopper/shippinginfo?userId=${id}`)
      .then((res) => {
        expect(res.status).toBe(200);
        return res.body;
      });

    for (let i = 0; i < shippingInfo.length; i++) {
      validateShippingInfo(shippingInfo[i]);
    }

    await supertest(server)
      .post(`/api/v0/shopper/shippinginfo?userId=${id}`)
      .send(exampleShippingInfo[0])
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body).toBeDefined();
      });

    const newShippingInfo = await supertest(server)
      .get(`/api/v0/shopper/shippinginfo?userId=${id}`)
      .then((res) => {
        expect(res.status).toBe(200);
        return res.body;
      });

    for (let i = 0; i < newShippingInfo.length; i++) {
      validateShippingInfo(newShippingInfo[i]);
    }

    expect(newShippingInfo.length).toBe(shippingInfo.length + 1);
    compareShippingInfo(
      newShippingInfo[newShippingInfo.length - 1],
      exampleShippingInfo[0],
    );
  });

  test("POST /api/v0/shopper/shippinginfo (authorized) (other user)", async () => {
    await supertest(server)
      .post(`/api/v0/shopper/shippinginfo?userId=${otherId}`)
      .send(exampleShippingInfo[1])
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body).toBeDefined();
      });

    const newShippingInfo = await supertest(server)
      .get(`/api/v0/shopper/shippinginfo?userId=${otherId}`)
      .then((res) => {
        return res.body;
      });

    for (let i = 0; i < newShippingInfo.length; i++) {
      validateShippingInfo(newShippingInfo[i]);
    }

    expect(newShippingInfo.length).toBe(1);
    compareShippingInfo(newShippingInfo[0], exampleShippingInfo[1]);
  });

  test("POST /api/v0/shopper/shippinginfo (authorized) (invalid input)", async () => {
    await supertest(server)
      .post(`/api/v0/shopper/shippinginfo?userId=${id}`)
      .send({ shippingInfo: "test" })
      .then((res) => {
        expect(res.status).toBe(400);
      });
  });

  test("Handles error in getShippingInfo (invalid userId)", async () => {
    await supertest(server)
      .get("/api/v0/shopper/shippinginfo?userId=invalid_userid")
      .then((res) => {
        expect(res.status).toBe(404);
      });
  });

  test("Handles error in createShippingInfo (invalid userId)", async () => {
    await supertest(server)
      .post("/api/v0/shopper/shippinginfo?userId=invalid_userid")
      .send(exampleShippingInfo[0])
      .then((res) => {
        expect(res.status).toBe(404);
      });
  });
});
