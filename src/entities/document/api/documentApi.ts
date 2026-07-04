import type { MlProviderId } from '@/entities/ml/model/types';
import type {
  DocumentItem,
  DocumentListResponse,
  DocumentUploadResponse,
  DocumentVisibility,
} from '@/entities/document/model/types';
import { apiClient } from '@/shared/api/client';

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
  visibility: DocumentVisibility,
  mlProvider: MlProviderId,
): Promise<DocumentUploadResponse> => {
  const form = new FormData();
  form.append('file', file);
  form.append('visibility', visibility);
  form.append('ml_provider', mlProvider);
  const { data } = await apiClient.post<DocumentUploadResponse>('/documents/upload', form, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

export const fetchDocumentBlob = async (documentId: string): Promise<Blob> => {
  const { data } = await apiClient.get<Blob>(`/documents/${documentId}/file`, {
    responseType: 'blob',
  });
  return data;
};
