import { apiClient } from '@/shared/api/client';
import type { MlProviderId } from '@/entities/ml/model/types';
import type { QueryFiltersPayload } from '@/entities/query/model/filterTypes';
import type { QueryResponse } from '@/entities/query/model/types';

export const postQuery = async (
  text: string,
  mlProvider: MlProviderId = 'cloud',
  filters?: QueryFiltersPayload,
): Promise<QueryResponse> => {
  const payload: Record<string, unknown> = {
    text,
    ml_provider: mlProvider,
  };
  if (filters) {
    payload.filters = filters;
  }
  const { data } = await apiClient.post<QueryResponse>('/query', payload);
  return data;
};
