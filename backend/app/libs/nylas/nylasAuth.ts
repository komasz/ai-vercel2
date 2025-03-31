import { nylas, nylasConfig } from './nylasClient';

export function getAuthUrl(email: string): string {
  return nylas.auth.urlForOAuth2({
    clientId: nylasConfig.clientId,
    provider: 'google',
    redirectUri: nylasConfig.callbackUri,
    loginHint: email,
    accessType: 'offline',
  });
}

export async function exchangeCodeForToken(code: string) {
  return await nylas.auth.exchangeCodeForToken({
    clientId: nylasConfig.clientId,
    redirectUri: nylasConfig.callbackUri,
    code,
  });
}
