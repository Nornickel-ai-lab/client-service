import { apiClient } from '@/shared/api/client';

export interface AnalyticsOverview {
  documents_total: number;
  documents_done: number;
  queries_total: number;
  glossary_terms: number;
  graph_nodes: Record<string, number>;
  coverage_by_geo: Record<string, number>;
  contradictions: number;
}

export const fetchAnalyticsOverview = async (): Promise<AnalyticsOverview> => {
  const { data } = await apiClient.get<AnalyticsOverview>('/analytics/overview');
  return data;
};
