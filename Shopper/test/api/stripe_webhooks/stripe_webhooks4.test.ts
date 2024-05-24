import http from 'http';
import supertest from 'supertest';

import { http as rest, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

import requestHandler from '../requestHandler';

let server: http.Server<
  typeof http.IncomingMessage,
  typeof http.ServerResponse
>;

const getPasses = true;
const postPasses = true;

const handlers = [
  rest.get(
    `http://${process.env.MICROSERVICE_URL || 'localhost'}:3012/api/v0/shoppingCart`,
    async () => {
      if (getPasses) {
        return HttpResponse.json(
          [
            {
              id: '123',
              product_id: '123',
              shopper_id: '123',
              vendor_id: '123',
              data: { quantity: '5' },
            },
          ],
          { status: 200 }
        );
      } else {
        return HttpResponse.json({ message: 'Login error' }, { status: 500 });
      }
    }
  ),
  rest.post(
    `http://${process.env.MICROSERVICE_URL || 'localhost'}:3012/api/v0/stripeCheckout`,
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
        return HttpResponse.json({ message: 'Login error' }, { status: 500 });
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
                itemIds: JSON.stringify([1, 2, 3]),
                shopperId: '12345',
              },
            },
          },
        }),
      },
      checkout: {
        sessions: {},
      },
    };
  });
});

describe('/api/stripe_webhooks', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return 400 unable to retrieve line items', async () => {
    await supertest(server)
      .post('/api/stripe_webhooks')
      .set('stripe-signature', 'test-signature')
      .send('test-body')
      .expect(400);
  });
});
