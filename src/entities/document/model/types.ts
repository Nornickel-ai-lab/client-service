export type DocumentStatus = 'pending' | 'processing' | 'done' | 'failed';

export interface DocumentItem {
  id: string;
  title: string;
  filename: string;
  status: DocumentStatus;
  error_message: string | null;
  created_at: string;
}

export interface DocumentListResponse {
  items: DocumentItem[];
}

export interface UploadBatchInfo {
  source: string;
  queued: number;
  skipped: number;
  document_ids: string[];
  skip_notes: string[];
}

export interface DocumentUploadResponse {
  id: string;
  status: string;
  batch?: UploadBatchInfo | null;
}
