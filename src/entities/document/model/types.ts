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

export interface DocumentUploadResponse {
  id: string;
  status: string;
}
