import { env } from '@/shared/config/env';

export const buildEsaLoginUrl = (): string => {
  const callback = `${window.location.origin}${env.authCallbackPath}`;
  const url = new URL(env.esaLoginUrl);
  url.searchParams.set('redirect_uri', callback);
  return url.toString();
};

export const redirectToEsaLogin = (): void => {
  window.location.assign(buildEsaLoginUrl());
};
