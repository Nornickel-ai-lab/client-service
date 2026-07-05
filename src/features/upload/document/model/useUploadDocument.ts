import { ref } from 'vue';
import { storeToRefs } from 'pinia';

import { useDocumentStore } from '@/entities/document/model/documentStore';
import type { DocumentUploadResponse } from '@/entities/document/model/types';
import { useMlProviderStore } from '@/entities/ml/model/mlProviderStore';
import {
  collectDirectoryFiles,
  fileRelativePath,
  isSingleUploadFile,
  type UploadMode,
} from '@/shared/lib/uploadFormats';
import { ui } from '@/shared/config/ui';

export const useUploadDocument = () => {
  const documentStore = useDocumentStore();
  const mlStore = useMlProviderStore();
  const { uploadStatus, uploadError } = storeToRefs(documentStore);
  const mode = ref<UploadMode>('file');
  const selectedFile = ref<File | null>(null);
  const selectedDirectoryFiles = ref<File[]>([]);
  const fileError = ref<string | null>(null);

  const resetSelection = (): void => {
    selectedFile.value = null;
    selectedDirectoryFiles.value = [];
    fileError.value = null;
  };

  const setMode = (value: UploadMode): void => {
    mode.value = value;
    resetSelection();
  };

  const validateFile = (file: File | null): boolean => {
    if (!file) {
      fileError.value = ui.fieldRequired;
      return false;
    }
    if (!isSingleUploadFile(file.name)) {
      fileError.value = ui.uploadUnsupportedFormat;
      return false;
    }
    fileError.value = null;
    return true;
  };

  const setFile = (file: File | null): void => {
    mode.value = 'file';
    selectedDirectoryFiles.value = [];
    selectedFile.value = file;
    if (file) {
      validateFile(file);
    } else {
      fileError.value = null;
    }
  };

  const setDirectoryFiles = (files: FileList | File[]): void => {
    mode.value = 'directory';
    selectedFile.value = null;
    const ingestible = collectDirectoryFiles(files);
    selectedDirectoryFiles.value = ingestible;
    if (ingestible.length === 0) {
      fileError.value = ui.uploadDirectoryEmpty;
      return;
    }
    fileError.value = null;
  };

  const selectionLabel = (): string => {
    if (mode.value === 'directory') {
      if (selectedDirectoryFiles.value.length === 0) {
        return '';
      }
      const sample = fileRelativePath(selectedDirectoryFiles.value[0]);
      if (selectedDirectoryFiles.value.length === 1) {
        return sample;
      }
      return ui.uploadDirectorySelected
        .replace('{count}', String(selectedDirectoryFiles.value.length))
        .replace('{sample}', sample);
    }
    return selectedFile.value?.name ?? '';
  };

  const submit = async (): Promise<DocumentUploadResponse | null> => {
    if (mode.value === 'directory') {
      if (selectedDirectoryFiles.value.length === 0) {
        fileError.value = ui.uploadDirectoryEmpty;
        return null;
      }
      return documentStore.uploadBatch(selectedDirectoryFiles.value, mlStore.provider);
    }
    if (!validateFile(selectedFile.value)) {
      return null;
    }
    return documentStore.upload(selectedFile.value as File, mlStore.provider);
  };

  return {
    mode,
    uploadStatus,
    uploadError,
    selectedFile,
    selectedDirectoryFiles,
    fileError,
    setMode,
    setFile,
    setDirectoryFiles,
    selectionLabel,
    submit,
    resetSelection,
  };
};
