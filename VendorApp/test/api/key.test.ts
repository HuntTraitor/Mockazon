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
        console.log('an error occurred')
        return new HttpResponse(undefined, { status: 401 });
      } else {
        console.log('SUP')
        console.log(error)
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
  //error = false;
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
<<<<<<< Updated upstream
      console.log(res.body);
=======
>>>>>>> Stashed changes
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


test('Successful set status', async () => {
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

test('Unsuccessful set status', async () => {
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
