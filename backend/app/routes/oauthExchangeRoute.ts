import { Request, Response } from 'express';
import { exchangeCodeForToken } from '../libs/nylas/nylasAuth';

export const oauthExchangeHandler = async (req: Request, res: Response) => {
  const code = req.query.code;

  if (typeof code !== 'string') {
    res.status(400).send('No authorization code returned from Nylas');
    return;
  }

  try {
    const response = await exchangeCodeForToken(code);

    const { grantId } = response;
    console.log('Grant ID', grantId);

    res.status(200);
  } catch (error) {
    console.error('Error exchanging code for token:', error);
    res.status(500).send('Failed to exchange authorization code for token');
  }
};
