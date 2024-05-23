// https://www.youtube.com/watch?v=F4-HicJx3o8
import Stripe from 'stripe';
import { NextApiRequest, NextApiResponse } from 'next';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

// TODO this entire endpoint needs to be converted to graphQL
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    try {
      let { sessionId } = req.query;
      sessionId = sessionId as string;
      if (!sessionId) return;
      // if (!sessionId.startsWith('cs_')) {
      //   throw Error('Incorrect Checkout Session ID.')
      // }
      const checkoutSession = await stripe.checkout.sessions.retrieve(
        sessionId,
        {
          expand: ['payment_intent', 'line_items.data.price.product'],
        }
      );
      return res.status(200).json(checkoutSession);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Internal server error';
      return res.status(500).json({ statusCode: 500, message: errorMessage });
    }
  }

  res.setHeader('Allow', 'POST');
  res.status(405).end('Method Not Allowed');
  return;
};

export default handler;
