import type { NextApiRequest, NextApiResponse } from 'next';
/**
 * login
 * @param {NextApiRequest} req
 * @param {NextApiResponse} res
 */
export default function login(req: NextApiRequest, res: NextApiResponse) {
  const { sub } = req.body;
  fetch(
    `http://${process.env.MICROSERVICE_URL || 'localhost'}:3010/api/v0/authenticate/user?sub=${sub}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
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
