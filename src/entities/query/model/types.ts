import type { AsyncStatus } from '@/shared/types/asyncStatus';

export interface PerformanceMetrics {
  total_time_ms: number;
  search_time_ms: number;
  llm_time_ms: number;
}

export interface SourceItem {
  document_id: string;
  title: string;
  chunk_text: string;
  confidence: number;
  geo: string | null;
  year: number | null;
  document_url: string;
}

export interface QueryResponse {
  query_id: string;
  answer_md: string;
  confidence: number;
  sources: SourceItem[];
  performance: PerformanceMetrics;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  status: AsyncStatus;
  response: QueryResponse | null;
  error: string | null;
}
