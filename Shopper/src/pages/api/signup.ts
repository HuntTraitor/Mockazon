import type { NextApiRequest, NextApiResponse } from 'next';
/**
 * login
 * @param {NextApiRequest} req
 * @param {NextApiResponse} res
 */
export default function signup(req: NextApiRequest, res: NextApiResponse) {
  fetch(
    `http://${process.env.MICROSERVICE_URL || 'localhost'}:3010/api/v0/authenticate/signup`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    }
  )
    .then(response => {
      if (!response.ok) {
        throw response;
      }
      return response.json();
    })
    .then(authenticated => {
      res.status(200).json({ authenticated });
      return;
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: 'Internal server error' });
    });
}
