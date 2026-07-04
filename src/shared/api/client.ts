import axios from 'axios';

import { registerApiErrorInterceptor } from '@/shared/api/errorHandler';
import { env } from '@/shared/config/env';

const TOKEN_KEY = 'access_token';

export const apiClient = axios.create({
  baseURL: env.apiBase,
  timeout: 600_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

registerApiErrorInterceptor(apiClient);
