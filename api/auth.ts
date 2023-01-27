import type { VercelRequest, VercelResponse } from '@vercel/node';
import { allowCors } from '../middleware/allowCors';

const handler = async (request: VercelRequest, response: VercelResponse) => {
  const { code, state } = request.query;

  const jsonResponse = await fetch(
    `https://github.com/login/oauth/access_token?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&code=${code}&state=${state}`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    },
  )
    .then((response) => response.json());

  const { access_token: token } = jsonResponse;

  return response.status(200).json({
    token,
  });
};


export default allowCors(handler);