import type { QueryResponse } from '@/entities/query/model/types';

export const normalizeQueryResponse = (raw: QueryResponse): QueryResponse => {
  return {
    ...raw,
    sources: (raw.sources ?? []).map((source) => ({
      ...source,
      page_label: source.page_label ?? null,
    })),
    contradictions: raw.contradictions ?? [],
    groups: (raw.groups ?? []).map((group) => ({
      ...group,
      entries: group.entries ?? [],
    })),
    gaps: raw.gaps ?? [],
    recommendations: raw.recommendations ?? [],
    related: raw.related ?? { experts: [], facilities: [] },
    performance: raw.performance ?? {
      total_time_ms: 0,
      search_time_ms: 0,
      llm_time_ms: 0,
    },
  };
};
