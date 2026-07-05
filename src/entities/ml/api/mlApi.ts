import { apiClient } from '@/shared/api/client';
import type { MlBulkJobResponse, MlProviderId, MlProvidersResponse } from '@/entities/ml/model/types';

export const fetchMlProviders = async (): Promise<MlProvidersResponse> => {
  const { data } = await apiClient.get<MlProvidersResponse>('/ml/providers');
  return data;
};

export const startReindexAll = async (mlProvider: MlProviderId): Promise<MlBulkJobResponse> => {
  const { data } = await apiClient.post<MlBulkJobResponse>('/ml/reindex', {
    ml_provider: mlProvider,
  });
  return data;
};

export const startSeedMaterials = async (mlProvider: MlProviderId): Promise<MlBulkJobResponse> => {
  const { data } = await apiClient.post<MlBulkJobResponse>('/ml/seed-materials', {
    ml_provider: mlProvider,
  });
  return data;
};

export const startBulkIngest = async (mlProvider: MlProviderId): Promise<MlBulkJobResponse> => {
  const { data } = await apiClient.post<MlBulkJobResponse>('/ml/bulk-ingest', {
    ml_provider: mlProvider,
  });
  return data;
};
