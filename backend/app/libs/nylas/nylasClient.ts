import Nylas from 'nylas';
import dotenv from 'dotenv';
dotenv.config();

// Configure Nylas with your client ID and secret (ensure these are set in your environment)
export const nylasConfig = {
  clientId: process.env.NYLAS_CLIENT_ID as string,
  callbackUri: 'http://localhost:3001/oauth/exchange',
  apiKey: process.env.NYLAS_API_KEY as string,
  apiUri: process.env.NYLAS_API_URI as string,
  grantId: process.env.NYLAS_GRANT_ID as string,
};

export const nylas = new Nylas(nylasConfig);
