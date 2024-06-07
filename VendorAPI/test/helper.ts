import * as http from 'http';
import app from '../src/app';
import { http as rest, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { randomUUID } from 'crypto';

let server: http.Server<
  typeof http.IncomingMessage,
  typeof http.ServerResponse
>;

class MockMicroservices {
  unauthorized = false;
  orderShipped = false;
  orderDelivered = false;
  orderNotFound = false;
  orderOwnership = true;
  orderError = false;
  productError = false;
  orderQuantity = 1;
  server = setupServer(
    rest.get(
      `http://${process.env.MICROSERVICE_URL || 'localhost'}:3012/api/v0/order`,
      async () => {
        if (this.orderError) {
          return new HttpResponse(null, { status: 500 });
        }
        return HttpResponse.json([
          {
            id: '28d37910-66ae-4da2-b8f6-9d7e48c5dd57',
            vendor_id: 'd712b8f2-a57f-4989-9703-5e527457f893',
            product_id: 'cb335e0f-50bd-41f9-8ba2-00f1f6a429da',
            shopper_id: 'b1dff137-2dc5-4397-925f-b70c3946c533',
            data: {
              purchaseDate: Date.now(),
              quantity: this.orderQuantity,
              shipped: this.orderShipped,
              delivered: this.orderDelivered,
            },
          },
        ]);
      }
    ),
    rest.get(
      `http://${process.env.MICROSERVICE_URL || 'localhost'}:3013/api/v0/key/validate`,
      async () => {
        if (this.unauthorized) {
          return new HttpResponse(null, { status: 401 });
        } else {
          return HttpResponse.json({
            vendor_id: 'd712b8f2-a57f-4989-9703-5e527457f893',
          });
        }
      }
    ),
    rest.get(
      `http://${process.env.MICROSERVICE_URL || 'localhost'}:3012/api/v0/order/*`,
      async () => {
        if (this.orderOwnership) {
          return HttpResponse.json({
            vendor_id: 'd712b8f2-a57f-4989-9703-5e527457f893',
          });
        } else if (this.orderError) {
          return new HttpResponse(null, { status: 500 });
        } else {
          return HttpResponse.json({
            vendor_id: 'd712b8f2-a57f-4989-9703-5e527457f894', // not matching
          });
        }
      }
    ),
    rest.put(
      `http://${process.env.MICROSERVICE_URL || 'localhost'}:3012/api/v0/order/*`,
      async ({ request }) => {
        if (this.orderError) {
          return new HttpResponse(null, { status: 500 });
        }
        const url = new URL(request.url);
        const quantity = url.searchParams.get('quantity');
        const shipped = url.searchParams.get('shipped');
        const delivered = url.searchParams.get('delivered');

        return HttpResponse.json(
          {
            id: '28d37910-66ae-4da2-b8f6-9d7e48c5dd57',
            vendor_id: 'd712b8f2-a57f-4989-9703-5e527457f893',
            product_id: 'cb335e0f-50bd-41f9-8ba2-00f1f6a429da',
            shopper_id: 'b1dff137-2dc5-4397-925f-b70c3946c533',
            data: {
              purchaseDate: Date.now(),
              quantity: quantity || this.orderQuantity,
              shipped: shipped || this.orderShipped,
              delivered: delivered || this.orderDelivered,
            },
          },
          { status: 200 }
        );
      }
    ),
    rest.get(
      `http://${process.env.MICROSERVICE_URL || 'localhost'}:3011/api/v0/product*`,
      async ({ request }) => {
        if (this.productError) {
          return new HttpResponse(null, { status: 500 });
        }
        const url = new URL(request.url);
        const vendorId = url.searchParams.get('vendorId');
        const active = url.searchParams.get('active');
        const pageSize = url.searchParams.get('pageSize');

        const responseProducts = Array.from(
          { length: parseInt(pageSize ?? '') || 1 },
          () => ({
            id: randomUUID(),
            vendor_id: vendorId || 'd712b8f2-a57f-4989-9703-5e527457f893',
            active: active || true,
            created: Date.now(),
            posted: Date.now(),
            data: {
              name: 'Product',
              brand: 'Brand',
              image: 'https://example.com/image.jpg',
              price: '100.00',
              rating: '5',
              description: 'Description',
              deliveryDate: '2022-01-01',
            },
          })
        );

        return HttpResponse.json(responseProducts);
      }
    ),
    rest.post(
      `http://${process.env.MICROSERVICE_URL || 'localhost'}:3011/api/v0/product*`,
      async ({ request }) => {
        if (this.productError) {
          return new HttpResponse(null, { status: 500 });
        }
        const url = new URL(request.url);
        const vendorId = url.searchParams.get('vendorId');
        const bodyText = await request.text();
        const product = JSON.parse(bodyText);
        return HttpResponse.json({
          id: randomUUID(),
          vendor_id: vendorId || 'd712b8f2-a57f-4989-9703-5e527457f893',
          active: true,
          created: Date.now(),
          posted: Date.now(),
          data: product,
        });
      }
    )
  );
}

const mockMicroservices = new MockMicroservices();

beforeAll(async () => {
  mockMicroservices.server.listen({ onUnhandledRequest: 'bypass' });
  server = http.createServer(app);
  server.listen();
});

afterAll(done => {
  mockMicroservices.server.close();
  server.close(done);
});

afterEach(() => {
  mockMicroservices.unauthorized = false;
  mockMicroservices.orderShipped = false;
  mockMicroservices.orderDelivered = false;
  mockMicroservices.orderQuantity = 1;
  mockMicroservices.orderNotFound = false;
  mockMicroservices.orderOwnership = true;
  mockMicroservices.orderError = false;
  mockMicroservices.server.resetHandlers();
});

export { server, mockMicroservices };
