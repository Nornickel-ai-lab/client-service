import { apiClient } from '@/shared/api/client';
import type { QueryResponse } from '@/entities/query/model/types';

export const postQuery = async (text: string): Promise<QueryResponse> => {
  const { data } = await apiClient.post<QueryResponse>('/query', { text });
  return data;
};
