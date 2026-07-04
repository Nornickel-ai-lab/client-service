import type { AxiosError, AxiosInstance } from 'axios';

interface ApiErrorBody {
  detail?: string;
}

export const parseApiError = (error: unknown): string => {
  if (!axiosIsError(error)) {
    return uiFallback();
  }
  const detail = error.response?.data?.detail;
  if (typeof detail === 'string' && detail.length > 0) {
    return detail;
  }
  if (error.message) {
    return error.message;
  }
  return uiFallback();
};

const axiosIsError = (error: unknown): error is AxiosError<ApiErrorBody> => {
  return typeof error === 'object' && error !== null && 'isAxiosError' in error;
};

const uiFallback = (): string => 'Ошибка';

export const registerApiErrorInterceptor = (instance: AxiosInstance): void => {
  instance.interceptors.response.use(
    (response) => response,
    (error: unknown) => Promise.reject(error),
  );
};
