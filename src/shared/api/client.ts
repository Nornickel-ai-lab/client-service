import axios from 'axios';

import { registerApiErrorInterceptor } from '@/shared/api/errorHandler';
import { env } from '@/shared/config/env';

export const apiClient = axios.create({
  baseURL: env.apiBase,
  headers: {
    'Content-Type': 'application/json',
  },
});

registerApiErrorInterceptor(apiClient);
