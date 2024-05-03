import handler from '../../src/pages/api/hello';
import { NextApiRequest, NextApiResponse } from 'next'; // Adjust the import path as needed

type Data = {
  name: string;
};

describe('API Route', () => {
  it('responds with JSON containing a name property', async () => {
    // Mock request and response objects
    const req = {} as NextApiRequest;
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    } as unknown as NextApiResponse<Data>;

    // Call the API handler
    await handler(req, res);

    // Check if the response status is set to 200
    expect(res.status).toHaveBeenCalledWith(200);
    // Check if the response JSON contains a name property
    expect(res.json).toHaveBeenCalledWith({ name: 'John Doe' });
  });
});
