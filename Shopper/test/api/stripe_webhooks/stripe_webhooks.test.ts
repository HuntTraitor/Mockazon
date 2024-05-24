import http from 'http';
import supertest from 'supertest';

import { http as rest, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

import requestHandler from '../requestHandler';

// these are in multiple files due to mocking only working once per file
// if you can fix it, then we can consolidate files
// but harrison recommended this if not

let server: http.Server<
  typeof http.IncomingMessage,
  typeof http.ServerResponse
>;

let postPasses = true;

const handlers = [
  rest.post(
    `http://${process.env.MICROSERVICE_URL || 'localhost'}:3012/api/v0/order?`,
    async () => {
      if (postPasses) {
        return HttpResponse.json(
          {
            id: '123',
            url: 'http://localhost:3000/checkout',
          },
          { status: 200 }
        );
      } else {
        return HttpResponse.json(
          { message: 'Create order error' },
          { status: 500 }
        );
      }
    }
  ),
];

const microServices = setupServer(...handlers);

beforeAll(async () => {
  microServices.listen({ onUnhandledRequest: 'bypass' });
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

// Mock the buffer method from 'micro'
jest.mock('micro', () => ({
  buffer: jest.fn(),
}));

jest.mock('stripe', () => {
  const actualStripe = jest.requireActual('stripe');
  return jest.fn().mockImplementation((apiKey: string, config: object) => {
    const stripeInstance = new actualStripe(apiKey, config);
    return {
      ...stripeInstance,
      webhooks: {
        constructEvent: jest.fn().mockReturnValue({
          id: 'mock-event-id',
          type: 'checkout.session.completed',
          object: 'event',
          created: Date.now(),
          data: {
            object: {
              id: '123',
              metadata: {
                items: JSON.stringify([
                  {
                    productId: '123',
                    vendorId: '123',
                  },
                  {
                    productId: '123',
                    vendorId: '123',
                  },
                ]),
                shopperId: '12345',
              },
            },
          },
        }),
      },
      checkout: {
        sessions: {
          listLineItems: jest.fn().mockResolvedValue({
            data: [
              { id: 'item-1', quantity: 1 },
              { id: 'item-2', quantity: 1 },
            ],
          }),
        },
      },
    };
  });
});

describe('/api/stripe_webhooks', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return 200 for a valid webhook event', async () => {
    await supertest(server)
      .post('/api/stripe_webhooks')
      .set('stripe-signature', 'test-signature')
      .send('test-body')
      .expect(200);
  });

  test('should return 500 for a failed create order', async () => {
    postPasses = false;
    await supertest(server)
      .post('/api/stripe_webhooks')
      .set('stripe-signature', 'test-signature')
      .send('test-body')
      .expect(500);
  });

  test('should return 405 for non-POST requests', async () => {
    await supertest(server)
      .get('/api/stripe_webhooks')
      .expect(405, 'Method Not Allowed')
      .expect('Allow', 'POST');
  });
});
