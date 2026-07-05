import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import {
  fetchDocument,
  fetchDocuments,
  uploadDocument,
  uploadDocumentBatch,
} from '@/entities/document/api/documentApi';
import type { DocumentItem, DocumentUploadResponse } from '@/entities/document/model/types';
import type { MlProviderId } from '@/entities/ml/model/types';
import { parseApiError } from '@/shared/api/errorHandler';

export const useDocumentStore = defineStore('document', () => {
  const items = ref<DocumentItem[]>([]);
  const loaded = ref(false);
  const loading = ref(false);
  const uploadStatus = ref<'idle' | 'process'>('idle');
  const uploadError = ref<string | null>(null);
  const pollTimer = ref<number | null>(null);

  const hasProcessing = computed(() => {
    return items.value.some((item) => {
      return item.status === 'processing' || item.status === 'pending';
    });
  });

  const loadDocuments = async (): Promise<void> => {
    loading.value = true;
    try {
      const response = await fetchDocuments();
      items.value = response.items;
      loaded.value = true;
    } finally {
      loading.value = false;
    }
  };

  const loadDocument = async (documentId: string): Promise<DocumentItem | null> => {
    try {
      return await fetchDocument(documentId);
    } catch {
      return null;
    }
  };

  const afterUpload = async (): Promise<void> => {
    await loadDocuments();
    startPolling();
  };

  const upload = async (file: File, mlProvider: MlProviderId): Promise<DocumentUploadResponse | null> => {
    uploadStatus.value = 'process';
    uploadError.value = null;
    try {
      const response = await uploadDocument(file, mlProvider);
      await afterUpload();
      return response;
    } catch (error) {
      uploadError.value = parseApiError(error);
      return null;
    } finally {
      uploadStatus.value = 'idle';
    }
  };

  const uploadBatch = async (files: File[], mlProvider: MlProviderId): Promise<DocumentUploadResponse | null> => {
    uploadStatus.value = 'process';
    uploadError.value = null;
    try {
      const response = await uploadDocumentBatch(files, mlProvider);
      await afterUpload();
      return response;
    } catch (error) {
      uploadError.value = parseApiError(error);
      return null;
    } finally {
      uploadStatus.value = 'idle';
    }
  };

  const startPolling = (): void => {
    stopPolling();
    pollTimer.value = window.setInterval(async () => {
      if (!hasProcessing.value) {
        stopPolling();
        return;
      }
      await loadDocuments();
    }, 3000);
  };

  const stopPolling = (): void => {
    if (pollTimer.value !== null) {
      window.clearInterval(pollTimer.value);
      pollTimer.value = null;
    }
  };

  return {
    items,
    loaded,
    loading,
    uploadStatus,
    uploadError,
    hasProcessing,
    loadDocuments,
    loadDocument,
    upload,
    uploadBatch,
    startPolling,
    stopPolling,
  };
});
