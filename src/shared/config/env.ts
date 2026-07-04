export const env = {
  apiBase: '/api/v1',
  esaLoginUrl: import.meta.env.VITE_ESA_LOGIN_URL ?? 'http://localhost:8081/login',
  authCallbackPath: '/auth/callback',
} as const;
