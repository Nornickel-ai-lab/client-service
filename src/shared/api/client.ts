import axios from 'axios';

import { registerApiErrorInterceptor } from '@/shared/api/errorHandler';

export const apiClient = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

registerApiErrorInterceptor(apiClient);
