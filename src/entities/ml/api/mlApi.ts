import { apiClient } from '@/shared/api/client';
import type { MlProvidersResponse } from '@/entities/ml/model/types';

export const fetchMlProviders = async (): Promise<MlProvidersResponse> => {
  const { data } = await apiClient.get<MlProvidersResponse>('/ml/providers');
  return data;
};
