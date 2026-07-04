import { apiClient } from '@/shared/api/client';
import type { MlProviderId } from '@/entities/ml/model/types';
import type { QueryResponse } from '@/entities/query/model/types';

export const postQuery = async (
  text: string,
  mlProvider: MlProviderId = 'cloud',
): Promise<QueryResponse> => {
  const { data } = await apiClient.post<QueryResponse>('/query', {
    text,
    ml_provider: mlProvider,
  });
  return data;
};
