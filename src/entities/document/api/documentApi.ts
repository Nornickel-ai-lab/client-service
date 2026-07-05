import type { MlProviderId } from '@/entities/ml/model/types';
import type {
  DocumentItem,
  DocumentListResponse,
  DocumentUploadResponse,
} from '@/entities/document/model/types';
import { apiClient } from '@/shared/api/client';
import { env } from '@/shared/config/env';

const TOKEN_KEY = 'access_token';

export const buildDocumentFileUrl = (documentId: string): string | null => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) {
    return null;
  }
  const params = new URLSearchParams({ access_token: token });
  return `${env.apiBase}/documents/${documentId}/file?${params.toString()}`;
};

export const fetchDocuments = async (): Promise<DocumentListResponse> => {
  const { data } = await apiClient.get<DocumentListResponse>('/documents');
  return data;
};

export const fetchDocument = async (documentId: string): Promise<DocumentItem> => {
  const { data } = await apiClient.get<DocumentItem>(`/documents/${documentId}`);
  return data;
};

export const uploadDocument = async (
  file: File,
  mlProvider: MlProviderId,
): Promise<DocumentUploadResponse> => {
  const form = new FormData();
  form.append('file', file);
  form.append('ml_provider', mlProvider);
  const { data } = await apiClient.post<DocumentUploadResponse>('/documents/upload', form, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

export const uploadDocumentBatch = async (
  files: File[],
  mlProvider: MlProviderId,
): Promise<DocumentUploadResponse> => {
  const form = new FormData();
  files.forEach((file) => {
    const relativePath = file.webkitRelativePath || file.name;
    form.append('files', file, relativePath);
  });
  form.append('ml_provider', mlProvider);
  const { data } = await apiClient.post<DocumentUploadResponse>('/documents/upload-batch', form, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

export const fetchDocumentBlob = async (
  documentId: string,
  signal?: AbortSignal,
): Promise<Blob> => {
  const { data, headers } = await apiClient.get<Blob>(`/documents/${documentId}/file`, {
    responseType: 'blob',
    signal,
  });
  const contentType = headers['content-type'] ?? data.type;
  if (contentType.includes('application/json')) {
    const text = await data.text();
    const body = JSON.parse(text) as { detail?: string };
    throw new Error(body.detail ?? 'file download failed');
  }
  if (data.size === 0) {
    throw new Error('empty file');
  }
  return data;
};
