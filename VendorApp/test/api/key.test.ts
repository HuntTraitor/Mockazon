import http from 'http';
import supertest from 'supertest';

import { http as rest, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

import requestHandler from './requestHandler';
import { TramRounded } from '@mui/icons-material';

let server: http.Server<
  typeof http.IncomingMessage,
  typeof http.ServerResponse
>;
let error = false;
let errorPut = false;
let errorPost = false;

const handlers = [
  rest.get(
    `http://${process.env.MICROSERVICE_URL || 'localhost'}:3014/api/v0/vendor/check`,
    async () => {
      if (error) {
        return new HttpResponse(null, { status: 401 });
      } else {
        return HttpResponse.json(
          {
            id: '37a65191-2a4a-46c6-b7e5-d36133132b09',
            role: 'vendor',
          },
          { status: 200 }
        );
      }
    }
  ),
  rest.get(
    `http://${process.env.MICROSERVICE_URL || 'localhost'}:3013/api/v0/key/:vendor_id`,
    async ({ params }) => {
      if (error) {
        return new HttpResponse(null, { status: 401 });
      } else {
        return HttpResponse.json(
          [
            {
              key: 'some key',
              vendor_id: 'some id',
              active: true,
              blacklisted: false,
            },
            {
              key: 'some key2',
              vendor_id: 'some id',
              active: false,
              blacklisted: false,
            },
          ],
          { status: 200 }
        );
      }
    }
  ),
  rest.put(
    `http://${process.env.MICROSERVICE_URL || 'localhost'}:3013/api/v0/key/:key/active`,
    async () => {
      if (errorPut) {
        return new HttpResponse(undefined, { status: 401 });
      } else {
        return HttpResponse.json(
          {
            key: 'some key',
            vendor_id: 'some id',
            active: true,
            blacklisted: false,
          },
          { status: 200 }
        );
      }
    }),
  rest.post(
    `http://${process.env.MICROSERVICE_URL || 'localhost'}:3013/api/v0/key/:vendor_id/request`,
    async () => {
      if (errorPost) {
        return new HttpResponse(undefined, { status: 401 });
      } else {
        return HttpResponse.json(
          {
            key: 'some key',
            vendor_id: 'some id',
            active: true,
            blacklisted: false,
          },
          { status: 200 }
        );
      }
    }),
];

const microServices = setupServer(...handlers);

beforeAll(async () => {
  microServices.listen();
  server = http.createServer(requestHandler);
  server.listen();
});

afterEach(() => {
  microServices.resetHandlers();
});

afterAll(done => {
  microServices.close();
  server.close(done);
});

test('Successful key retrieval', async () => {
  error = false;
  await supertest(server)
    .post('/api/graphql')
    .set('Authorization', 'Bearer someToken')
    .send({
      query: `query key {keys {key, vendor_id, active, blacklisted}}`,
    })
    .expect('Content-Type', /json/)
    .then(res => {
      expect(res).toBeDefined();
      expect(res.body.data).toBeDefined();
      expect(res.body.data.keys).toBeDefined();
      expect(res.body.data.keys.length).toEqual(2);
    });
});

test('Error key retrieval', async () => {
  error = true;
  await supertest(server)
    .post('/api/graphql')
    .set('Authorization', 'Bearer someToken')
    .send({
      query: `query key {keys {key, vendor_id, active, blacklisted}}`,
    })
    .expect('Content-Type', /json/)
    .then(res => {
      expect(res).toBeDefined();
      expect(res.body.errors).toBeDefined();
      expect(res.body.data).toBeNull();
    });
});

test('Successful set active status', async () => {
  error = false;
  await supertest(server)
    .post('/api/graphql')
    .set('Authorization', 'Bearer someToken')
    .send({
      query: `mutation key {setActiveStatus (apiKey: "some id") {key, vendor_id, blacklisted, active}}`,
    })
    .expect('Content-Type', /json/)
    .then(res => {
      expect(res).toBeDefined();
      expect(res.body.data).toBeDefined();
      expect(res.body.data.setActiveStatus.key).toBeDefined();
    });
});
test('Unsuccessful set active status', async () => {
  errorPut = true;
  await supertest(server)
    .post('/api/graphql')
    .set('Authorization', 'Bearer someToken')
    .send({
      query: `mutation key {setActiveStatus (apiKey: "some id") {key, vendor_id, blacklisted, active}}`,
    })
    .expect('Content-Type', /json/)
    .then(res => {
      expect(res).toBeDefined();
      expect(res.error).toBeDefined();
    });
});

test('Successful API Key Request', async () => {
  errorPost = false;
  await supertest(server)
    .post('/api/graphql')
    .set('Authorization', 'Bearer someToken')
    .send({
      query: `mutation key {postAPIKeyRequest {key, vendor_id, blacklisted, active}}`,
    })
    .expect('Content-Type', /json/)
    .then(res => {
      expect(res).toBeDefined();
      expect(res.body.data).toBeDefined();
      expect(res.body.data.postAPIKeyRequest.key).toBeDefined();
    });
});

test('Unsuccessful API Key Request', async () => {
  errorPost = false;
  await supertest(server)
    .post('/api/graphql')
    .set('Authorization', 'Bearer someToken')
    .send({
      query: `mutation key {postAPIKeyRequest {key, vendor_id, blacklisted, active}}`,
    })
    .expect('Content-Type', /json/)
    .then(res => {
      expect(res).toBeDefined();
      expect(res.error).toBeDefined();
    });
});

test('No Auth Header Provided', async () => {
  errorPost = false;
  await supertest(server)
    .post('/api/graphql')
    // .set('Authorization', 'Bearer someToken')
    .send({
      query: `mutation key {postAPIKeyRequest {key, vendor_id, blacklisted, active}}`,
    })
    .expect('Content-Type', /json/)
    .then(res => {
      expect(res).toBeDefined();
      expect(res.error).toBeDefined();
    });
});

test('Garbage Value for Auth Header', async () => {
  errorPost = false;
  await supertest(server)
    .post('/api/graphql')
    .set('Authorization', 'some garbageToken')
    .send({
      query: `mutation key {postAPIKeyRequest {key, vendor_id, blacklisted, active}}`,
    })
    .expect('Content-Type', /json/)
    .then(res => {
      expect(res).toBeDefined();
      expect(res.error).toBeDefined();
    });
});
