import supertest from "supertest";
import * as http from "http";
import * as db from "./db";
import app from "../src/app";
import { randomUUID } from "crypto";
import { ShippingAddress, Order } from "../src/shopper/index";

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

const exampleOrders = [
  {
    id: "order123",
    createdAt: "2024-05-21T10:00:00Z",
    shippingAddress: {
      name: "John Doe",
      addressLine1: "123 Main St",
      city: "Santa Cruz",
      state: "CA",
      postalCode: "95060",
      country: "USA",
    },
    paymentMethod: "Credit Card",
    subtotal: 100.0,
    totalBeforeTax: 90.0,
    tax: 10.0,
    total: 100.0,
  },
  {
    id: "order456",
    createdAt: "2024-05-21T10:00:00Z",
    shippingAddress: {
      name: "Jane Doe",
      addressLine1: "456 Main St",
      city: "Santa Cruz",
      state: "CA",
      postalCode: "95060",
      country: "USA",
    },
    paymentMethod: "Credit Card",
    subtotal: 200.0,
    totalBeforeTax: 190.0,
    tax: 10.0,
    total: 200.0,
  },
];

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

const compareShippingInfo = (shippingInfo1: ShippingAddress, shippingInfo2: ShippingAddress) => {
  expect(shippingInfo1.addressLine1).toBe(shippingInfo2.addressLine1);
  expect(shippingInfo1.city).toBe(shippingInfo2.city);
  expect(shippingInfo1.state).toBe(shippingInfo2.state);
  expect(shippingInfo1.postalCode).toBe(shippingInfo2.postalCode);
  expect(shippingInfo1.country).toBe(shippingInfo2.country);
};

const validateOrder = (order: Order) => {
  expect(order.id).toBeDefined();
  expect(order.createdAt).toBeDefined();
  expect(order.shippingAddress).toBeDefined();
  expect(order.paymentMethod).toBeDefined();
  expect(order.subtotal).toBeDefined();
  expect(order.totalBeforeTax).toBeDefined();
  expect(order.tax).toBeDefined();
  expect(order.total).toBeDefined();
};

const compareOrder = (order1: Order, order2: Order) => {
  expect(order1.id).toBe(order2.id);
  expect(order1.createdAt).toBe(order2.createdAt);
  compareShippingInfo(order1.shippingAddress, order2.shippingAddress);
  expect(order1.paymentMethod).toBe(order2.paymentMethod);
  expect(order1.subtotal).toBe(order2.subtotal);
  expect(order1.totalBeforeTax).toBe(order2.totalBeforeTax);
  expect(order1.tax).toBe(order2.tax);
  expect(order1.total).toBe(order2.total);
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

describe("API TEST (SHOPPER) - Shipping Info", () => {
  let token: string;
  let otherToken: string;

  beforeAll(async () => {
    await supertest(server)
      .post("/api/v0/shopper/login")
      .send({
        email: "testuser@gmail.com",
        password: "pass",
      })
      .then((res) => {
        token = res.body.accessToken;
      });

    await supertest(server)
      .post("/api/v0/shopper/login")
      .send({
        email: "shirly@books.com",
        password: "shirlyshopper",
      })
      .then((res) => {
        otherToken = res.body.accessToken;
      });
  });

  test("GET /api/v0/shopper/shippinginfo (unauthorized)", async () => {
    await supertest(server)
      .get("/api/v0/shopper/shippinginfo")
      .set("authorization", "invalid")
      .then((res) => {
        expect(res.status).toBe(404);
      });
  });

  test("GET /api/v0/shopper/shippinginfo (authorized)", async () => {
    await supertest(server)
      .get("/api/v0/shopper/shippinginfo")
      .set("authorization", token)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body).toBeDefined();
      });
  });

  test("GET /api/v0/shopper/shippinginfo (authorized) (other user)", async () => {
    await supertest(server)
      .get("/api/v0/shopper/shippinginfo")
      .set("authorization", otherToken)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body).toBeDefined();
      });
  });

  test("POST /api/v0/shopper/shippinginfo (unauthorized) (invalid input)", async () => {
    await supertest(server)
      .post("/api/v0/shopper/shippinginfo")
      .set("authorization", "invalid")
      .send({ shippingInfo: "test" })
      .then((res) => {
        expect(res.status).toBe(400);
      });
  });

  test("POST /api/v0/shopper/shippinginfo (unauthorized) (valid input)", async () => {
    await supertest(server)
      .post("/api/v0/shopper/shippinginfo")
      .set("authorization", "invalid")
      .send({ shippingInfo: exampleShippingInfo[0] })
      .then((res) => {
        expect(res.status).toBe(400);
      });
  });

  test("POST /api/v0/shopper/shippinginfo (authorized) (valid input)", async () => {
    const shippingInfo = await supertest(server)
      .get("/api/v0/shopper/shippinginfo")
      .set("authorization", token)
      .then((res) => {
        return res.body;
      });

    for (let i = 0; i < shippingInfo.length; i++) {
      validateShippingInfo(shippingInfo[i]);
    }

    await supertest(server)
      .post("/api/v0/shopper/shippinginfo")
      .set("authorization", token)
      .send(exampleShippingInfo[0])
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body).toBeDefined();
      });

    const newShippingInfo = await supertest(server)
      .get("/api/v0/shopper/shippinginfo")
      .set("authorization", token)
      .then((res) => {
        return res.body;
      });

    for (let i = 0; i < newShippingInfo.length; i++) {
      validateShippingInfo(newShippingInfo[i]);
    }

    expect(newShippingInfo.length).toBe(shippingInfo.length + 1);
    compareShippingInfo(newShippingInfo[newShippingInfo.length - 1], exampleShippingInfo[0]);
  });

  test("POST /api/v0/shopper/shippinginfo (authorized) (other user)", async () => {
    await supertest(server)
      .post("/api/v0/shopper/shippinginfo")
      .set("authorization", otherToken)
      .send(exampleShippingInfo[1])
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body).toBeDefined();
      });

    const newShippingInfo = await supertest(server)
      .get("/api/v0/shopper/shippinginfo")
      .set("authorization", otherToken)
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
      .post("/api/v0/shopper/shippinginfo")
      .set("authorization", token)
      .send({ shippingInfo: "test" })
      .then((res) => {
        expect(res.status).toBe(400);
      });
  });

  test("Handles error in getShippingInfo (invalid token)", async () => {
    await supertest(server)
      .get("/api/v0/shopper/shippinginfo")
      .set("authorization", "invalid_token")
      .then((res) => {
        expect(res.status).toBe(404);
      });
  });

  test("Handles error in createShippingInfo (invalid token)", async () => {
    await supertest(server)
      .post("/api/v0/shopper/shippinginfo")
      .set("authorization", "invalid_token")
      .send(exampleShippingInfo[0])
      .then((res) => {
        expect(res.status).toBe(404);
      });
  });
});

describe("API TEST (SHOPPER) - Order History", () => {
  let token: string;
  let otherToken: string;

  beforeAll(async () => {
    await supertest(server)
      .post("/api/v0/shopper/login")
      .send({
        email: "testuser@gmail.com",
        password: "pass",
      })
      .then((res) => {
        token = res.body.accessToken;
      });

    await supertest(server)
      .post("/api/v0/shopper/login")
      .send({
        email: "shirly@books.com",
        password: "shirlyshopper",
      })
      .then((res) => {
        otherToken = res.body.accessToken;
      });
  });

  test("GET /api/v0/shopper/orderhistory (unauthorized)", async () => {
    await supertest(server)
      .get("/api/v0/shopper/orderhistory")
      .set("authorization", "invalid")
      .then((res) => {
        expect(res.status).toBe(404);
      });
  });

  test("GET /api/v0/shopper/orderhistory (authorized)", async () => {
    await supertest(server)
      .get("/api/v0/shopper/orderhistory")
      .set("authorization", token)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body).toBeDefined();
      });
  });

  test("GET /api/v0/shopper/orderhistory (authorized) (other user)", async () => {
    await supertest(server)
      .get("/api/v0/shopper/orderhistory")
      .set("authorization", otherToken)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body).toBeDefined();
      });
  });

  test("POST /api/v0/shopper/orderhistory (unauthorized)", async () => {
    await supertest(server)
      .post("/api/v0/shopper/orderhistory")
      .set("authorization", "invalid")
      .send({ orderHistory: "test" })
      .then((res) => {
        expect(res.status).toBe(400);
      });
  });

  test("POST /api/v0/shopper/orderhistory (authorized)", async () => {
    const orderhistory = await supertest(server)
      .get("/api/v0/shopper/orderhistory")
      .set("authorization", token)
      .then((res) => {
        return res.body;
      });
    for (let i = 0; i < orderhistory.length; i++) {
      validateOrder(orderhistory[i]);
    }
    await supertest(server)
      .post("/api/v0/shopper/orderhistory")
      .set("authorization", token)
      .send(exampleOrders[0])
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body).toBeDefined();
      });

    const newOrderhistory = await supertest(server)
      .get("/api/v0/shopper/orderhistory")
      .set("authorization", token)
      .then((res) => {
        return res.body;
      });

    for (let i = 0; i < newOrderhistory.length; i++) {
      validateOrder(newOrderhistory[i]);
    }

    expect(newOrderhistory.length).toBe(orderhistory.length + 1);
    compareOrder(newOrderhistory[newOrderhistory.length - 1], exampleOrders[0]);
  });

  test("POST /api/v0/shopper/orderhistory (authorized) other user", async () => {
    await supertest(server)
      .post("/api/v0/shopper/orderhistory")
      .set("authorization", otherToken)
      .send(exampleOrders[1])
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body).toBeDefined();
      });

    const newOrderhistory = await supertest(server)
      .get("/api/v0/shopper/orderhistory")
      .set("authorization", otherToken)
      .then((res) => {
        return res.body;
      });

    for (let i = 0; i < newOrderhistory.length; i++) {
      validateOrder(newOrderhistory[i]);
    }

    expect(newOrderhistory.length).toBe(1);
    compareOrder(newOrderhistory[0], exampleOrders[1]);
  });

  test("Handles error in getOrderHistory (invalid token)", async () => {
    await supertest(server)
      .get("/api/v0/shopper/orderhistory")
      .set("authorization", "invalid_token")
      .then((res) => {
        expect(res.status).toBe(404);
      });
  });

  test("Handles error in createOrderHistory (invalid token)", async () => {
    await supertest(server)
      .post("/api/v0/shopper/orderhistory")
      .set("authorization", "invalid_token")
      .send(exampleOrders[0])
      .then((res) => {
        expect(res.status).toBe(404);
      });
  });
});
