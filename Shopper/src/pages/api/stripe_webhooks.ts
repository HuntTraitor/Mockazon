// pages/api/stripe_webhooks.ts

import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { buffer } from 'micro';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-04-10',
});

export const config = {
  api: {
    bodyParser: false,
  },
};

// https://chatgpt.com/share/6e1f30f1-eb7a-4212-a34e-89be3c97e662
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
      console.log(`❌ Error message: ${msg}`);
      res.status(400).send(`Webhook Error: ${msg}`);
      return;
    }
    let session;
    switch (event.type) {
    case 'checkout.session.completed':
      session = event.data.object as Stripe.Checkout.Session;

      // Retrieve line items
      try {
        const lineItems = await stripe.checkout.sessions.listLineItems(
          session.id
        );
        console.log(`Checkout Session was successful!`, lineItems);
        if (session.metadata === null) {
          res.status(400).send(`Metadata not included`);
          return;
        }

        // send an email to user
        const shopperId = session.metadata.shopperId;

        const idsOfProductsPurchased = JSON.parse(session.metadata.itemIds);
        // for each id:

        // create a new order internally

        // remove item from shopping cart
        console.log(idsOfProductsPurchased, shopperId);
      } catch (err) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const msg = err.message;
        res.status(400).send(`❌ Error retrieving line items: ${msg}`);
        console.log(`❌ Error retrieving line items: ${msg}`);
        return;
      }
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    res.status(200).json({ received: true });
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
};

export default handler;
