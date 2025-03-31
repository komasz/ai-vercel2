import { Request, Response } from 'express';
import { getAuthUrl } from '../libs/nylas/nylasAuth';

export const nylasAuthHandler = (req: Request, res: Response) => {
  const email =
    typeof req.query.email !== 'string'
      ? 'chatai@performance-media.pl'
      : req.query.email;
  const authUrl = getAuthUrl(email);

  res.redirect(authUrl);
};
