import * as http from 'http';
import supertest from 'supertest';

import { http as rest, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

import requestHandler from './requestHandler';
import { HTTPResponse } from 'puppeteer';

let server: http.Server<
  typeof http.IncomingMessage,
  typeof http.ServerResponse
>;

let error = false;
let wrongRole = false;
const handlers = [
  rest.get(
    `http://${process.env.MICROSERVICE_URL || 'localhost'}:3014/api/v0/admin/accounts`,
    async () => {
      if (error) {
        return new HttpResponse(null, { status: 404 });
      } else {
        return HttpResponse.json(
          [
            {
              id: '81c689b1-b7a7-4100-8b2d-309908b444f1',
              email: 'test@email.com',
              name: 'test account 1',
              role: 'shopper',
              suspended: false,
            },
            {
              id: '81c689b1-b7a7-4100-8b2d-309908b444f2',
              email: 'test@email.com',
              name: 'test account 2',
              role: 'shopper',
              suspended: false,
            },
          ],
          { status: 200 }
        );
      }
    }
  ),
  rest.put(
    `http://${process.env.MICROSERVICE_URL || 'localhost'}:3014/api/v0/admin/requests/someId/approve`,
    async () => {
      if (error) {
        return new HttpResponse(null, { status: 500 });
      } else {
        return HttpResponse.json(
          {
            id: '81c689b1-b7a7-4100-8b2d-309908b444f7',
            email: 'test@email.com',
            name: 'test account 3',
            role: 'vendor',
            suspended: false,
          },
          { status: 200 }
        );
      }
    }
  ),
  rest.get(
    `http://${process.env.MICROSERVICE_URL || 'localhost'}:3014/api/v0/admin/check?someToken`,
    async () => {
      if (error) {
        return new HttpResponse(null, { status: 401 });
      } else if (wrongRole) {
        return HttpResponse.json(
          {
            id: '37a65191-2a4a-46c6-b7e5-d36133132b09',
            role: 'WRONG ROLE',
          },
        );
      }
      else {
        return HttpResponse.json(
          {
            id: '37a65191-2a4a-46c6-b7e5-d36133132b09',
            role: 'admin',
          },
          { status: 200 }
        );
      }
    }
  ),
];

const microServices = setupServer(...handlers);

beforeAll(async () => {
  microServices.listen();
  server = http.createServer(requestHandler);
  server.listen();
});

afterEach(() => {
  error = false;
  microServices.resetHandlers();
});

afterAll(done => {
  microServices.close();
  server.close(done);
});

it('fetches all accounts', async () => {
  await supertest(server)
    .post('/api/graphql')
    .set('Authorization', 'Bearer someToken')
    .send({
      query: 'query GetAccount {account {id name email role suspended}}',
    })
    .expect(200)
    .then(res => {
      console.log(res.body);
      expect(res.body.data).toHaveProperty('account');
      expect(res.body.data.account).toHaveLength(2);
    });
});

it('approve an existing vendor request', async () => {
  await supertest(server)
    .post('/api/graphql')
    .set('Authorization', 'Bearer someToken')
    .send({
      query:
        'mutation approveVendor{approveVendor(VendorId: "someId") {id email name role suspended}}',
    })
    .expect(200)
    .then(res => {
      console.log(res.body);
      expect(res.body.data).toHaveProperty('approveVendor');
      expect(res.body.data.approveVendor).toBeDefined();
    });
});

it('approve an existing vendor request with error', async () => {
  error = true;
  await supertest(server)
    .post('/api/graphql')
    .send({
      query:
        'mutation approveVendor{approveVendor(VendorId: "invalidId") {id email name role suspended}}',
    })
    .expect('Content-Type', /json/)
    .then(res => {
      expect(res).toBeDefined();
      expect(res.body.errors.length).toEqual(1);
    });
});

it('Ill-formatted Authorization Header', async () => {
  await supertest(server)
    .post('/api/graphql')
    .set('Authorization', 'someGarbge token')
    .send({
      query:
        'mutation approveVendor{approveVendor(VendorId: "someId") {id email name role suspended}}',
    })
    .expect(200)
    .then(res => {
      expect(res).toBeDefined();
      expect(res.body.errors.length).toEqual(1);
    });
});

it('Admin Auth Check failed', async () => {
  error = true
  await supertest(server)
    .post('/api/graphql')
    .set('Authorization', 'Bearer someToken')
    .send({
      query:
        'mutation approveVendor{approveVendor(VendorId: "someId") {id email name role suspended}}',
    })
    .expect(200)
    .then(res => {
      expect(res).toBeDefined();
      expect(res.body.errors.length).toEqual(1);
    });
});
it('Fail at returning right role', async () => {
  error = false
  wrongRole = true
  await supertest(server)
    .post('/api/graphql')
    .set('Authorization', 'Bearer someToken')
    .send({
      query:
        'mutation approveVendor{approveVendor(VendorId: "someId") {id email name role suspended}}',
    })
    .expect(200)
    .then(res => {
      expect(res).toBeDefined();
      expect(res.body.errors.length).toEqual(1);
    });
});
