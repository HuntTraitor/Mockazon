import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

import { buffer } from 'micro';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-04-10',
});

// needed, don't remove
export const config = {
  api: {
    bodyParser: false,
  },
};

type Order = {
  quantity: string;
  shopper_id: string;
  product_id: string;
  vendor_id: string;
};

let vendorOrderIds: string[];
let shopperOrderId: string;

// https://chatgpt.com/share/6e1f30f1-eb7a-4212-a34e-89be3c97e662

function capitalizeFirstLetter(string: string) {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function getOrders(
  lineItems: Stripe.ApiList<Stripe.LineItem>,
  shopperId: string,
  items: { vendorId: string; productId: string }[]
): Order[] {
  const orders = [];

  // get orders from metadata and lineItems
  for (let i = 0; i < lineItems.data.length; i++) {
    const lineItem = lineItems.data[i];
    const quantity: string = (lineItem.quantity ?? 0)?.toString() as string;
    orders.push({
      quantity,
      shopper_id: shopperId,
      product_id: items[i].productId,
      vendor_id: items[i].vendorId,
    });
  }
  return orders;
}

async function removeProductsFromShoppingCart(
  orders: Order[],
  shopperId: string
) {
  const promises = orders.map(async order => {
    const res = await fetch(
      `http://${process.env.MICROSERVICE_URL || 'localhost'}:3012/api/v0/shoppingCart`,
      {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shopper_id: shopperId,
          product_id: order.product_id,
        }),
      }
    );
    if (!res.ok) {
      throw new Error('Failed to remove product from shopping cart');
    }
    return await res.json();
  });
  return Promise.all(promises)
    .then(shoppingCartItemsRemoved => shoppingCartItemsRemoved)
    .catch(error => {
      console.error(error);
      throw new Error('Failed to remove products from shopping cart');
    });
}

async function createVendorOrdersFromPurchase(
  orders: Order[],
  shopperId: string
) {
  const promises = orders.map(async order => {
    const res = await fetch(
      `http://${process.env.MICROSERVICE_URL || 'localhost'}:3012/api/v0/order?vendorId=${order.vendor_id}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quantity: order.quantity,
          shopper_id: shopperId,
          product_id: order.product_id,
        }),
      }
    );
    if (!res.ok) {
      throw new Error('Failed to create order');
    }
    return await res.json();
  });
  return Promise.all(promises)
    .then(orders => orders)
    .catch(error => {
      console.error(error);
      throw new Error('Failed to create order');
    });
}

function getValue(input?: string | null): string {
  return input ?? '';
}

async function createOrderProducts(
  productIds: string[],
  shopperOrderId: string,
  quantities: number[]
) {
  const promises = productIds.map(async (productId, index) => {
    const res = await fetch(
      `http://${process.env.MICROSERVICE_URL || 'localhost'}:3012/api/v0/order/shopperOrder/orderProduct`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: productId,
          shopper_order_id: shopperOrderId,
          quantity: quantities[index],
        }),
      }
    );
    if (!res.ok) {
      console.log(res);
      throw new Error('Failed to create order product');
    }
    return await res.json();
  });
  return Promise.all(promises)
    .then(orders => orders)
    .catch(error => {
      console.error(error);
      throw new Error('Failed to create order');
    });
}

async function createShopperOrder(
  lineItems: Stripe.ApiList<Stripe.LineItem>,
  productIds: string[],
  shopperId: string,
  session: Stripe.Checkout.Session
) {
  const dateCreated = new Date().toISOString();
  const lineItemsData = lineItems.data;
  const customerDetails = session?.customer_details;
  const address = session?.customer_details?.address;
  const paymentIntent = await stripe.paymentIntents.retrieve(
    session.payment_intent as string
  );
  const paymentMethod = await stripe.paymentMethods.retrieve(
    paymentIntent.payment_method as string
  );
  let subtotal = lineItemsData.reduce(
    (sum: number, item: { amount_subtotal: number }) =>
      sum + item.amount_subtotal,
    0
  );
  // TODO determine what total before tax is? -- maybe factoring in discount
  const paymentCard = paymentMethod.card;
  let tax = lineItemsData.reduce((sum, item) => sum + item.amount_tax, 0);
  tax = tax / 100;
  subtotal = subtotal / 100;
  const total = subtotal + tax;
  let last4 = '';
  let brand = '';
  if (paymentCard) {
    last4 = paymentCard.last4.toString();
    brand = paymentCard.brand.toString();
  }
  const res = await fetch(
    `http://${process.env.MICROSERVICE_URL || 'localhost'}:3012/api/v0/order/shopperOrder?shopperId=${shopperId}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tax: tax,
        total: total,
        shipped: true,
        subtotal: subtotal,
        createdAt: dateCreated,
        delivered: false,
        deliveryTime: new Date(
          new Date(dateCreated).getTime() + 7 * 24 * 60 * 60 * 1000
        ).toISOString(),
        paymentDigits: last4,
        paymentMethod: paymentMethod.type.toString(),
        paymentBrand: capitalizeFirstLetter(brand.toString()),
        shippingAddress: {
          city: getValue(address?.city),
          name: getValue(customerDetails?.name),
          state: getValue(address?.state),
          country: getValue(address?.country),
          postalCode: getValue(address?.postal_code),
          addressLine1: getValue(address?.line1),
        },
      }),
    }
  );
  if (!res.ok) {
    throw new Error('Failed to create shopper order');
  }
  return await res.json();
}

async function createVendorShopperOrder(
  vendorOrderIds: string[],
  shopperOrderId: string
) {
  const promises = vendorOrderIds.map(async vendorOrderId => {
    const res = await fetch(
      `http://${process.env.MICROSERVICE_URL || 'localhost'}:3012/api/v0/order/VendorShopperOrder`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendor_id: vendorOrderId,
          shopper_id: shopperOrderId,
        }),
      }
    );
    if (!res.ok) {
      console.log(res);
      throw new Error(
        'Failed to create a vendor shopper order 😡😡😡😡😡😡😡😡😡'
      );
    }
    return await res.json();
  });
  return await Promise.all(promises).catch(err => {
    console.error(err);
    throw new Error('Failed to create shopper order');
  });
}

// most likely can't be converted to graphql because we don't call this endpoint, only Stripe does
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const buf = await buffer(req);
    const sig = req.headers['stripe-signature'] as string;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        buf,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET as string
      );
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      const msg = err.message;
      console.log(`Error message: ${msg}`);
      res.status(400).send(`Webhook Error: ${msg}`);
      return;
    }

    // successful checkout and payment
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      // Retrieve line items
      let lineItems;
      try {
        lineItems = await stripe.checkout.sessions.listLineItems(session.id);
      } catch (err) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const msg = err.message;
        res.status(400).send(`Error retrieving line items: ${msg}`);
        console.log(`Error retrieving line items: ${msg}`);
        return;
      }

      if (session.metadata === null) {
        res.status(400).send(`Metadata not included`);
        return;
      }

      // TODO send an email to user

      const shopperId = session.metadata.shopperId;
      let itemsFromMetadata;
      // retrieve metadata from session
      try {
        // product and vendor ids of products
        itemsFromMetadata = JSON.parse(session.metadata.items);
      } catch (err) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const msg = err.message;
        res.status(400).send({ message: `Error parsing metadata: ${msg}` });
        console.log(`Error parsing metadata: ${msg}`);
        return;
      }
      const productIds = itemsFromMetadata.map(
        (item: { productId: string; vendorId: string }) => item.productId
      );

      const pendingVendorOrders = getOrders(
        lineItems,
        shopperId,
        itemsFromMetadata
      );

      // create vendor orders
      try {
        const createdOrders = await createVendorOrdersFromPurchase(
          pendingVendorOrders,
          shopperId
        );

        // console.log(createdOrders);
        vendorOrderIds = createdOrders.map(item => item.id);
      } catch (err) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const msg = err.message;
        res.status(500).send(`Error creating orders: ${msg}`);
        console.log(`Error creating orders: ${msg}`);
        return;
      }

      // create order history
      let createdShopperOrder;
      try {
        createdShopperOrder = await createShopperOrder(
          lineItems,
          productIds,
          shopperId,
          session
        );

        shopperOrderId = createdShopperOrder.id;
      } catch (err) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const msg = err.message;
        res.status(500).send(`Error creating order history: ${msg}`);
        console.log(`Error creating order history: ${msg}`);
        return;
      }

      const productQuantities = lineItems.data.map(
        item => item.quantity as number
      );

      // create product_orders
      try {
        const createdProductOrders = await createOrderProducts(
          productIds,
          createdShopperOrder.id,
          productQuantities
        );
        console.log(createdProductOrders);
      } catch (err) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const msg = err.message;
        res.status(500).send(`Error creating product orders: ${msg}`);
        console.log(`Error creating product orders: ${msg}`);
        return;
      }

      try {
        await createVendorShopperOrder(vendorOrderIds, shopperOrderId);
      } catch (err) {
        res
          .status(500)
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          .send(`Error create vendor shopper order: ${err.message}`);
      }

      // Remove item from shopping cart
      try {
        // remove item from shopping cart
        const removedCartItems = await removeProductsFromShoppingCart(
          pendingVendorOrders,
          shopperId
        );
        console.log(removedCartItems);
      } catch (err) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const msg = err.message;
        res.status(500).send(`Error removing shopping cart items: ${msg}`);
        console.log(`Error removing shopping cart items: ${msg}`);
        return;
      }

      console.log(`Checkout Session was successful!`, lineItems);
      res.status(200).json({ message: 'Checkout complete' });
      return;
    }
    res.status(200).json({ message: 'Non checkout session event complete' });
    return;
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
};

export default handler;
