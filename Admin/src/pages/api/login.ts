import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * @param {NextApiRequest} req
 * @param {NextApiResponse} res
 */
export default function login(req: NextApiRequest, res: NextApiResponse) {
  const { email, password } = req.body;
  fetch(
    `http://${process.env.MICROSERVICE_URL || 'localhost'}:3014/api/v0/admin/login`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email, password: password }),
    }
  )
    .then(response => {
      if (!response.ok) {
        throw response;
      }
      return response.json();
    })
    .then(authenticated => {
      console.log(authenticated);
      res.status(200).json({ authenticated });
      return;
    })
    .catch(err => {
      console.log('401', err);
      res.status(401).json({ message: 'Invalid login' });
    });
}
