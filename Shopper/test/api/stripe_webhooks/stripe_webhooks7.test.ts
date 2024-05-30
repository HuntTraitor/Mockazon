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

let vendorPostPasses = true;
let orderProductsPostPasses = true;
let shopperPostPasses = true;
let deletePasses = true;
let vendorShopperOrderPasses = true;

beforeEach(() => {
  vendorPostPasses = true;
  orderProductsPostPasses = true;
  shopperPostPasses = true;
  deletePasses = true;
});

const handlers = [
  rest.post(
    `http://${process.env.MICROSERVICE_URL || 'localhost'}:3012/api/v0/order`,
    async () => {
      if (vendorPostPasses) {
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
  rest.post(
    `http://${process.env.MICROSERVICE_URL || 'localhost'}:3012/api/v0/order/shopperOrder`,
    async () => {
      if (shopperPostPasses) {
        return HttpResponse.json(
          {
            id: '123',
            createdAt: '2020-01-01T00:00:00.000Z',
            shipped: true,
            delivered: false,
            deliveryTime: '2020-01-01T00:00:00.000Z',
            paymentMethod: 'card',
            paymentDigits: '1234',
            shippingAddress: {
              name: 'John Doe',
              addressLine1: '123 Main St',
              city: 'New York',
              state: 'NY',
              postalCode: '10001',
              country: 'US',
            },
            subtotal: 0,
            totalBeforeTax: 0,
            tax: 0,
            total: 0,
            products: [],
          },
          { status: 200 }
        );
      } else {
        return HttpResponse.json(
          { message: 'Shopper order error' },
          { status: 500 }
        );
      }
    }
  ),
  rest.post(
    `http://${process.env.MICROSERVICE_URL || 'localhost'}:3012/api/v0/order/shopperOrder/orderProduct`,
    async () => {
      if (orderProductsPostPasses) {
        return HttpResponse.json(
          {
            product_id: '123',
            shopper_order_id: '123',
          },
          { status: 200 }
        );
      } else {
        return HttpResponse.json(
          { message: 'Create order product error' },
          { status: 500 }
        );
      }
    }
  ),
  rest.post(
    `http://${process.env.MICROSERVICE_URL || 'localhost'}:3012/api/v0/order/VendorShopperOrder`,
    async () => {
      if (vendorShopperOrderPasses) {
        return HttpResponse.json(
          {
            vendor_id: '123',
            shopper_id: '123',
          },
          { status: 200 }
        );
      } else {
        return HttpResponse.json(
          { message: 'Failed to create vendor shopper order' },
          { status: 500 }
        );
      }
    }
  ),
  rest.delete(
    `http://${process.env.MICROSERVICE_URL || 'localhost'}:3012/api/v0/shoppingCart`,
    async () => {
      if (deletePasses) {
        return HttpResponse.json(
          {
            id: '123',
            url: 'http://localhost:3000/checkout',
          },
          { status: 200 }
        );
      } else {
        return HttpResponse.json(
          { message: 'Delete shopping cart error' },
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
              customer_details: {
                email: 'email',
                address: 'address',
              },
              payment_intent: 'paymentintent',
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
              { id: 'item-1' },
              { id: 'item-2' },
            ],
          }),
        },
      },
      paymentIntents: {
        retrieve: jest.fn().mockResolvedValue({
          amount_subtotal: 0,
          amount_tax: 0,
          amount_total: 0,
          payment_method: 'card',
        }),
      },
      products: {
        retrieve: jest.fn().mockResolvedValue({
          metadata: {
            vendorId: '123',
            productId: '123',
          },
        }),
      },
      paymentMethods: {
        retrieve: jest.fn().mockResolvedValue({
          card: {
            last4: '1234',
            brand: '',
          },
          type: 'card',
        }),
      },
    };
  });
});

describe('/api/stripe_webhooks', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return 500 for an invalid webhook event', async () => {
    shopperPostPasses = false;
    const result = await supertest(server)
      .post('/api/stripe_webhooks')
      .set('stripe-signature', 'test-signature')
      .send('test-body')
    expect(result.status).toBe(500);
    expect(result.text).toContain('Error creating order history');
  });

});
