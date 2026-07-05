import type { AsyncStatus } from '@/shared/types/asyncStatus';

export interface PerformanceMetrics {
  total_time_ms: number;
  search_time_ms: number;
  llm_time_ms: number;
  parse_time_ms?: number;
  embed_time_ms?: number;
  es_time_ms?: number;
  rerank_time_ms?: number;
  synth_time_ms?: number;
}

export interface SourceItem {
  document_id: string;
  title: string;
  chunk_text: string;
  confidence: number;
  geo: string | null;
  year: number | null;
  page_num: number | null;
  page_label: string | null;
  document_url: string;
}

export interface SourceGroupEntry {
  title: string;
  document_id: string | null;
  excerpt: string;
  page_label: string | null;
}

export interface SourceGroupItem {
  title: string;
  summary: string;
  source_titles: string[];
  entries: SourceGroupEntry[];
}

export interface ExpertFacilityItem {
  experts: string[];
  facilities: string[];
}

export interface ContradictionItem {
  id: string;
  topic: string;
  doc_a_title: string;
  doc_b_title: string;
  summary: string;
  confidence: number;
}

export interface QueryResponse {
  query_id: string;
  answer_md: string;
  confidence: number;
  sources: SourceItem[];
  contradictions: ContradictionItem[];
  groups: SourceGroupItem[];
  gaps: string[];
  recommendations: string[];
  related: ExpertFacilityItem;
  ml_provider: string;
  performance: PerformanceMetrics;
}

export interface QueryMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  status: AsyncStatus;
  response: QueryResponse | null;
  error: string | null;
}
