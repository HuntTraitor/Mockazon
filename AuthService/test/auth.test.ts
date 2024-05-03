/* Assignment 3 */ // FIXME: Credit better
import * as http from "http";
import supertest from "supertest";

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

export interface Member {
  email: string;
  password: string;
  name: string;
}

const anna: Member = {
  email: "anna@mockazon.com",
  password: "annaadmin",
  name: "Anna Admin",
};

const bob: Member = {
  email: "bob@mockazon.com",
  password: "bobshopper",
  name: "Bob Shopper",
};

const molly: Member = {
  email: "molly@mockazon.com",
  password: "mollyvendor",
  name: "Molly Vendor",
};

async function loginAs(member: Member): Promise<string | undefined> {
  let accessToken;
  await supertest(server)
    .post("/api/v0/authenticate")
    .send({ email: member.email, password: member.password })
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.accessToken).toBeDefined();
      expect(res.body.name).toBe(member.name);
      accessToken = res.body.accessToken;
    });
  return accessToken;
}

test("Renders the Swagger UI", async () => {
  await supertest(server)
    .get("/api/v0/docs/")
    .then((res) => {
      expect(res.status).toBe(200);
    });
});

test("Handles non-existent routes", async () => {
  await supertest(server).get("/api/v0/doesnotexist").expect(500);
});

test("Cannot login with invalid credentials", async () => {
  await supertest(server)
    .post("/api/v0/authenticate")
    .send({ email: anna.email, password: "wrongpassword" })
    .expect(401);
});

test("Can login as all roles", async () => {
  await loginAs(anna);
  await loginAs(bob);
  await loginAs(molly);
});

test("Can check access token", async () => {
  const accessToken = await loginAs(anna);
  await supertest(server)
    .get("/api/v0/authenticate")
    .query({ accessToken })
    .expect(200)
    .then((res) => {
      expect(res.body.id).toBeDefined();
      expect(res.body.role).toBe("admin");
    });
});

test("Rejects invalid access token", async () => {
  const accessToken = randomUUID();
  await supertest(server)
    .get("/api/v0/authenticate")
    .query({ accessToken })
    .then((res) => {
      expect(res.status).toBe(401);
    });
});

test("Rejects on no access token", async () => {
  await supertest(server).get("/api/v0/authenticate").expect(400);
});

test("Wrong Credentials", async () => {
  const result = await supertest(server).get(
    "/api/v0/authenticate/user?sub=123",
  );
  expect(result.status).toBe(404);
});
