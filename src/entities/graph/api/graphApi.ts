import type { GraphResponse } from '@/entities/graph/model/types';
import { apiClient } from '@/shared/api/client';

export const fetchGraph = async (limit = 400): Promise<GraphResponse> => {
  const { data } = await apiClient.get<GraphResponse>('/graph', {
    params: { limit },
  });
  return data;
};
