import type { AxiosError, AxiosInstance } from 'axios';

import { ui } from '@/shared/config/ui';

interface ApiErrorBody {
  detail?: string;
}

const axiosIsError = (error: unknown): error is AxiosError<ApiErrorBody> => {
  return typeof error === 'object' && error !== null && 'isAxiosError' in error;
};

export const parseApiError = (error: unknown): string => {
  if (!axiosIsError(error)) {
    return ui.statusFailed;
  }
  const detail = error.response?.data?.detail;
  if (typeof detail === 'string' && detail.length > 0) {
    return detail;
  }
  if (error.message) {
    return error.message;
  }
  return ui.statusFailed;
};

export const registerApiErrorInterceptor = (instance: AxiosInstance): void => {
  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error: unknown) => {
      return Promise.reject(error);
    },
  );
};
