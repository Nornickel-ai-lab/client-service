import type { AxiosError, AxiosInstance } from 'axios';

import { ui } from '@/shared/config/ui';
import { redirectToEsaLogin } from '@/shared/lib/authRedirect';

interface ApiErrorBody {
  detail?: string;
}

const axiosIsError = (error: unknown): error is AxiosError<ApiErrorBody> => {
  return typeof error === 'object' && error !== null && 'isAxiosError' in error;
};

const readDetailFromBody = (body: unknown): string | null => {
  if (typeof body === 'object' && body !== null && 'detail' in body) {
    const detail = (body as ApiErrorBody).detail;
    if (typeof detail === 'string' && detail.length > 0) {
      return detail;
    }
  }
  return null;
};

export const parseApiError = (error: unknown): string => {
  if (!axiosIsError(error)) {
    return ui.statusFailed;
  }
  if (error.response?.status === 413) {
    return ui.uploadTooLarge;
  }
  const detail = readDetailFromBody(error.response?.data);
  if (detail) {
    return detail;
  }
  if (error.message) {
    return error.message;
  }
  return ui.statusFailed;
};

export const parseBlobApiError = async (error: unknown): Promise<string> => {
  if (!axiosIsError(error)) {
    return ui.statusFailed;
  }
  const data = error.response?.data;
  if (data instanceof Blob) {
    try {
      const detail = readDetailFromBody(JSON.parse(await data.text()) as ApiErrorBody);
      if (detail) {
        return detail;
      }
    } catch {
      // fall through to generic handling
    }
  }
  return parseApiError(error);
};

export const registerApiErrorInterceptor = (instance: AxiosInstance): void => {
  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error: unknown) => {
      if (axiosIsError(error) && error.response?.status === 401) {
        localStorage.removeItem('access_token');
        if (window.location.pathname !== '/auth/callback') {
          redirectToEsaLogin();
        }
      }
      return Promise.reject(error);
    },
  );
};
